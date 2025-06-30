package com.internship.service;

import com.internship.dto.ExpertRegistrationRequest;
import com.internship.dto.LoginRequest;
import com.internship.dto.OrganizationRegistrationRequest;
import com.internship.dto.PersonalRegistrationRequest;
import com.internship.entity.User;
import org.springframework.http.ResponseEntity;

public interface AuthService {
    ResponseEntity<?> authenticate(LoginRequest loginRequest);

    ResponseEntity<?> logout();
    ResponseEntity<?> register(PersonalRegistrationRequest request);
    ResponseEntity<?> registerOrganization(OrganizationRegistrationRequest request);
    ResponseEntity<?> registerExpert(ExpertRegistrationRequest request);
    
    ResponseEntity<?> resetPassword(String username, String newPassword);
}
