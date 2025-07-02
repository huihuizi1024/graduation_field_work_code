package com.internship.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.internship.dto.PageResponse;
import com.internship.entity.Project;
import com.internship.exception.BusinessException;
import com.internship.repository.ProjectRepository;
import com.internship.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 项目服务实现类
 */
@Service
@Transactional
public class ProjectServiceImpl implements ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Override
    public Project createProject(Project project) {
        // 检查项目编码是否已存在
        Project existingProject = projectRepository.findByProjectCode(project.getProjectCode());
        if (existingProject != null) {
            throw new BusinessException("PROJECT_CODE_EXISTS", "项目编码已存在");
        }

        // 设置默认值
        if (project.getStatus() == null) {
            project.setStatus(1); // 默认进行中
        }

        // 设置创建时间
        project.setCreateTime(LocalDateTime.now());
        project.setUpdateTime(LocalDateTime.now());

        // 模拟当前用户信息
        project.setCreatorId(1L);

        projectRepository.insert(project);
        return project;
    }

    @Override
    public Project updateProject(String id, Project project) {
        Project existingProject = getProjectById(id);

        // 检查项目编码是否被其他项目使用
        if (StringUtils.hasText(project.getProjectCode()) && 
            !project.getProjectCode().equals(existingProject.getProjectCode())) {
            Project duplicateProject = projectRepository.findByProjectCodeAndIdNot(
                project.getProjectCode(), id);
            if (duplicateProject != null) {
                throw new BusinessException("PROJECT_CODE_EXISTS", "项目编码已存在");
            }
        }

        // 更新字段
        if (StringUtils.hasText(project.getProjectName())) {
            existingProject.setProjectName(project.getProjectName());
        }
        if (StringUtils.hasText(project.getProjectCode())) {
            existingProject.setProjectCode(project.getProjectCode());
        }
        if (StringUtils.hasText(project.getManager())) {
            existingProject.setManager(project.getManager());
        }
        if (project.getStartDate() != null) {
            existingProject.setStartDate(project.getStartDate());
        }
        if (project.getEndDate() != null) {
            existingProject.setEndDate(project.getEndDate());
        }
        if (project.getStatus() != null) {
            existingProject.setStatus(project.getStatus());
        }
        if (StringUtils.hasText(project.getDescription())) {
            existingProject.setDescription(project.getDescription());
        }
        // 更新新增字段
        if (project.getInstitutionId() != null) {
            existingProject.setInstitutionId(project.getInstitutionId());
        }
        if (project.getCategory() != null) {
            existingProject.setCategory(project.getCategory());
        }
        if (StringUtils.hasText(project.getVideoUrl())) {
            existingProject.setVideoUrl(project.getVideoUrl());
        }
        if (StringUtils.hasText(project.getCoverImageUrl())) {
            existingProject.setCoverImageUrl(project.getCoverImageUrl());
        }
        if (project.getPointsReward() != null) {
            existingProject.setPointsReward(project.getPointsReward());
        }
        if (project.getDuration() != null) {
            existingProject.setDuration(project.getDuration());
        }
        if (project.getViewCount() != null) {
            existingProject.setViewCount(project.getViewCount());
        }

        existingProject.setUpdateTime(LocalDateTime.now());
        projectRepository.updateById(existingProject);
        return existingProject;
    }

    @Override
    public void deleteProject(String id) {
        Project project = getProjectById(id);
        projectRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Project getProjectById(String id) {
        Project project = projectRepository.selectById(id);
        if (project == null) {
            throw new BusinessException("PROJECT_NOT_FOUND", "项目不存在");
        }
        return project;
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<Project> getProjects(Integer page, Integer size, 
                                          String projectName, String projectCode, 
                                          Integer status) {
        // 参数校验和默认值设置
        if (page == null || page < 1) {
            page = 1;
        }
        if (size == null || size < 1) {
            size = 10;
        }
        if (size > 100) {
            size = 100; // 限制最大分页大小
        }

        // 构建查询条件
        LambdaQueryWrapper<Project> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.like(StringUtils.hasText(projectName), Project::getProjectName, projectName)
                   .like(StringUtils.hasText(projectCode), Project::getProjectCode, projectCode)
                   .eq(status != null, Project::getStatus, status)
                   .orderByDesc(Project::getCreateTime);

        Page<Project> pageQuery = new Page<>(page, size);
        IPage<Project> pageResult = projectRepository.selectPage(pageQuery, queryWrapper);

        return new PageResponse<>(
                page,
                size,
                pageResult.getTotal(),
                pageResult.getRecords()
        );
    }

    @Override
    public void changeProjectStatus(String id, Integer status) {
        Project project = getProjectById(id);

        if (status == null || (status != 0 && status != 1)) {
            throw new BusinessException("INVALID_STATUS", "状态值无效，必须是0（已完成）或1（进行中）");
        }

        project.setStatus(status);
        project.setUpdateTime(LocalDateTime.now());
        projectRepository.updateById(project);
    }

    @Override
    public void batchDeleteProjects(List<String> ids) {
        if (ids == null || ids.isEmpty()) {
            throw new BusinessException("EMPTY_ID_LIST", "ID列表不能为空");
        }

        List<Project> projects = projectRepository.findByIdIn(ids);
        if (projects.size() != ids.size()) {
            throw new BusinessException("SOME_PROJECTS_NOT_FOUND", "部分项目不存在");
        }

        // 批量删除
        projectRepository.deleteBatchIds(ids);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getProjectStatistics() {
        Map<String, Object> statistics = new HashMap<>();

        // 总数统计
        long totalCount = projectRepository.selectCount(null);
        statistics.put("totalCount", totalCount);

        // 按状态统计
        long activeCount = projectRepository.countByStatus(1);
        long completedCount = projectRepository.countByStatus(0);
        statistics.put("activeCount", activeCount);
        statistics.put("completedCount", completedCount);

        return statistics;
    }
}
