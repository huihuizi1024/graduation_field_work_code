package com.internship.dto;

import com.internship.entity.Expert;
import com.internship.entity.User;
import lombok.Data;

@Data
public class ExpertProfileDTO {
    // From User
    private Long id;
    private String username;
    private String fullName;
    private String email;
    private String phone;

    // From Expert
    private String expertise;
    private String description;

    public ExpertProfileDTO(User user, Expert expert) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.fullName = user.getFullName();
        this.email = user.getEmail();
        this.phone = user.getPhone();
        
        if (expert != null) {
            this.expertise = expert.getExpertise();
            this.description = expert.getDescription();
        }
    }
} 