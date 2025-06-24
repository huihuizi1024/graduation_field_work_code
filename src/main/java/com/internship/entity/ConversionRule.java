package com.internship.entity;

import com.baomidou.mybatisplus.annotation.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 转换规则实体类 (MyBatis Plus Version)
 * 
 * @author huihuizi1024
 * @date 2025.6.22
 * @version 1.2.0
 */
@TableName("conversion_rule")
public class ConversionRule implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 规则名称
     */
    @NotBlank(message = "规则名称不能为空")
    @TableField("rule_name")
    private String ruleName;

    /**
     * 规则编码
     */
    @NotBlank(message = "规则编码不能为空")
    @TableField("rule_code")
    private String ruleCode;

    /**
     * 源类型：1-积分，2-学分，3-证书
     */
    @NotNull(message = "源类型不能为空")
    @TableField("source_type")
    private Integer sourceType;

    /**
     * 目标类型：1-积分，2-学分，3-证书
     */
    @NotNull(message = "目标类型不能为空")
    @TableField("target_type")
    private Integer targetType;

    /**
     * 转换比例（源:目标）
     */
    @NotNull(message = "转换比例不能为空")
    @TableField("conversion_ratio")
    private BigDecimal conversionRatio;

    /**
     * 最小转换数量
     */
    @TableField("min_conversion_amount")
    private BigDecimal minConversionAmount;

    /**
     * 最大转换数量
     */
    @TableField("max_conversion_amount")
    private BigDecimal maxConversionAmount;

    /**
     * 转换条件描述
     */
    @TableField("conversion_conditions")
    private String conversionConditions;

    /**
     * 审核要求：0-无需审核，1-需要审核
     */
    @NotNull(message = "审核要求不能为空")
    @TableField("review_required")
    private Integer reviewRequired;

    /**
     * 适用机构ID
     */
    @TableField("applicable_institution_id")
    private Long applicableInstitutionId;

    /**
     * 适用机构名称
     */
    @TableField("applicable_institution_name")
    private String applicableInstitutionName;

    /**
     * 有效期开始时间
     */
    @TableField("effective_start_time")
    private LocalDateTime effectiveStartTime;

    /**
     * 有效期结束时间
     */
    @TableField("effective_end_time")
    private LocalDateTime effectiveEndTime;

    /**
     * 状态：1-有效，0-无效
     */
    @NotNull(message = "状态不能为空")
    @TableField("status")
    private Integer status;

    /**
     * 创建人ID
     */
    @TableField("creator_id")
    private Long creatorId;

    /**
     * 创建人姓名
     */
    @TableField("creator_name")
    private String creatorName;

    /**
     * 审核人ID
     */
    @TableField("reviewer_id")
    private Long reviewerId;

    /**
     * 审核人姓名
     */
    @TableField("reviewer_name")
    private String reviewerName;

    /**
     * 审核状态：0-待审核，1-审核通过，2-审核拒绝
     */
    @TableField("review_status")
    private Integer reviewStatus = 0;

    /**
     * 审核时间
     */
    @TableField("review_time")
    private LocalDateTime reviewTime;

    /**
     * 审核意见
     */
    @TableField("review_comment")
    private String reviewComment;

    /**
     * 创建时间
     */
    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    // Constructors
    public ConversionRule() {}

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRuleName() {
        return ruleName;
    }

    public void setRuleName(String ruleName) {
        this.ruleName = ruleName;
    }

    public String getRuleCode() {
        return ruleCode;
    }

    public void setRuleCode(String ruleCode) {
        this.ruleCode = ruleCode;
    }

    public Integer getSourceType() {
        return sourceType;
    }

    public void setSourceType(Integer sourceType) {
        this.sourceType = sourceType;
    }

    public Integer getTargetType() {
        return targetType;
    }

    public void setTargetType(Integer targetType) {
        this.targetType = targetType;
    }

    public BigDecimal getConversionRatio() {
        return conversionRatio;
    }

    public void setConversionRatio(BigDecimal conversionRatio) {
        this.conversionRatio = conversionRatio;
    }

    public BigDecimal getMinConversionAmount() {
        return minConversionAmount;
    }

    public void setMinConversionAmount(BigDecimal minConversionAmount) {
        this.minConversionAmount = minConversionAmount;
    }

    public BigDecimal getMaxConversionAmount() {
        return maxConversionAmount;
    }

    public void setMaxConversionAmount(BigDecimal maxConversionAmount) {
        this.maxConversionAmount = maxConversionAmount;
    }

    public String getConversionConditions() {
        return conversionConditions;
    }

    public void setConversionConditions(String conversionConditions) {
        this.conversionConditions = conversionConditions;
    }

    public Integer getReviewRequired() {
        return reviewRequired;
    }

    public void setReviewRequired(Integer reviewRequired) {
        this.reviewRequired = reviewRequired;
    }

    public Long getApplicableInstitutionId() {
        return applicableInstitutionId;
    }

    public void setApplicableInstitutionId(Long applicableInstitutionId) {
        this.applicableInstitutionId = applicableInstitutionId;
    }

    public String getApplicableInstitutionName() {
        return applicableInstitutionName;
    }

    public void setApplicableInstitutionName(String applicableInstitutionName) {
        this.applicableInstitutionName = applicableInstitutionName;
    }

    public LocalDateTime getEffectiveStartTime() {
        return effectiveStartTime;
    }

    public void setEffectiveStartTime(LocalDateTime effectiveStartTime) {
        this.effectiveStartTime = effectiveStartTime;
    }

    public LocalDateTime getEffectiveEndTime() {
        return effectiveEndTime;
    }

    public void setEffectiveEndTime(LocalDateTime effectiveEndTime) {
        this.effectiveEndTime = effectiveEndTime;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Long getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(Long creatorId) {
        this.creatorId = creatorId;
    }

    public String getCreatorName() {
        return creatorName;
    }

    public void setCreatorName(String creatorName) {
        this.creatorName = creatorName;
    }

    public Long getReviewerId() {
        return reviewerId;
    }

    public void setReviewerId(Long reviewerId) {
        this.reviewerId = reviewerId;
    }

    public String getReviewerName() {
        return reviewerName;
    }

    public void setReviewerName(String reviewerName) {
        this.reviewerName = reviewerName;
    }

    public Integer getReviewStatus() {
        return reviewStatus;
    }

    public void setReviewStatus(Integer reviewStatus) {
        this.reviewStatus = reviewStatus;
    }

    public LocalDateTime getReviewTime() {
        return reviewTime;
    }

    public void setReviewTime(LocalDateTime reviewTime) {
        this.reviewTime = reviewTime;
    }

    public String getReviewComment() {
        return reviewComment;
    }

    public void setReviewComment(String reviewComment) {
        this.reviewComment = reviewComment;
    }

    public LocalDateTime getCreateTime() {
        return createTime;
    }

    public void setCreateTime(LocalDateTime createTime) {
        this.createTime = createTime;
    }

    public LocalDateTime getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(LocalDateTime updateTime) {
        this.updateTime = updateTime;
    }
} 