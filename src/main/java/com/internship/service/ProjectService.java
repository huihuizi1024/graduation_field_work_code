package com.internship.service;

import com.internship.dto.PageResponse;
import com.internship.entity.Project;

import java.util.List;
import java.util.Map;

/**
 * 项目服务接口
 */
public interface ProjectService {

    /**
     * 创建项目
     */
    Project createProject(Project project);

    /**
     * 更新项目
     */
    Project updateProject(String id, Project project);

    /**
     * 删除项目
     */
    void deleteProject(String id);

    /**
     * 根据ID获取项目
     */
    Project getProjectById(String id);

    /**
     * 分页查询项目
     */
    PageResponse<Project> getProjects(Integer page, Integer size, 
                                    String projectName, String projectCode, 
                                    Integer status);

    /**
     * 修改项目状态
     */
    void changeProjectStatus(String id, Integer status);

    /**
     * 批量删除项目
     */
    void batchDeleteProjects(List<String> ids);

    /**
     * 获取项目统计信息
     */
    Map<String, Object> getProjectStatistics();
}
