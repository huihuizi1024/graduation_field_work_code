package com.internship.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
    private String identity; // E.g., "student", "expert", "admin", "organization"
} 