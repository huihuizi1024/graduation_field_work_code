package com.internship.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Data
@TableName("certification_standard")
@Schema(description = "认证标准实体")
public class CertificationStandard {

    @TableId(type = IdType.AUTO)
    @Schema(description = "主键ID")
    private Long id;

    @NotBlank(message = "标准名称不能为空")
    @Schema(description = "标准名称")
    private String standardName;

    @NotBlank(message = "标准编码不能为空")
    @Schema(description = "标准编码")
    private String standardCode;

    @Schema(description = "标准描述")
    private String standardDescription;

    @NotNull(message = "标准类别不能为空")
    @Schema(description = "标准类别：1-课程，2-项目，3-活动，4-考试，5-证书")
    private Integer category;

    @Schema(description = "颁发机构")
    private String issuingOrganization;

    @Schema(description = "有效期开始时间")
    private LocalDateTime effectiveStartTime;

    @Schema(description = "有效期结束时间")
    private LocalDateTime effectiveEndTime;

    @Schema(description = "获得此证书可奖励的积分值")
    private Double pointValue;

    @NotNull(message = "状态不能为空")
    @Schema(description = "状态：1-有效，0-无效")
    private Integer status;

    @Schema(description = "创建人ID")
    private Long creatorId;

    @Schema(description = "创建人姓名")
    private String creatorName;

    @Schema(description = "审核人ID")
    private Long reviewerId;

    @Schema(description = "审核人姓名")
    private String reviewerName;

    @Schema(description = "审核状态：0-待审核，1-审核通过，2-审核拒绝")
    private Integer reviewStatus;

    @Schema(description = "审核时间")
    private LocalDateTime reviewTime;

    @Schema(description = "审核意见")
    private String reviewComment;

    @Schema(description = "创建时间")
    private LocalDateTime createTime;

    @Schema(description = "更新时间")
    private LocalDateTime updateTime;
} 