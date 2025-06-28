package com.internship.entity;

import lombok.Data;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "business_process")
public class BusinessProcess {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "process_name", nullable = false)
    private String processName;

    @Column(name = "process_code", nullable = false, unique = true)
    private String processCode;

    @Column(name = "process_description")
    private String processDescription;

    @Column(name = "category")
    private Integer category; // 流程类别：1-积分获取，2-积分转换，3-认证申请，4-活动参与，5-课程学习

    @Column(name = "responsible_department")
    private String responsibleDepartment;

    @Column(name = "status", nullable = false)
    private Integer status; // 状态：1-启用，0-禁用

    @Column(name = "creator_id")
    private Long creatorId;

    @Column(name = "creator_name")
    private String creatorName;

    @Column(name = "create_time")
    private LocalDateTime createTime;

    @Column(name = "update_time")
    private LocalDateTime updateTime;
} 