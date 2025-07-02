package com.internship.service;

import com.internship.dto.ApiResponse;
import com.internship.dto.SendSmsRequest;
import com.internship.dto.SmsLoginRequest;
import com.internship.dto.SmsRegisterRequest;

import java.util.Map;

public interface SmsService {
    /**
     * 发送短信验证码
     */
    ApiResponse<Void> sendVerificationCode(SendSmsRequest request, String ipAddress);
    
    /**
     * 验证验证码
     */
    boolean verifyCode(String phone, String code);
    
    /**
     * 短信验证码登录
     */
    ApiResponse<Map<String, Object>> loginWithSms(SmsLoginRequest request);
    
    /**
     * 短信验证码注册
     */
    ApiResponse<Map<String, Object>> registerWithSms(SmsRegisterRequest request);
} 