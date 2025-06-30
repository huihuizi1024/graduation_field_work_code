package com.internship.dto;

import lombok.Data;

@Data
public class OrganizationRegistrationRequest {
    // User fields
    private String username;
    private String password;
    private String email;
    private String phone;

    // Institution fields
    private String institutionName;
    private String institutionCode; // This is the social credit code from the form
    private Integer institutionType;
    private String contactPerson;
    private String legalRepresentative;
    private String province;
    private String city;
    private String district;
    private String address;
    private String description;
} 