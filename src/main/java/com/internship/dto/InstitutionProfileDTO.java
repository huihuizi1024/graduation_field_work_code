package com.internship.dto;

import java.time.LocalDateTime;

/**
 * 机构个人资料DTO，结合了institution表和user表的数据
 */
public class InstitutionProfileDTO {
    private Long id;
    private String username;
    private String institutionName;
    private String institutionCode;
    private Integer institutionType;
    private Integer institutionLevel; // 机构级别：1-国家级，2-省级，3-市级，4-区县级
    private Integer certificationLevel; // 认证等级：1-AAA级，2-AA级，3-A级，4-B级，5-C级
    private String socialCreditCode;
    private String legalRepresentative;
    private String contactPerson;
    private String contactEmail;
    private String contactPhone;
    private String address;
    private String province;
    private String city;
    private String district;
    private String institutionDescription;
    private Integer status;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private Double pointsBalance;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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

    public Integer getCertificationLevel() {
        return certificationLevel;
    }

    public void setCertificationLevel(Integer certificationLevel) {
        this.certificationLevel = certificationLevel;
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

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
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

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
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

    public Double getPointsBalance() {
        return pointsBalance;
    }

    public void setPointsBalance(Double pointsBalance) {
        this.pointsBalance = pointsBalance;
    }
} 