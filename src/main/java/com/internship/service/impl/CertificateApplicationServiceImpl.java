package com.internship.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.internship.entity.*;
import com.internship.exception.BusinessException;
import com.internship.repository.CertificateApplicationRepository;
import com.internship.repository.UserCertificateRepository;
import com.internship.repository.CertificationStandardRepository;
import com.internship.repository.UserRepository;
import com.internship.repository.CertificateReviewRecordRepository;
import com.internship.service.CertificateApplicationService;
import com.internship.dto.CertificateApplicationDTO;
import com.internship.dto.UserCertificateDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CertificateApplicationServiceImpl implements CertificateApplicationService {

    @Autowired
    private CertificateApplicationRepository applicationRepository;

    @Autowired
    private CertificationStandardRepository certificationStandardRepository;

    @Autowired
    private UserCertificateRepository userCertificateRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CertificateReviewRecordRepository reviewRecordRepository;

    @Override
    @Transactional
    public CertificateApplication apply(Long userId, Long standardId, String evidenceUrl) {
        CertificationStandard standard = certificationStandardRepository.selectById(standardId);
        if (standard == null || standard.getStatus() != 1) {
            throw new BusinessException("认证标准不存在或已失效");
        }
        // 已有申请（待审核/已通过）
        CertificateApplication existing = applicationRepository.selectOne(new LambdaQueryWrapper<CertificateApplication>()
                .eq(CertificateApplication::getUserId, userId)
                .eq(CertificateApplication::getStandardId, standardId)
                .in(CertificateApplication::getStatus, 0, 1));
        if (existing != null) {
            throw new BusinessException("已提交或已获得该证书，无需重复申请");
        }

        // 已经持有证书
        Long certCount = userCertificateRepository.selectCount(new LambdaQueryWrapper<UserCertificate>()
                .eq(UserCertificate::getUserId, userId)
                .eq(UserCertificate::getStandardId, standardId));
        boolean hasCert = certCount != null && certCount > 0;
        if (hasCert) {
            throw new BusinessException("您已获得该证书，无需再次申请");
        }

        CertificateApplication app = new CertificateApplication();
        app.setUserId(userId);
        app.setStandardId(standardId);
        app.setEvidenceUrl(evidenceUrl);
        app.setStatus(0);
        app.setApplyTime(LocalDateTime.now());
        applicationRepository.insert(app);
        return app;
    }

    @Override
    public List<CertificateApplicationDTO> getMyApplications(Long userId) {
        List<CertificateApplication> list = applicationRepository.selectList(new LambdaQueryWrapper<CertificateApplication>()
                .eq(CertificateApplication::getUserId, userId)
                .orderByDesc(CertificateApplication::getApplyTime));
        return enrich(list);
    }

    @Override
    @Transactional
    public void review(Long applicationId, Long reviewerId, Integer reviewStatus, String reviewComment) {
        CertificateApplication app = applicationRepository.selectById(applicationId);
        if (app == null || app.getStatus() != 0) {
            throw new BusinessException("申请不存在或已审核");
        }
        if (reviewStatus == 2 && (reviewComment == null || reviewComment.trim().isEmpty())) {
            throw new BusinessException("拒绝申请必须填写理由");
        }
        app.setStatus(reviewStatus);
        app.setReviewerId(reviewerId);
        app.setReviewComment(reviewComment);
        app.setReviewTime(LocalDateTime.now());
        applicationRepository.updateById(app);

        // 记录审核日志
        CertificateReviewRecord rec = new CertificateReviewRecord();
        rec.setApplicationId(app.getId());
        rec.setStandardId(app.getStandardId());
        rec.setApplicantId(app.getUserId());
        rec.setReviewerId(reviewerId);
        rec.setReviewStatus(reviewStatus);
        rec.setReviewComment(reviewComment);
        rec.setReviewTime(app.getReviewTime());
        reviewRecordRepository.insert(rec);

        if (reviewStatus == 1) { // approved -> create certificate
            UserCertificate cert = new UserCertificate();
            cert.setUserId(app.getUserId());
            cert.setStandardId(app.getStandardId());
            cert.setReviewerId(reviewerId);
            cert.setIssuedTime(LocalDateTime.now());
            userCertificateRepository.insert(cert);
        }
    }

    @Override
    public List<CertificateApplicationDTO> listAll(Integer status) {
        LambdaQueryWrapper<CertificateApplication> wrapper = new LambdaQueryWrapper<>();
        if (status != null) {
            wrapper.eq(CertificateApplication::getStatus, status);
        }
        wrapper.orderByDesc(CertificateApplication::getApplyTime);
        return enrich(applicationRepository.selectList(wrapper));
    }

    @Override
    public List<UserCertificateDTO> getUserCertificates(Long userId) {
        List<UserCertificate> list = userCertificateRepository.selectList(new LambdaQueryWrapper<UserCertificate>()
                .eq(UserCertificate::getUserId, userId));
        return enrichCert(list);
    }

    @Override
    public List<CertificateApplicationDTO> getReviewedApplications(Long reviewerId) {
        // 直接从审核记录表取
        List<CertificateReviewRecord> records = reviewRecordRepository.selectList(new LambdaQueryWrapper<CertificateReviewRecord>()
                .eq(CertificateReviewRecord::getReviewerId, reviewerId)
                .orderByDesc(CertificateReviewRecord::getReviewTime));
        // Map to DTO using existing enrich with apps load
        List<Long> appIds = records.stream().map(CertificateReviewRecord::getApplicationId).toList();
        if(appIds.isEmpty()) return java.util.Collections.emptyList();
        List<CertificateApplication> apps = applicationRepository.selectBatchIds(appIds);
        return enrich(apps);
    }

    @Override
    public void cancelApplication(Long applicationId, Long userId) {
        CertificateApplication app = applicationRepository.selectById(applicationId);
        if (app == null || !app.getUserId().equals(userId)) {
            throw new BusinessException("申请不存在");
        }
        if (app.getStatus() != 0) {
            throw new BusinessException("仅待审核状态可取消");
        }
        // 将状态更新为3-已取消，而非物理删除，保留申请记录
        app.setStatus(3);
        applicationRepository.updateById(app);
        // 如果存在审核记录冗余则无需处理，因为未审核不会写记录
    }

    @Override
    public CertificateApplicationDTO getApplicationById(Long applicationId) {
        CertificateApplication app = applicationRepository.selectById(applicationId);
        if (app == null) {
            throw new BusinessException("申请不存在");
        }
        return enrich(java.util.List.of(app)).get(0);
    }

    /**
     * 填充标准名称、审核人姓名
     */
    private List<CertificateApplicationDTO> enrich(List<CertificateApplication> apps) {
        if (apps == null || apps.isEmpty()) return java.util.Collections.emptyList();
        java.util.Map<Long, CertificationStandard> stdMap = new java.util.HashMap<>();
        java.util.Map<Long, String> userNameMap = new java.util.HashMap<>();
        return apps.stream().map(a -> {
            CertificateApplicationDTO dto = CertificateApplicationDTO.from(a);
            CertificationStandard std = stdMap.computeIfAbsent(a.getStandardId(), certificationStandardRepository::selectById);
            if (std != null) dto.setStandardName(std.getStandardName());
            if (a.getReviewerId() != null) {
                String name = userNameMap.computeIfAbsent(a.getReviewerId(), id -> userRepository.selectById(id) != null ? userRepository.selectById(id).getFullName() : null);
                dto.setReviewerName(name);
            }
            return dto;
        }).toList();
    }

    private List<UserCertificateDTO> enrichCert(List<UserCertificate> certs) {
        if (certs == null || certs.isEmpty()) return java.util.Collections.emptyList();
        java.util.Map<Long, CertificationStandard> stdMap = new java.util.HashMap<>();
        java.util.Map<Long, String> userNameMap = new java.util.HashMap<>();
        return certs.stream().map(c -> {
            UserCertificateDTO dto = UserCertificateDTO.from(c);
            CertificationStandard std = stdMap.computeIfAbsent(c.getStandardId(), certificationStandardRepository::selectById);
            if (std != null) dto.setStandardName(std.getStandardName());
            if (c.getReviewerId() != null) {
                String name = userNameMap.computeIfAbsent(c.getReviewerId(), id -> {
                    var u = userRepository.selectById(id);
                    return u != null ? u.getFullName() : null;
                });
                dto.setReviewerName(name);
            }
            return dto;
        }).toList();
    }
} 