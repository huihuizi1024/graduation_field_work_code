package com.internship.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.internship.config.JwtTokenProvider;
import com.internship.dto.*;
import com.internship.entity.User;
import com.internship.repository.UserRepository;
import com.internship.service.SmsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class SmsServiceImpl implements SmsService {
    
    @Autowired(required = false)
    private RedisTemplate<String, Object> redisTemplate;
    
    // 内存存储作为Redis的降级方案
    private final Map<String, String> memoryCodeStore = new ConcurrentHashMap<>();
    private final Map<String, Long> memoryExpireStore = new ConcurrentHashMap<>();
    private final Map<String, Integer> memoryCountStore = new ConcurrentHashMap<>();
    
    private boolean redisAvailable = false;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    // 从配置文件读取参数
    @Value("${sms.code.length:6}")
    private int codeLength;
    
    @Value("${sms.code.expire-minutes:5}")
    private int expireMinutes;
    
    @Value("${sms.code.max-send-per-day:10}")
    private int maxSendPerDay;
    
    @Value("${sms.code.resend-interval-seconds:60}")
    private int resendIntervalSeconds;
    
    // Redis键前缀
    private static final String SMS_CODE_PREFIX = "sms:code:";
    private static final String SMS_SEND_COUNT_PREFIX = "sms:count:";
    private static final String IP_LIMIT_PREFIX = "sms:ip:";
    
    /**
     * Bean初始化后检查Redis可用性
     */
    @PostConstruct
    public void init() {
        checkRedisAvailability();
    }
    
    /**
     * 检查Redis是否可用
     */
    private void checkRedisAvailability() {
        if (redisTemplate != null) {
            try {
                redisTemplate.opsForValue().get("health_check");
                redisAvailable = true;
                log.info("Redis连接正常，使用Redis存储验证码");
            } catch (Exception e) {
                redisAvailable = false;
                log.warn("Redis连接失败，使用内存存储验证码: {}", e.getMessage());
            }
        } else {
            redisAvailable = false;
            log.warn("Redis未配置，使用内存存储验证码");
        }
    }
    
    /**
     * 存储验证码
     */
    private void storeCode(String key, String code, int expireMinutes) {
        if (redisAvailable) {
            redisTemplate.opsForValue().set(key, code, expireMinutes, TimeUnit.MINUTES);
        } else {
            memoryCodeStore.put(key, code);
            long expireTime = System.currentTimeMillis() + expireMinutes * 60 * 1000;
            memoryExpireStore.put(key, expireTime);
        }
    }
    
    /**
     * 获取验证码
     */
    private String getCode(String key) {
        if (redisAvailable) {
            return (String) redisTemplate.opsForValue().get(key);
        } else {
            // 检查是否过期
            Long expireTime = memoryExpireStore.get(key);
            if (expireTime != null && System.currentTimeMillis() > expireTime) {
                memoryCodeStore.remove(key);
                memoryExpireStore.remove(key);
                return null;
            }
            return memoryCodeStore.get(key);
        }
    }
    
    /**
     * 删除验证码
     */
    private void deleteCode(String key) {
        if (redisAvailable) {
            redisTemplate.delete(key);
        } else {
            memoryCodeStore.remove(key);
            memoryExpireStore.remove(key);
        }
    }
    
    /**
     * 获取计数
     */
    private Integer getCount(String key) {
        if (redisAvailable) {
            return (Integer) redisTemplate.opsForValue().get(key);
        } else {
            return memoryCountStore.get(key);
        }
    }
    
    /**
     * 设置计数
     */
    private void setCount(String key, int count, int expireHours) {
        if (redisAvailable) {
            redisTemplate.opsForValue().set(key, count, expireHours, TimeUnit.HOURS);
        } else {
            memoryCountStore.put(key, count);
        }
    }
    
    /**
     * 增加计数
     */
    private void incrementCount(String key) {
        if (redisAvailable) {
            redisTemplate.opsForValue().increment(key);
        } else {
            memoryCountStore.merge(key, 1, Integer::sum);
        }
    }
    
    /**
     * 获取过期时间（秒）
     */
    private Long getExpire(String key) {
        if (redisAvailable) {
            return redisTemplate.getExpire(key, TimeUnit.SECONDS);
        } else {
            Long expireTime = memoryExpireStore.get(key);
            if (expireTime != null) {
                long remainingSeconds = (expireTime - System.currentTimeMillis()) / 1000;
                return remainingSeconds > 0 ? remainingSeconds : -1L;
            }
            return null;
        }
    }
    
    @Override
    public ApiResponse<Void> sendVerificationCode(SendSmsRequest request, String ipAddress) {
        String phone = request.getPhone();
        
        log.info("收到短信验证码发送请求: phone={}, type={}, ip={}", phone, request.getType(), ipAddress);
        
        // 0. 检查Redis可用性
        checkRedisAvailability();
        
        // 1. 检查发送频率限制
        String sendCountKey = SMS_SEND_COUNT_PREFIX + phone;
        String ipLimitKey = IP_LIMIT_PREFIX + ipAddress;
        
        Integer phoneCount = getCount(sendCountKey);
        Integer ipCount = getCount(ipLimitKey);
        
        if (phoneCount != null && phoneCount >= maxSendPerDay) {
            return ApiResponse.error("今日发送次数已达上限");
        }
        
        if (ipCount != null && ipCount >= 20) { // IP每小时最多20次
            return ApiResponse.error("IP发送频率过高，请稍后再试");
        }
        
        // 2. 检查重复发送间隔
        String codeKey = SMS_CODE_PREFIX + phone;
        Long ttl = getExpire(codeKey);
        if (ttl != null && ttl > (expireMinutes * 60 - resendIntervalSeconds)) {
            return ApiResponse.error("验证码发送过于频繁，请稍后再试");
        }
        
        // 3. 生成验证码
        String code = generateCode();
        
        // 4. 调用模拟短信发送服务
        boolean sendSuccess = simulateSmsService(phone, code, request.getType());
        
        if (!sendSuccess) {
            log.error("模拟短信发送失败: phone={}", phone);
            return ApiResponse.error("短信发送失败，请稍后重试");
        }
        
        // 5. 存储验证码
        storeCode(codeKey, code, expireMinutes);
        
        // 6. 更新发送计数
        if (phoneCount == null) {
            setCount(sendCountKey, 1, 24);
        } else {
            incrementCount(sendCountKey);
        }
        
        if (ipCount == null) {
            setCount(ipLimitKey, 1, 1);
        } else {
            incrementCount(ipLimitKey);
        }
        
        log.info("短信验证码发送成功: phone={}, code={}", phone, code);
        return ApiResponse.success("验证码发送成功");
    }
    
    @Override
    public boolean verifyCode(String phone, String code) {
        String codeKey = SMS_CODE_PREFIX + phone;
        String storedCode = getCode(codeKey);
        
        log.info("验证验证码: phone={}, inputCode={}, storedCode={}", phone, code, storedCode);
        
        if (storedCode == null) {
            log.warn("验证码不存在或已过期: phone={}", phone);
            return false;
        }
        
        boolean isValid = storedCode.equals(code);
        if (isValid) {
            // 验证成功后删除验证码
            deleteCode(codeKey);
            log.info("验证码验证成功: phone={}", phone);
        } else {
            log.warn("验证码错误: phone={}, expected={}, actual={}", phone, storedCode, code);
        }
        
        return isValid;
    }
    
    @Override
    @Transactional
    public ApiResponse<Map<String, Object>> loginWithSms(SmsLoginRequest request) {
        log.info("短信验证码登录请求: phone={}, identity={}", request.getPhone(), request.getIdentity());
        
        // 1. 验证验证码
        if (!verifyCode(request.getPhone(), request.getCode())) {
            return ApiResponse.error("验证码错误或已过期");
        }
        
        // 2. 根据手机号查找用户
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("phone", request.getPhone());
        User user = userRepository.selectOne(queryWrapper);
        
        if (user == null) {
            return ApiResponse.error("该手机号未注册，请先注册");
        }
        
        // 3. 检查用户状态
        if (user.getStatus() == 0) {
            return ApiResponse.error("账号已被禁用");
        }
        
        // 4. 检查身份类型匹配
        int expectedRole = getRoleFromIdentity(request.getIdentity());
        if (user.getRole() != expectedRole) {
            return ApiResponse.error("身份类型不匹配");
        }
        
        // 5. 生成JWT令牌
        String token = jwtTokenProvider.generateToken(user);
        
        // 6. 返回登录结果
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("user", user);
        result.put("message", "登录成功");
        
        log.info("短信验证码登录成功: phone={}, userId={}", request.getPhone(), user.getId());
        return ApiResponse.success("登录成功", result);
    }
    
    @Override
    @Transactional
    public ApiResponse<Map<String, Object>> registerWithSms(SmsRegisterRequest request) {
        log.info("短信验证码注册请求: phone={}, role={}", request.getPhone(), request.getRole());
        
        // 1. 验证验证码
        if (!verifyCode(request.getPhone(), request.getCode())) {
            return ApiResponse.error("验证码错误或已过期");
        }
        
        // 2. 检查手机号是否已注册
        QueryWrapper<User> phoneQuery = new QueryWrapper<>();
        phoneQuery.eq("phone", request.getPhone());
        if (userRepository.selectCount(phoneQuery) > 0) {
            return ApiResponse.error("该手机号已被注册");
        }
        
        // 3. 检查用户名是否已存在
        String username = request.getUsername() != null ? request.getUsername() : request.getPhone();
        QueryWrapper<User> usernameQuery = new QueryWrapper<>();
        usernameQuery.eq("username", username);
        if (userRepository.selectCount(usernameQuery) > 0) {
            return ApiResponse.error("用户名已存在");
        }
        
        // 4. 创建新用户
        User user = new User();
        user.setUsername(username);
        user.setPhone(request.getPhone());
        user.setFullName(request.getFullName());
        user.setRole(request.getRole());
        user.setStatus(1);
        user.setCreateTime(LocalDateTime.now());
        user.setUpdateTime(LocalDateTime.now());
        user.setPointsBalance(0.0); // 初始积分为0
        
        // 根据角色设置institution_id
        // 只有机构用户(role=2)才设置institution_id，学生(role=1)和专家(role=3)的institution_id为null
        if (request.getRole() != 2) {
            user.setInstitutionId(null); // 学生和专家用户不设置机构ID
        }
        
        // 设置邮箱（如果提供了）
        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            user.setEmail(request.getEmail());
        }
        
        // 设置默认密码（短信注册可以没有密码，设置默认值）
        user.setPasswordHash(passwordEncoder.encode("123456"));
        
        userRepository.insert(user);
        
        // 5. 生成JWT令牌
        String token = jwtTokenProvider.generateToken(user);
        
        // 6. 返回注册结果
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("user", user);
        result.put("message", "注册成功");
        
        log.info("短信验证码注册成功: phone={}, userId={}", request.getPhone(), user.getId());
        return ApiResponse.success("注册成功", result);
    }
    
    /**
     * 模拟短信发送服务
     */
    private boolean simulateSmsService(String phone, String code, String type) {
        String currentTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        String purpose = "login".equals(type) ? "登录" : "注册";
        
        // 控制台输出漂亮的短信通知
        log.info("=====================================");
        log.info("📱 短信发送通知");
        log.info("手机号: {}", phone);
        log.info("验证码: {}", code);
        log.info("用途: {}", purpose);
        log.info("时间: {}", currentTime);
        log.info("内容: 【学分银行】您的验证码是{}，{}分钟内有效。如非本人操作，请忽略本短信。", code, expireMinutes);
        log.info("=====================================");
        
        // 在实际项目中，这里可以替换为真实的短信服务调用
        // 例如：tencentSmsService.send(phone, code);
        
        return true; // 模拟发送成功
    }
    
    /**
     * 生成随机验证码
     */
    private String generateCode() {
        Random random = new Random();
        StringBuilder code = new StringBuilder();
        for (int i = 0; i < codeLength; i++) {
            code.append(random.nextInt(10));
        }
        return code.toString();
    }
    
    /**
     * 根据身份获取角色ID
     */
    private int getRoleFromIdentity(String identity) {
        switch (identity) {
            case "student": return 1;
            case "organization": return 2;
            case "expert": return 3;
            case "admin": return 4;
            default: return 1;
        }
    }
} 