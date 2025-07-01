package com.internship.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("product_order")
public class ProductOrder {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    @TableField("user_id")
    private Long userId;
    
    @TableField("product_id")
    private Long productId;
    
    @TableField("points_used")
    private Double pointsUsed;
    
    @TableField("order_status")
    private Integer orderStatus; // 1-待发货，2-已发货，3-已完成，4-已取消
    
    @TableField("shipping_address")
    private String shippingAddress;
    
    @TableField("contact_name")
    private String contactName;
    
    @TableField("contact_phone")
    private String contactPhone;
    
    @TableField("transaction_id")
    private Long transactionId;
    
    @TableField("remark")
    private String remark;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
    
    @TableField(exist = false)
    private String productName;
} 