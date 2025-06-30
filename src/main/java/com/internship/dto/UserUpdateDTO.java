package com.internship.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class UserUpdateDTO {

    @NotEmpty(message = "Full name cannot be empty")
    private String fullName;

    @NotEmpty(message = "Email cannot be empty")
    @Email(message = "Email should be valid")
    private String email;

    @NotEmpty(message = "Phone number cannot be empty")
    private String phone;
} 