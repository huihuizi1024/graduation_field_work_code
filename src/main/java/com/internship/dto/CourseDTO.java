package com.internship.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 课程数据传输对象
 */
@Data
public class CourseDTO {
    private String id;
    private String courseName;
    private String courseCode;
    private String instructor;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer status;
    private String description;
    private Long institutionId;
    private String institutionName;
    private Integer category;
    private String categoryName;
    private String videoUrl;
    private String coverImageUrl;
    private Integer pointsReward;
    private Integer duration;
    private Integer viewCount;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    
    // 用于前端显示的附加字段
    private Boolean isWatched;
    private Integer watchProgress;
    
    /**
     * 获取课程分类名称
     * @param category 分类编码
     * @return 分类名称
     */
    public static String getCategoryName(Integer category) {
        if (category == null) return "未分类";
        
        switch (category) {
            case 1: return "生活技能";
            case 2: return "职场进阶";
            case 3: return "老年教育";
            case 4: return "学历提升";
            case 5: return "兴趣培养";
            case 6: return "技能认证";
            default: return "未分类";
        }
    }
} 