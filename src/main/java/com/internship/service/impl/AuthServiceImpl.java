package com.internship.service.impl;

import com.internship.entity.User;
import com.internship.repository.UserRepository;
import com.internship.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.Map;


@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Override

    public ResponseEntity<?> authenticate(User user, String identityType) {

        System.out.println("Login attempt - username: " + user.getUsername());
        
        Optional<User> dbUserOpt = userRepository.findByUsername(user.getUsername());
        if (!dbUserOpt.isPresent()) {
            System.out.println("User not found: " + user.getUsername());
            return ResponseEntity.badRequest().body("Invalid username or password");
        }
        
        User dbUser = dbUserOpt.get();
        String requestPassword = user.getPasswordHash();
        String dbPassword = dbUser.getPasswordHash();
        
        System.out.println("Request password: '" + requestPassword + "'");
        System.out.println("Database password: '" + dbPassword + "'");
        System.out.println("Passwords match? " + requestPassword.equals(dbPassword));
        
        if (!requestPassword.equals(dbPassword)) {
            return ResponseEntity.badRequest().body("Invalid username or password");
        }

        // 验证角色是否匹配
        int expectedRole = 0;
        switch(identityType) {
            case "student":
                expectedRole = 1;
                break;
            case "expert":
                expectedRole = 3;
                break;
            case "organization":
                expectedRole = 2;
                break;
            case "admin":
                expectedRole = 4;
                break;
            default:
                return ResponseEntity.badRequest().body("Invalid login type");
        }


        if (dbUser.getRole() != expectedRole) {
            return ResponseEntity.badRequest().body("Role mismatch - please select correct login type");
        }
        
        System.out.println("Authentication successful for user: " + user.getUsername());

        return ResponseEntity.ok().body(Map.of(
            "status", 200,
            "message", "Login successful",
            "user", dbUser
        ));
    }

    @Override
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok("Logout successful");
    }

    @Override
    public ResponseEntity<?> register(User user) {
        if(userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        userRepository.insert(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @Override
    public ResponseEntity<?> resetPassword(String username, String newPassword) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            return ResponseEntity.badRequest().body("User not found");
        }
        User user = userOpt.get();
        user.setPasswordHash(newPassword);
        userRepository.insert(user);
        return ResponseEntity.ok("Password reset successfully");
    }
}
