package com.internship.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class OrganizationRegistrationRequest {
    // User fields
    private String username;
    private String password;
    private String email;
    private String phone;

    // Institution fields
    @JsonProperty("name")
    private String institutionName;
    @JsonProperty("code")
    private String institutionCode; // This is the social credit code from the form
    @JsonProperty("type")
    private Integer institutionType;
    @JsonProperty("institutionLevel")
    private Integer institutionLevel; // 机构级别：1-国家级，2-省级，3-市级，4-区县级
    @JsonProperty("contact")
    private String contactPerson;
    private String legalRepresentative;
    private String province;
    private String city;
    private String district;
    private String address;
    @JsonProperty("description")
    private String institutionDescription;
} 