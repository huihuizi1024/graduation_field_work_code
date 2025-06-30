package com.internship.dto;

import lombok.Data;

@Data
public class PersonalRegistrationRequest {
    private String username;
    private String password;
    private String fullName;
    private String email;
    private String phone;
    private Integer role; // 1 for Student, 2 for (potential future personal roles)
} 