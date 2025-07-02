package com.internship.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

@Data
public class SmsRegisterRequest {
    @NotBlank(message = "手机号不能为空")
    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    private String phone;
    
    @NotBlank(message = "验证码不能为空")
    @Pattern(regexp = "^\\d{6}$", message = "验证码格式不正确")
    private String code;
    
    private String username; // 可选，默认使用手机号
    
    @NotBlank(message = "姓名不能为空")
    private String fullName;
    
    @NotNull(message = "用户角色不能为空")
    private Integer role; // 1-学生, 2-机构, 3-专家, 4-管理员
} 