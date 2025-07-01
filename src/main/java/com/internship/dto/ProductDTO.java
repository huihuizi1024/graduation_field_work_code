package com.internship.dto;

import lombok.Data;

@Data
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private Double points;
    private String imageUrl;
    private String category;
    private Integer stock;
    private Integer status;
} 