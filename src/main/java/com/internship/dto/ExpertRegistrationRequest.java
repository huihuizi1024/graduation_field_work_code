package com.internship.dto;

import lombok.Data;

@Data
public class ExpertRegistrationRequest {
    // User fields
    private String username;
    private String password;
    private String fullName;
    private String email;
    private String phone;

    // Expert fields
    private String expertise;
    private String description;
} 