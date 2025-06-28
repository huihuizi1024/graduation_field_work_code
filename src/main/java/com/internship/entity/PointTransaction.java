package com.internship.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "point_transaction")
public class PointTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column
    private Long pointRuleId;

    @Column(nullable = false)
    private Integer transactionType; // 1-获得, 2-消费, 3-过期

    @Column(nullable = false, precision = 10, scale = 2)
    private Double pointsChange;

    @Column(nullable = false, precision = 10, scale = 2)
    private Double balanceAfter;

    @Column(length = 255)
    private String description;

    @Column(length = 100)
    private String relatedId;

    @CreationTimestamp
    @Column(updatable = false)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime transactionTime;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createTime;

    @UpdateTimestamp
    private LocalDateTime updateTime;
}
