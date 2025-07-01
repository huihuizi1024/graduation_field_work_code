package com.internship.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.internship.dto.ExpertRegistrationRequest;
import com.internship.dto.LoginRequest;
import com.internship.dto.OrganizationRegistrationRequest;
import com.internship.dto.PersonalRegistrationRequest;
import com.internship.entity.Expert;
import com.internship.entity.Institution;
import com.internship.entity.User;
import com.internship.config.JwtTokenProvider;
import com.internship.repository.ExpertRepository;
import com.internship.repository.InstitutionRepository;
import com.internship.repository.UserRepository;
import com.internship.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private InstitutionRepository institutionRepository;
    @Autowired
    private ExpertRepository expertRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Override
    public ResponseEntity<?> authenticate(LoginRequest loginRequest) {
        Optional<User> dbUserOpt = userRepository.findByUsername(loginRequest.getUsername());
        if (!dbUserOpt.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "无效的用户名或密码"));
        }

        User dbUser = dbUserOpt.get();
        if (!passwordEncoder.matches(loginRequest.getPassword(), dbUser.getPasswordHash())) {
            return ResponseEntity.badRequest().body(Map.of("message", "无效的用户名或密码"));
        }

        int expectedRole = getRoleFromIdentity(loginRequest.getIdentity());
        if (dbUser.getRole() != expectedRole) {
            return ResponseEntity.badRequest().body(Map.of("message", "身份不匹配，请选择正确的登录类型"));
        }

        final String token = jwtTokenProvider.generateToken(dbUser);
        
        return ResponseEntity.ok(Map.of(
            "message", "登录成功",
            "token", token,
            "user", dbUser
        ));
    }
    
    @Override
    @Transactional
    public ResponseEntity<?> register(PersonalRegistrationRequest request) {
        if (userRepository.exists(new QueryWrapper<User>().eq("username", request.getUsername()))) {
            return ResponseEntity.badRequest().body(Map.of("message", "用户名已存在"));
        }
        if (userRepository.exists(new QueryWrapper<User>().eq("email", request.getEmail()))) {
            return ResponseEntity.badRequest().body(Map.of("message", "邮箱已被注册"));
        }
        if (userRepository.exists(new QueryWrapper<User>().eq("phone", request.getPhone()))) {
            return ResponseEntity.badRequest().body(Map.of("message", "手机号已被注册"));
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setRole(request.getRole()); // 1 for student

        userRepository.insert(user);
        return ResponseEntity.ok(Map.of("message", "用户注册成功"));
    }

    @Override
    @Transactional
    public ResponseEntity<?> registerOrganization(OrganizationRegistrationRequest request) {
        log.info(">>>> [DIAGNOSTIC] Received registration request for institution name: '{}'", request.getInstitutionName());
        if (userRepository.exists(new QueryWrapper<User>().eq("username", request.getUsername()))) {
            return ResponseEntity.badRequest().body(Map.of("message", "用户名已存在"));
        }
        
        // 1. 创建并保存机构实体
        Institution institution = new Institution();
        institution.setInstitutionName(request.getInstitutionName());
        institution.setInstitutionCode(request.getInstitutionCode());
        institution.setSocialCreditCode(request.getInstitutionCode()); 
        institution.setInstitutionType(request.getInstitutionType());
        institution.setInstitutionLevel(request.getInstitutionLevel());
        institution.setContactPerson(request.getUsername());
        institution.setContactPhone(request.getPhone());
        institution.setContactEmail(request.getEmail());
        institution.setLegalRepresentative(request.getLegalRepresentative());
        institution.setProvince(request.getProvince());
        institution.setCity(request.getCity());
        institution.setDistrict(request.getDistrict());
        institution.setAddress(request.getAddress());
        institution.setInstitutionDescription(request.getInstitutionDescription());
        institution.setStatus(1); // 设置状态为正常
        institution.setReviewStatus(0); // 设置审核状态为待审核
        institution.setCertificationLevel(4); // 默认认证等级为B级
        institutionRepository.insert(institution);

        // 2. 创建并保存用户实体
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getInstitutionName()); // 设置fullName与institutionName一致
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setRole(2); // 机构角色
        user.setInstitutionId(institution.getId()); 
        user.setStatus(1); // 设置状态为正常
        userRepository.insert(user);

        return ResponseEntity.ok(Map.of("message", "机构注册成功"));
    }
    
    @Override
    @Transactional
    public ResponseEntity<?> registerExpert(ExpertRegistrationRequest request) {
        if (userRepository.exists(new QueryWrapper<User>().eq("username", request.getUsername()))) {
            return ResponseEntity.badRequest().body(Map.of("message", "用户名已存在"));
        }

        // 1. 创建并保存用户实体
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setRole(3); // 专家角色
        userRepository.insert(user);

        // 2. 创建并保存专家实体
        Expert expert = new Expert();
        expert.setId(user.getId()); 
        expert.setName(request.getFullName());
        expert.setExpertise(request.getExpertise());
        expert.setDescription(request.getDescription());
        expert.setContact(request.getEmail());
        expertRepository.insert(expert);
        
        return ResponseEntity.ok(Map.of("message", "专家注册成功"));
    }
    
    @Override
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(Map.of("message", "登出成功"));
    }

    @Override
    public ResponseEntity<?> resetPassword(String username, String newPassword) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.updateById(user);
        return ResponseEntity.ok(Map.of("message", "密码重置成功"));
    }
    
    private int getRoleFromIdentity(String identity) {
        switch (identity) {
            case "student": return 1;
            case "organization": return 2;
            case "expert": return 3;
            case "admin": return 4;
            default: return 0;
        }
    }
}
