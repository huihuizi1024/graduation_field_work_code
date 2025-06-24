package com.internship.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web配置类，用于配置CORS
 *
 * @author huihuizi1024
 * @date 2025.6.24
 * @version 1.1.0
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // 允许/api/**路径下的所有请求
                .allowedOrigins("http://localhost:3000") // 允许来自前端的请求
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 允许的HTTP方法
                .allowedHeaders("*") // 允许所有请求头
                .allowCredentials(true) // 允许发送认证信息（如cookies）
                .maxAge(3600); // 预检请求的缓存时间（秒）
    }
} 