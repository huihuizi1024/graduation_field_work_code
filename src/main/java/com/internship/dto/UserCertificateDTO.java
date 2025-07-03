package com.internship.dto;

import com.internship.entity.UserCertificate;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Schema(description = "用户证书返回对象")
public class UserCertificateDTO {
    private Long id;
    private Long userId;
    private Long standardId;
    private String standardName;
    private String reviewerName;
    private LocalDateTime issuedTime;
    private LocalDateTime expiryTime;

    public static UserCertificateDTO from(UserCertificate cert) {
        UserCertificateDTO dto = new UserCertificateDTO();
        dto.setId(cert.getId());
        dto.setUserId(cert.getUserId());
        dto.setStandardId(cert.getStandardId());
        dto.setIssuedTime(cert.getIssuedTime());
        dto.setExpiryTime(cert.getExpiryTime());
        return dto;
    }
} 