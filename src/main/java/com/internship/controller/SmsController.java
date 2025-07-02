package com.internship.controller;

import com.internship.dto.*;
import com.internship.service.SmsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping("/api/sms")
@Tag(name = "短信验证", description = "短信验证码相关功能")
@Slf4j
public class SmsController {
    
    @Autowired
    private SmsService smsService;
    
    @PostMapping("/send")
    @Operation(summary = "发送短信验证码")
    public ApiResponse<Void> sendSms(@Valid @RequestBody SendSmsRequest request, 
                                   HttpServletRequest httpRequest) {
        String ipAddress = getClientIpAddress(httpRequest);
        log.info("发送短信验证码请求: phone={}, type={}, ip={}", request.getPhone(), request.getType(), ipAddress);
        return smsService.sendVerificationCode(request, ipAddress);
    }
    
    @PostMapping("/login")
    @Operation(summary = "短信验证码登录")
    public ApiResponse<Map<String, Object>> loginWithSms(@Valid @RequestBody SmsLoginRequest request) {
        log.info("短信验证码登录请求: phone={}, identity={}", request.getPhone(), request.getIdentity());
        return smsService.loginWithSms(request);
    }
    
    @PostMapping("/register")
    @Operation(summary = "短信验证码注册")
    public ApiResponse<Map<String, Object>> registerWithSms(@Valid @RequestBody SmsRegisterRequest request) {
        log.info("短信验证码注册请求: phone={}, role={}", request.getPhone(), request.getRole());
        return smsService.registerWithSms(request);
    }
    
    /**
     * 获取客户端真实IP地址
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty() && !"unknown".equalsIgnoreCase(xForwardedFor)) {
            return xForwardedFor.split(",")[0];
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty() && !"unknown".equalsIgnoreCase(xRealIp)) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
} 