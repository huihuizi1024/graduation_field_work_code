package com.internship.config;

import com.internship.dto.ApiResponse;
import com.internship.exception.BusinessException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import java.util.Set;

/**
 * 全局异常处理器
 *
 * @author huihuizi1024
 * @date 2025.6.23
 * @version 1.1.0
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * 处理业务异常
     */
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusinessException(BusinessException e) {
        logger.warn("业务异常: {}", e.getMessage());
        return ResponseEntity.ok(ApiResponse.error(400, e.getMessage()));
    }

    /**
     * 处理参数校验异常
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(MethodArgumentNotValidException e) {
        BindingResult bindingResult = e.getBindingResult();
        StringBuilder errorMessage = new StringBuilder();
        
        for (FieldError fieldError : bindingResult.getFieldErrors()) {
            if (errorMessage.length() > 0) {
                errorMessage.append("; ");
            }
            errorMessage.append(fieldError.getField()).append(": ").append(fieldError.getDefaultMessage());
        }
        
        logger.warn("参数校验失败: {}", errorMessage.toString());
        return ResponseEntity.ok(ApiResponse.badRequest(errorMessage.toString()));
    }

    /**
     * 处理约束违反异常
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleConstraintViolationException(ConstraintViolationException e) {
        StringBuilder errorMessage = new StringBuilder();
        Set<ConstraintViolation<?>> violations = e.getConstraintViolations();
        
        for (ConstraintViolation<?> violation : violations) {
            if (errorMessage.length() > 0) {
                errorMessage.append("; ");
            }
            errorMessage.append(violation.getPropertyPath()).append(": ").append(violation.getMessage());
        }
        
        logger.warn("约束验证失败: {}", errorMessage.toString());
        return ResponseEntity.ok(ApiResponse.badRequest(errorMessage.toString()));
    }

    /**
     * 处理IllegalArgumentException
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> handleIllegalArgumentException(IllegalArgumentException e) {
        logger.warn("参数异常: {}", e.getMessage());
        return ResponseEntity.ok(ApiResponse.badRequest(e.getMessage()));
    }

    /**
     * 处理其他未捕获的异常
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGenericException(Exception e) {
        logger.error("系统异常: ", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("系统内部错误，请联系管理员"));
    }
} 