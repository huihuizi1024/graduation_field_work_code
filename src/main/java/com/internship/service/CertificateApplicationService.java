package com.internship.service;

import com.internship.dto.CertificateApplicationDTO;
import com.internship.dto.UserCertificateDTO;

import java.util.List;

public interface CertificateApplicationService {

    com.internship.entity.CertificateApplication apply(Long userId, Long standardId, String evidenceUrl);

    List<CertificateApplicationDTO> getMyApplications(Long userId);

    void review(Long applicationId, Long reviewerId, Integer reviewStatus, String reviewComment);

    List<CertificateApplicationDTO> listAll(Integer status);

    List<UserCertificateDTO> getUserCertificates(Long userId);

    /**
     * 获取专家审核记录
     */
    List<CertificateApplicationDTO> getReviewedApplications(Long reviewerId);

    /** 取消未审核的申请 */
    void cancelApplication(Long applicationId, Long userId);

    /** 根据ID获取申请详情 */
    CertificateApplicationDTO getApplicationById(Long applicationId);
} 