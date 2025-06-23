package com.internship.exception;

/**
 * 业务异常类
 *
 * @author huihuizi1024
 * @date 2025.6.23
 * @version 1.1.0
 */
public class BusinessException extends RuntimeException {

    private final String code;
    private final String message;

    public BusinessException(String message) {
        super(message);
        this.code = "BUSINESS_ERROR";
        this.message = message;
    }

    public BusinessException(String code, String message) {
        super(message);
        this.code = code;
        this.message = message;
    }

    public String getCode() {
        return code;
    }

    @Override
    public String getMessage() {
        return message;
    }
} 