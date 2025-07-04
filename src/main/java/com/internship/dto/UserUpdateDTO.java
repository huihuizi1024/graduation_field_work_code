package com.internship.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class UserUpdateDTO {

    private String fullName;

    @Email(message = "Email should be valid")
    private String email;

    private String phone;

    private String avatarUrl;
} 