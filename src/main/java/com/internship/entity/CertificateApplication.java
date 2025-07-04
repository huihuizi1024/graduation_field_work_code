package com.internship.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 学生证书申请实体
 */
@Data
@TableName("certificate_application")
@Schema(description = "证书申请")
public class CertificateApplication {

    @TableId(type = IdType.AUTO)
    private Long id;

    /** 申请人用户ID */
    private Long userId;

    /** 关联认证标准ID */
    private Long standardId;

    /** 证明材料（可为文件 URL 或描述） */
    private String evidenceUrl;

    /** 申请状态：0-待审核，1-已通过，2-已拒绝 */
    private Integer status;

    /** 申请时间 */
    private LocalDateTime applyTime;

    /** 审核时间 */
    private LocalDateTime reviewTime;

    /** 审核人ID */
    private Long reviewerId;

    /** 审核意见 */
    private String reviewComment;
} 