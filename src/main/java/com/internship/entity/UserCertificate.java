package com.internship.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 用户已获得证书记录
 */
@Data
@TableName("user_certificate")
@Schema(description = "用户证书")
public class UserCertificate {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;

    private Long standardId;

    /** 审核专家ID */
    private Long reviewerId;

    private LocalDateTime issuedTime;

    private LocalDateTime expiryTime;
} 