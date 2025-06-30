package com.internship.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class ExpertUpdateDTO extends UserUpdateDTO {

    @NotEmpty(message = "Expertise cannot be empty")
    private String expertise;

    private String description;
} 