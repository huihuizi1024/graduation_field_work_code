package com.internship.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 项目数据传输对象
 */
@Data
public class ProjectDTO {
    private String id;
    private String projectName;
    private String projectCode;
    private String manager;
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
     * 获取项目分类名称
     * @param category 分类编码
     * @return 分类名称
     */
    public static String getCategoryName(Integer category) {
        if (category == null) return "未分类";
        
        switch (category) {
            case 1: return "专业技能";
            case 2: return "学术教育";
            case 3: return "职业发展";
            case 4: return "创新创业";
            case 5: return "人文艺术";
            case 6: return "科学技术";
            default: return "未分类";
        }
    }
} 