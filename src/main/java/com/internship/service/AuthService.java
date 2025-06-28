package com.internship.service;


import com.internship.entity.User;
import org.springframework.http.ResponseEntity;

public interface AuthService {
    ResponseEntity<?> authenticate(User user, String identityType);

    ResponseEntity<?> logout();
    ResponseEntity<?> register(User user);
    
    ResponseEntity<?> resetPassword(String username, String newPassword);
}
