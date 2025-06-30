package com.internship.controller;

import com.internship.dto.ExpertRegistrationRequest;
import com.internship.dto.LoginRequest;
import com.internship.dto.OrganizationRegistrationRequest;
import com.internship.dto.PersonalRegistrationRequest;
import com.internship.entity.User;

import com.internship.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticate(@RequestBody LoginRequest loginRequest) {
        return authService.authenticate(loginRequest);
    }

    @PostMapping("/register/personal")
    public ResponseEntity<?> registerPersonal(@RequestBody PersonalRegistrationRequest request) {
        return authService.register(request);
    }

    @PostMapping("/register/expert")
    public ResponseEntity<?> registerExpert(@RequestBody ExpertRegistrationRequest request) {
        return authService.registerExpert(request);
    }

    @PostMapping("/register/organization")
    public ResponseEntity<?> registerOrganization(@RequestBody OrganizationRegistrationRequest request) {
        return authService.registerOrganization(request);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // Current implementation is simple, can be enhanced with token blacklisting
        return authService.logout();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String username, @RequestParam String newPassword) {
        return authService.resetPassword(username, newPassword);
    }
}
