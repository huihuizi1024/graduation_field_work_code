package com.internship.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "证书申请请求体")
public class CertificateApplicationRequest {
    @Schema(description = "认证标准ID", required = true)
    private Long standardId;

    @Schema(description = "证明材料URL或描述", required = false)
    private String evidenceUrl;
} 