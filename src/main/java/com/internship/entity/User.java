package com.internship.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("user")
public class User {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String username;
    private String passwordHash;
    private String fullName;
    private Integer role;
    private String email;
    private String phone;
    private Long institutionId;
    private Integer status;
    private Double pointsBalance = 0.0;
    private String avatarUrl;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
    
    // 角色枚举
    public enum Role {
        STUDENT(1, "学生"),
        TEACHER(2, "教师"),
        EXPERT(3, "专家"),
        ADMIN(4, "管理员");
        
        private final int code;
        private final String name;
        
        Role(int code, String name) {
            this.code = code;
            this.name = name;
        }
        
        public int getCode() {
            return code;
        }
        
        public String getName() {
            return name;
        }
    }
    
    // 状态枚举
    public enum Status {
        DISABLED(0, "禁用"),
        ENABLED(1, "启用");
        
        private final int code;
        private final String name;
        
        Status(int code, String name) {
            this.code = code;
            this.name = name;
        }
        
        public int getCode() {
            return code;
        }
        
        public String getName() {
            return name;
        }
    }
}