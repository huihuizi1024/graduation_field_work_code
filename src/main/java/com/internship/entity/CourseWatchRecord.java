package com.internship.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 课程观看记录实体类
 */
@Data
@TableName("course_watch_record")
public class CourseWatchRecord {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /**
     * 用户ID
     */
    @TableField("user_id")
    private Long userId;
    
    /**
     * 课程ID
     */
    @TableField("course_id")
    private String courseId;
    
    /**
     * 观看状态：0-未完成，1-已完成
     */
    @TableField("watch_status")
    private Integer watchStatus;
    
    /**
     * 观看进度（百分比）
     */
    @TableField("watch_progress")
    private Integer watchProgress;
    
    /**
     * 是否已获得积分：0-未获得，1-已获得
     */
    @TableField("is_rewarded")
    private Integer isRewarded;
    
    /**
     * 最后观看时间
     */
    @TableField("last_watch_time")
    private LocalDateTime lastWatchTime;
    
    /**
     * 创建时间
     */
    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    /**
     * 更新时间
     */
    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
} 