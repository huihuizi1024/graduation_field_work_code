package com.internship.config;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.internship.entity.User;
import com.internship.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // 检查管理员用户是否已存在
        if (!userRepository.exists(new QueryWrapper<User>().eq("username", "admin"))) {
            User adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setPasswordHash(passwordEncoder.encode("123456")); // 加密默认密码
            adminUser.setFullName("系统管理员");
            adminUser.setRole(4); // 4 代表管理员
            adminUser.setStatus(1); // 启用状态
            adminUser.setEmail("admin@system.com"); // 提供一个默认邮箱
            adminUser.setPhone("10000000000"); // 提供一个默认手机号

            userRepository.insert(adminUser);
            System.out.println(">>> Built-in administrator account created successfully!");
        }
    }
} 