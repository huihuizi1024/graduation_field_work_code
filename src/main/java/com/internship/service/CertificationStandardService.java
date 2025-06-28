package com.internship.service;

import com.internship.dto.PageResponse;
import com.internship.entity.CertificationStandard;

import java.util.List;
import java.util.Map;

public interface CertificationStandardService {

    CertificationStandard createCertificationStandard(CertificationStandard certificationStandard);

    CertificationStandard updateCertificationStandard(Long id, CertificationStandard certificationStandard);

    void deleteCertificationStandard(Long id);

    CertificationStandard getCertificationStandardById(Long id);

    PageResponse<CertificationStandard> getCertificationStandards(Integer page, Integer size, String standardName, Integer category, Integer status, Integer reviewStatus);

    void reviewCertificationStandard(Long id, Integer reviewStatus, String reviewComment);

    void changeCertificationStandardStatus(Long id, Integer status);

    Map<String, Object> getCertificationStandardStatistics();

    List<CertificationStandard> exportCertificationStandards(Integer category, Integer status);
} 