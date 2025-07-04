package com.internship.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("certificate_review_record")
public class CertificateReviewRecord {
    @TableId(type = IdType.AUTO)
    private Long id;

    private Long applicationId;
    private Long standardId;
    private Long applicantId;
    private Long reviewerId;
    private Integer reviewStatus;
    private String reviewComment;
    private LocalDateTime reviewTime;
} 