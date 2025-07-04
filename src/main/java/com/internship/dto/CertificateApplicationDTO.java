package com.internship.dto;

import com.internship.entity.CertificateApplication;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Schema(description = "证书申请返回对象")
public class CertificateApplicationDTO {
    private Long id;
    private Long userId;
    private Long standardId;
    private String standardName;
    private String evidenceUrl;
    private String description;
    private Integer status;
    private LocalDateTime applyTime;
    private LocalDateTime reviewTime;
    private Long reviewerId;
    private String reviewerName;
    private String reviewComment;

    public static CertificateApplicationDTO from(CertificateApplication app) {
        CertificateApplicationDTO dto = new CertificateApplicationDTO();
        dto.setId(app.getId());
        dto.setUserId(app.getUserId());
        dto.setStandardId(app.getStandardId());
        dto.setEvidenceUrl(app.getEvidenceUrl());
        dto.setDescription(app.getDescription());
        dto.setStatus(app.getStatus());
        dto.setApplyTime(app.getApplyTime());
        dto.setReviewTime(app.getReviewTime());
        dto.setReviewerId(app.getReviewerId());
        dto.setReviewComment(app.getReviewComment());
        return dto;
    }
} 