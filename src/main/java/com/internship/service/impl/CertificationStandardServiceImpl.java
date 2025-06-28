package com.internship.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.internship.dto.PageResponse;
import com.internship.entity.CertificationStandard;
import com.internship.exception.BusinessException;
import com.internship.repository.CertificationStandardRepository;
import com.internship.service.CertificationStandardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CertificationStandardServiceImpl implements CertificationStandardService {

    @Autowired
    private CertificationStandardRepository certificationStandardRepository;

    @Override
    public CertificationStandard createCertificationStandard(CertificationStandard certificationStandard) {
        if (certificationStandardRepository.selectOne(new LambdaQueryWrapper<CertificationStandard>()
                .eq(CertificationStandard::getStandardCode, certificationStandard.getStandardCode())) != null) {
            throw new BusinessException("认证标准编码已存在");
        }
        certificationStandard.setCreateTime(LocalDateTime.now());
        certificationStandard.setUpdateTime(LocalDateTime.now());
        certificationStandard.setReviewStatus(0); // 默认待审核
        certificationStandard.setStatus(1); // 默认有效
        certificationStandardRepository.insert(certificationStandard);
        return certificationStandard;
    }

    @Override
    public CertificationStandard updateCertificationStandard(Long id, CertificationStandard certificationStandard) {
        CertificationStandard existingStandard = certificationStandardRepository.selectById(id);
        if (existingStandard == null) {
            throw new BusinessException("认证标准不存在");
        }
        // 检查编码是否被其他标准占用
        CertificationStandard standardWithSameCode = certificationStandardRepository.selectOne(new LambdaQueryWrapper<CertificationStandard>()
                .eq(CertificationStandard::getStandardCode, certificationStandard.getStandardCode()));
        if (standardWithSameCode != null && !standardWithSameCode.getId().equals(id)) {
            throw new BusinessException("认证标准编码已存在");
        }
        certificationStandard.setId(id);
        certificationStandard.setUpdateTime(LocalDateTime.now());
        certificationStandardRepository.updateById(certificationStandard);
        return certificationStandard;
    }

    @Override
    public void deleteCertificationStandard(Long id) {
        CertificationStandard existingStandard = certificationStandardRepository.selectById(id);
        if (existingStandard == null) {
            throw new BusinessException("认证标准不存在");
        }
        existingStandard.setStatus(0); // 软删除，将状态设为0（无效）
        existingStandard.setUpdateTime(LocalDateTime.now());
        certificationStandardRepository.updateById(existingStandard);
    }

    @Override
    public CertificationStandard getCertificationStandardById(Long id) {
        return certificationStandardRepository.selectById(id);
    }

    @Override
    public PageResponse<CertificationStandard> getCertificationStandards(Integer page, Integer size, String standardName, Integer category, Integer status, Integer reviewStatus) {
        Page<CertificationStandard> pageCondition = new Page<>(page + 1, size); // 后端页码从1开始
        LambdaQueryWrapper<CertificationStandard> queryWrapper = new LambdaQueryWrapper<>();

        if (StringUtils.hasText(standardName)) {
            queryWrapper.like(CertificationStandard::getStandardName, standardName);
        }
        if (category != null) {
            queryWrapper.eq(CertificationStandard::getCategory, category);
        }
        if (status != null) {
            queryWrapper.eq(CertificationStandard::getStatus, status);
        }
        if (reviewStatus != null) {
            queryWrapper.eq(CertificationStandard::getReviewStatus, reviewStatus);
        }

        IPage<CertificationStandard> iPage = certificationStandardRepository.selectPage(pageCondition, queryWrapper);
        return new PageResponse<CertificationStandard>(Integer.valueOf((int) (iPage.getCurrent() - 1)), Integer.valueOf((int) iPage.getSize()), Long.valueOf(iPage.getTotal()), iPage.getRecords());
    }

    @Override
    public void reviewCertificationStandard(Long id, Integer reviewStatus, String reviewComment) {
        CertificationStandard existingStandard = certificationStandardRepository.selectById(id);
        if (existingStandard == null) {
            throw new BusinessException("认证标准不存在");
        }
        existingStandard.setReviewStatus(reviewStatus);
        existingStandard.setReviewComment(reviewComment);
        existingStandard.setReviewTime(LocalDateTime.now());
        existingStandard.setUpdateTime(LocalDateTime.now());
        // TODO: 审核人ID和姓名需要从当前登录用户获取
        existingStandard.setReviewerId(1L);
        existingStandard.setReviewerName("系统管理员");
        certificationStandardRepository.updateById(existingStandard);
    }

    @Override
    public void changeCertificationStandardStatus(Long id, Integer status) {
        CertificationStandard existingStandard = certificationStandardRepository.selectById(id);
        if (existingStandard == null) {
            throw new BusinessException("认证标准不存在");
        }
        existingStandard.setStatus(status);
        existingStandard.setUpdateTime(LocalDateTime.now());
        certificationStandardRepository.updateById(existingStandard);
    }

    @Override
    public Map<String, Object> getCertificationStandardStatistics() {
        Map<String, Object> statistics = new HashMap<>();
        statistics.put("totalStandards", certificationStandardRepository.selectCount(null));
        statistics.put("activeStandards", certificationStandardRepository.selectCount(new LambdaQueryWrapper<CertificationStandard>().eq(CertificationStandard::getStatus, 1)));
        statistics.put("pendingReview", certificationStandardRepository.selectCount(new LambdaQueryWrapper<CertificationStandard>().eq(CertificationStandard::getReviewStatus, 0)));
        statistics.put("approvedReview", certificationStandardRepository.selectCount(new LambdaQueryWrapper<CertificationStandard>().eq(CertificationStandard::getReviewStatus, 1)));
        statistics.put("rejectedReview", certificationStandardRepository.selectCount(new LambdaQueryWrapper<CertificationStandard>().eq(CertificationStandard::getReviewStatus, 2)));
        return statistics;
    }

    @Override
    public List<CertificationStandard> exportCertificationStandards(Integer category, Integer status) {
        LambdaQueryWrapper<CertificationStandard> queryWrapper = new LambdaQueryWrapper<>();
        if (category != null) {
            queryWrapper.eq(CertificationStandard::getCategory, category);
        }
        if (status != null) {
            queryWrapper.eq(CertificationStandard::getStatus, status);
        }
        return certificationStandardRepository.selectList(queryWrapper);
    }
} 