package com.internship.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ProductOrderDTO {
    private Long id;
    private Long userId;
    private String username;
    private Long productId;
    private String productName;
    private Double pointsUsed;
    private Integer orderStatus;
    private String shippingAddress;
    private String contactName;
    private String contactPhone;
    private Long transactionId;
    private String remark;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
} 