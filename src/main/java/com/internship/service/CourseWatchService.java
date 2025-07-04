package com.internship.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.internship.dto.CourseDTO;
import com.internship.entity.ProjectWatchRecord;

import java.util.List;

public interface CourseWatchService {

    /**
     * 记录用户观看课程
     * @param userId 用户ID
     * @param courseId 课程ID
     * @param progress 观看进度
     * @return 是否记录成功
     */
    boolean recordWatching(Long userId, String courseId, Integer progress);
    
    /**
     * 完成课程观看并奖励积分
     * @param userId 用户ID
     * @param courseId 课程ID
     * @return 是否完成成功
     */
    boolean completeCourse(Long userId, String courseId);
    
    /**
     * 获取用户的课程观看记录
     * @param userId 用户ID
     * @param page 页码
     * @param size 每页大小
     * @return 课程观看记录分页
     */
    Page<CourseDTO> getUserCourseRecords(Long userId, int page, int size);
    
    /**
     * 获取用户已完成的课程
     * @param userId 用户ID
     * @return 已完成的课程列表
     */
    List<CourseDTO> getCompletedCourses(Long userId);
    
    /**
     * 检查用户是否观看过指定课程
     * @param userId 用户ID
     * @param courseId 课程ID
     * @return 观看记录
     */
    ProjectWatchRecord checkUserWatchRecord(Long userId, String courseId);
} 