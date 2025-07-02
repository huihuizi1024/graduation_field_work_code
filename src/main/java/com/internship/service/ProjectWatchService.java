package com.internship.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.internship.dto.ProjectDTO;
import com.internship.entity.ProjectWatchRecord;

import java.util.List;

public interface ProjectWatchService {

    /**
     * 记录用户观看项目
     * @param userId 用户ID
     * @param projectId 项目ID
     * @param progress 观看进度
     * @return 是否记录成功
     */
    boolean recordWatching(Long userId, String projectId, Integer progress);
    
    /**
     * 完成项目观看并奖励积分
     * @param userId 用户ID
     * @param projectId 项目ID
     * @return 是否完成成功
     */
    boolean completeProject(Long userId, String projectId);
    
    /**
     * 获取用户的项目观看记录
     * @param userId 用户ID
     * @param page 页码
     * @param size 每页大小
     * @return 项目观看记录分页
     */
    Page<ProjectDTO> getUserProjectRecords(Long userId, int page, int size);
    
    /**
     * 获取用户已完成的项目
     * @param userId 用户ID
     * @return 已完成的项目列表
     */
    List<ProjectDTO> getCompletedProjects(Long userId);
    
    /**
     * 检查用户是否观看过指定项目
     * @param userId 用户ID
     * @param projectId 项目ID
     * @return 观看记录
     */
    ProjectWatchRecord checkUserWatchRecord(Long userId, String projectId);
} 