package com.internship.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("product")
public class Product {
    @TableId(type = IdType.AUTO)
    private Long id;
    
    @TableField("name")
    private String name;
    
    @TableField("description")
    private String description;
    
    @TableField("points")
    private Double points;
    
    @TableField("image_url")
    private String imageUrl;
    
    @TableField("category")
    private String category;
    
    @TableField("stock")
    private Integer stock;
    
    @TableField("status")
    private Integer status; // 1-上架，0-下架
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
} 