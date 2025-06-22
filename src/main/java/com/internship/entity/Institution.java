package com.internship.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * 机构管理实体类
 * 
 * @author huihuizi1024
 * @date 2025.6.22
 * @version 1.1.0
 */
@Entity
@Table(name = "institution")
public class Institution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 机构名称
     */
    @NotBlank(message = "机构名称不能为空")
    @Column(name = "institution_name", nullable = false, length = 100)
    private String institutionName;

    /**
     * 机构代码
     */
    @NotBlank(message = "机构代码不能为空")
    @Column(name = "institution_code", nullable = false, unique = true, length = 50)
    private String institutionCode;

    /**
     * 机构类型：1-高等院校，2-职业院校，3-培训机构，4-社会组织
     */
    @NotNull(message = "机构类型不能为空")
    @Column(name = "institution_type", nullable = false)
    private Integer institutionType;

    /**
     * 机构级别：1-国家级，2-省级，3-市级，4-区县级
     */
    @Column(name = "institution_level")
    private Integer institutionLevel;

    /**
     * 统一社会信用代码
     */
    @Column(name = "social_credit_code", length = 50)
    private String socialCreditCode;

    /**
     * 法定代表人
     */
    @Column(name = "legal_representative", length = 50)
    private String legalRepresentative;

    /**
     * 联系人
     */
    @Column(name = "contact_person", length = 50)
    private String contactPerson;

    /**
     * 联系电话
     */
    @Column(name = "contact_phone", length = 20)
    private String contactPhone;

    /**
     * 联系邮箱
     */
    @Column(name = "contact_email", length = 100)
    private String contactEmail;

    /**
     * 详细地址
     */
    @Column(name = "address", length = 200)
    private String address;

    /**
     * 省份
     */
    @Column(name = "province", length = 50)
    private String province;

    /**
     * 城市
     */
    @Column(name = "city", length = 50)
    private String city;

    /**
     * 区县
     */
    @Column(name = "district", length = 50)
    private String district;

    /**
     * 机构简介
     */
    @Column(name = "institution_description", length = 1000)
    private String institutionDescription;

    /**
     * 业务范围
     */
    @Column(name = "business_scope", length = 500)
    private String businessScope;

    /**
     * 认证等级：1-AAA级，2-AA级，3-A级，4-B级，5-C级
     */
    @Column(name = "certification_level")
    private Integer certificationLevel;

    /**
     * 认证有效期
     */
    @Column(name = "certification_expiry_date")
    private LocalDateTime certificationExpiryDate;

    /**
     * 状态：1-正常，2-暂停，3-注销
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
    public Institution() {}

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getInstitutionName() {
        return institutionName;
    }

    public void setInstitutionName(String institutionName) {
        this.institutionName = institutionName;
    }

    public String getInstitutionCode() {
        return institutionCode;
    }

    public void setInstitutionCode(String institutionCode) {
        this.institutionCode = institutionCode;
    }

    public Integer getInstitutionType() {
        return institutionType;
    }

    public void setInstitutionType(Integer institutionType) {
        this.institutionType = institutionType;
    }

    public Integer getInstitutionLevel() {
        return institutionLevel;
    }

    public void setInstitutionLevel(Integer institutionLevel) {
        this.institutionLevel = institutionLevel;
    }

    public String getSocialCreditCode() {
        return socialCreditCode;
    }

    public void setSocialCreditCode(String socialCreditCode) {
        this.socialCreditCode = socialCreditCode;
    }

    public String getLegalRepresentative() {
        return legalRepresentative;
    }

    public void setLegalRepresentative(String legalRepresentative) {
        this.legalRepresentative = legalRepresentative;
    }

    public String getContactPerson() {
        return contactPerson;
    }

    public void setContactPerson(String contactPerson) {
        this.contactPerson = contactPerson;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getInstitutionDescription() {
        return institutionDescription;
    }

    public void setInstitutionDescription(String institutionDescription) {
        this.institutionDescription = institutionDescription;
    }

    public String getBusinessScope() {
        return businessScope;
    }

    public void setBusinessScope(String businessScope) {
        this.businessScope = businessScope;
    }

    public Integer getCertificationLevel() {
        return certificationLevel;
    }

    public void setCertificationLevel(Integer certificationLevel) {
        this.certificationLevel = certificationLevel;
    }

    public LocalDateTime getCertificationExpiryDate() {
        return certificationExpiryDate;
    }

    public void setCertificationExpiryDate(LocalDateTime certificationExpiryDate) {
        this.certificationExpiryDate = certificationExpiryDate;
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