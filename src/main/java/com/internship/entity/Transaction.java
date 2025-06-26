package com.internship.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;

@Data
@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true)
    private String transactionId;
    
    private String userId;
    private Integer transactionType; // 1-获取 2-消费
    private Double amount;
    private Integer status; // 0-失败 1-成功
    private Date transactionDate;
    private String description;
}
