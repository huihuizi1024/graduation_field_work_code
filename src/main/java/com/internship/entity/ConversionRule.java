package com.internship.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 转换规则实体类
 * 
 * @author huihuizi1024
 * @date 2025.6.22
 * @version 1.1.0
 */
@Entity
@Table(name = "conversion_rule")
public class ConversionRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 规则名称
     */
    @NotBlank(message = "规则名称不能为空")
    @Column(name = "rule_name", nullable = false, length = 100)
    private String ruleName;

    /**
     * 规则编码
     */
    @NotBlank(message = "规则编码不能为空")
    @Column(name = "rule_code", nullable = false, unique = true, length = 50)
    private String ruleCode;

    /**
     * 源类型：1-积分，2-学分，3-证书
     */
    @NotNull(message = "源类型不能为空")
    @Column(name = "source_type", nullable = false)
    private Integer sourceType;

    /**
     * 目标类型：1-积分，2-学分，3-证书
     */
    @NotNull(message = "目标类型不能为空")
    @Column(name = "target_type", nullable = false)
    private Integer targetType;

    /**
     * 转换比例（源:目标）
     */
    @NotNull(message = "转换比例不能为空")
    @Column(name = "conversion_ratio", nullable = false, precision = 10, scale = 4)
    private BigDecimal conversionRatio;

    /**
     * 最小转换数量
     */
    @Column(name = "min_conversion_amount", precision = 10, scale = 2)
    private BigDecimal minConversionAmount;

    /**
     * 最大转换数量
     */
    @Column(name = "max_conversion_amount", precision = 10, scale = 2)
    private BigDecimal maxConversionAmount;

    /**
     * 转换条件描述
     */
    @Column(name = "conversion_conditions", length = 1000)
    private String conversionConditions;

    /**
     * 审核要求：0-无需审核，1-需要审核
     */
    @NotNull(message = "审核要求不能为空")
    @Column(name = "review_required", nullable = false)
    private Integer reviewRequired;

    /**
     * 适用机构ID
     */
    @Column(name = "applicable_institution_id")
    private Long applicableInstitutionId;

    /**
     * 适用机构名称
     */
    @Column(name = "applicable_institution_name", length = 100)
    private String applicableInstitutionName;

    /**
     * 有效期开始时间
     */
    @Column(name = "effective_start_time")
    private LocalDateTime effectiveStartTime;

    /**
     * 有效期结束时间
     */
    @Column(name = "effective_end_time")
    private LocalDateTime effectiveEndTime;

    /**
     * 状态：1-有效，0-无效
     */
    @NotNull(message = "状态不能为空")
    @Column(name = "status", nullable = false)
    private Integer status;

    /**
     * 创建人ID
     */
    @Column(name = "creator_id")
    private Long creatorId;

    /**
     * 创建人姓名
     */
    @Column(name = "creator_name", length = 50)
    private String creatorName;

    /**
     * 审核人ID
     */
    @Column(name = "reviewer_id")
    private Long reviewerId;

    /**
     * 审核人姓名
     */
    @Column(name = "reviewer_name", length = 50)
    private String reviewerName;

    /**
     * 审核状态：0-待审核，1-审核通过，2-审核拒绝
     */
    @Column(name = "review_status", nullable = false)
    private Integer reviewStatus = 0;

    /**
     * 审核时间
     */
    @Column(name = "review_time")
    private LocalDateTime reviewTime;

    /**
     * 审核意见
     */
    @Column(name = "review_comment", length = 500)
    private String reviewComment;

    /**
     * 创建时间
     */
    @CreationTimestamp
    @Column(name = "create_time", nullable = false)
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @UpdateTimestamp
    @Column(name = "update_time", nullable = false)
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