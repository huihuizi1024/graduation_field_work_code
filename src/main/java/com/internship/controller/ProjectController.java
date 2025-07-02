package com.internship.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.internship.dto.ApiResponse;
import com.internship.dto.PageResponse;
import com.internship.dto.ProjectDTO;
import com.internship.entity.Project;
import com.internship.entity.ProjectWatchRecord;
import com.internship.entity.User;
import com.internship.service.ProjectService;
import com.internship.service.ProjectWatchService;
import com.internship.service.UserService;
import com.internship.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * 项目管理Controller
 */
@Tag(name = "项目管理")
@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;
    
    @Autowired
    private ProjectWatchService projectWatchService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private UserRepository userRepository;

    /**
     * 获取项目列表
     */
    @GetMapping
    @Operation(summary = "获取项目列表")
    public ApiResponse<PageResponse<ProjectDTO>> getProjects(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Integer category,
            @RequestParam(required = false) String institutionId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        User currentUser = null;
        if (userDetails != null) {
            Optional<User> userOpt = userRepository.findByUsername(userDetails.getUsername());
            if (userOpt.isPresent()) {
                currentUser = userOpt.get();
            }
        }
        
        // 构建查询条件
        String projectName = null;
        String projectCode = null;
        Integer status = null;
        
        // 处理institutionId特殊值"me"
        Long institutionIdValue = null;
        if ("me".equals(institutionId) && currentUser != null) {
            institutionIdValue = currentUser.getId();
        } else if (institutionId != null && !institutionId.isEmpty()) {
            try {
                institutionIdValue = Long.parseLong(institutionId);
            } catch (NumberFormatException e) {
                // 无效的ID，忽略
            }
        }
        
        // 根据分类和机构进行过滤
        if (currentUser != null && currentUser.getRole() == 2 && institutionIdValue == null) { // 角色为2表示机构
            institutionIdValue = currentUser.getId(); // 机构只能看到自己的项目
        }
        
        // 调用服务获取分页数据
        PageResponse<Project> projectPage = projectService.getProjects(
            page, size, projectName, projectCode, status);
        
        // 过滤结果
        List<Project> filteredProjects = new ArrayList<>();
        for (Project project : projectPage.getRecords()) {
            boolean match = true;
            
            if (category != null && project.getCategory() != null && !category.equals(project.getCategory())) {
                match = false;
            }
            
            // 如果指定了机构ID，则过滤该机构的项目
            if (institutionIdValue != null && project.getInstitutionId() != null && !institutionIdValue.equals(project.getInstitutionId())) {
                match = false;
            }
            
            if (match) {
                filteredProjects.add(project);
            }
        }
        
        // 转换为DTO
        List<ProjectDTO> projectDTOList = new ArrayList<>();
        for (Project project : filteredProjects) {
            ProjectDTO dto = new ProjectDTO();
            BeanUtils.copyProperties(project, dto);
            // 设置默认分类，如果为null
            if (dto.getCategory() == null) {
                dto.setCategory(1); // 默认为"专业技能"分类
            }
            dto.setCategoryName(ProjectDTO.getCategoryName(dto.getCategory()));
            
            // 如果是登录用户，检查是否观看过
            if (currentUser != null) {
                ProjectWatchRecord record = projectWatchService.checkUserWatchRecord(currentUser.getId(), project.getId());
                if (record != null) {
                    dto.setIsWatched(record.getWatchStatus() == 1);
                    dto.setWatchProgress(record.getWatchProgress());
                } else {
                    dto.setIsWatched(false);
                    dto.setWatchProgress(0);
                }
            } else {
                dto.setIsWatched(false);
                dto.setWatchProgress(0);
            }
            
            projectDTOList.add(dto);
        }
        
        // 创建分页响应对象
        PageResponse<ProjectDTO> response = new PageResponse<>(
            page,
            size,
            (long) filteredProjects.size(), // 转换为Long类型
            projectDTOList
        );
        
        return ApiResponse.success(response);
    }

    /**
     * 获取项目详情
     */
    @GetMapping("/{id}")
    @Operation(summary = "获取项目详情")
    public ApiResponse<ProjectDTO> getProject(@PathVariable String id, @AuthenticationPrincipal UserDetails userDetails) {
        Project project = projectService.getProjectById(id);
        if (project == null) {
            return ApiResponse.error(404, "项目不存在");
        }
        
        ProjectDTO dto = new ProjectDTO();
        BeanUtils.copyProperties(project, dto);
        dto.setCategoryName(ProjectDTO.getCategoryName(project.getCategory()));
        
        // 检查当前用户是否观看过
        if (userDetails != null) {
            Optional<User> userOpt = userRepository.findByUsername(userDetails.getUsername());
            if (userOpt.isPresent()) {
                User currentUser = userOpt.get();
                ProjectWatchRecord record = projectWatchService.checkUserWatchRecord(currentUser.getId(), id);
                if (record != null) {
                    dto.setIsWatched(record.getWatchStatus() == 1);
                    dto.setWatchProgress(record.getWatchProgress());
                } else {
                    dto.setIsWatched(false);
                    dto.setWatchProgress(0);
                }
            }
        }
        
        // 增加浏览量
        if (project.getViewCount() == null) {
            project.setViewCount(1);
        } else {
            project.setViewCount(project.getViewCount() + 1);
        }
        projectService.updateProject(id, project);
        
        return ApiResponse.success(dto);
    }
    
    /**
     * 记录项目观看进度
     */
    @PostMapping("/{id}/record-watching")
    @Operation(summary = "记录项目观看进度")
    public ApiResponse<Boolean> recordWatching(
            @PathVariable String id,
            @RequestParam Integer progress,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        if (userDetails == null) {
            return ApiResponse.error(401, "请先登录");
        }
        
        Optional<User> userOpt = userRepository.findByUsername(userDetails.getUsername());
        if (!userOpt.isPresent()) {
            return ApiResponse.error(401, "用户不存在");
        }
        User currentUser = userOpt.get();
        
        boolean result = projectWatchService.recordWatching(currentUser.getId(), id, progress);
        if (result) {
            return ApiResponse.success(true);
        } else {
            return ApiResponse.error(500, "记录观看进度失败");
        }
    }
    
    /**
     * 完成项目观看
     */
    @PostMapping("/{id}/complete")
    @Operation(summary = "完成项目观看")
    public ApiResponse<Boolean> completeProject(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        if (userDetails == null) {
            return ApiResponse.error(401, "请先登录");
        }
        
        Optional<User> userOpt = userRepository.findByUsername(userDetails.getUsername());
        if (!userOpt.isPresent()) {
            return ApiResponse.error(401, "用户不存在");
        }
        User currentUser = userOpt.get();
        
        boolean result = projectWatchService.completeProject(currentUser.getId(), id);
        if (result) {
            return ApiResponse.success(true);
        } else {
            return ApiResponse.error(500, "完成项目失败");
        }
    }
    
    /**
     * 获取我的项目观看记录
     */
    @GetMapping("/my-projects")
    @Operation(summary = "获取我的项目观看记录")
    public ApiResponse<PageResponse<ProjectDTO>> getMyProjects(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        if (userDetails == null) {
            return ApiResponse.error(401, "请先登录");
        }
        
        Optional<User> userOpt = userRepository.findByUsername(userDetails.getUsername());
        if (!userOpt.isPresent()) {
            return ApiResponse.error(401, "用户不存在");
        }
        User currentUser = userOpt.get();
        
        Page<ProjectDTO> projectPage = projectWatchService.getUserProjectRecords(currentUser.getId(), page, size);
        
        // 创建分页响应对象
        PageResponse<ProjectDTO> response = new PageResponse<>(
            (int) projectPage.getCurrent(),
            (int) projectPage.getSize(),
            projectPage.getTotal(),
            projectPage.getRecords()
        );
        
        return ApiResponse.success(response);
    }
    
    /**
     * 获取已完成的项目
     */
    @GetMapping("/completed")
    @Operation(summary = "获取已完成的项目")
    public ApiResponse<List<ProjectDTO>> getCompletedProjects(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ApiResponse.error(401, "请先登录");
        }
        
        Optional<User> userOpt = userRepository.findByUsername(userDetails.getUsername());
        if (!userOpt.isPresent()) {
            return ApiResponse.error(401, "用户不存在");
        }
        User currentUser = userOpt.get();
        
        List<ProjectDTO> completedProjects = projectWatchService.getCompletedProjects(currentUser.getId());
        return ApiResponse.success(completedProjects);
    }

    /**
     * 创建项目
     */
    @PostMapping
    @Operation(summary = "创建项目")
    @PreAuthorize("hasRole('INSTITUTION')")
    public ApiResponse<Project> createProject(@RequestBody Project project, @AuthenticationPrincipal UserDetails userDetails) {
        Optional<User> userOpt = userRepository.findByUsername(userDetails.getUsername());
        if (!userOpt.isPresent()) {
            return ApiResponse.error(401, "用户不存在");
        }
        User currentUser = userOpt.get();
        
        project.setInstitutionId(currentUser.getId());
        project.setCreatorId(currentUser.getId());
        
        // 默认值设置
        if (project.getViewCount() == null) {
            project.setViewCount(0);
        }
        
        Project createdProject = projectService.createProject(project);
        return ApiResponse.success(createdProject);
    }

    /**
     * 更新项目
     */
    @PutMapping("/{id}")
    @Operation(summary = "更新项目")
    @PreAuthorize("hasRole('INSTITUTION')")
    public ApiResponse<Project> updateProject(@PathVariable String id, @RequestBody Project project, @AuthenticationPrincipal UserDetails userDetails) {
        Project existingProject = projectService.getProjectById(id);
        if (existingProject == null) {
            return ApiResponse.error(404, "项目不存在");
        }
        
        Optional<User> userOpt = userRepository.findByUsername(userDetails.getUsername());
        if (!userOpt.isPresent()) {
            return ApiResponse.error(401, "用户不存在");
        }
        User currentUser = userOpt.get();
        
        if (!existingProject.getInstitutionId().equals(currentUser.getId())) {
            return ApiResponse.error(403, "无权操作该项目");
        }
        
        project.setId(id);
        Project updatedProject = projectService.updateProject(id, project);
        return ApiResponse.success(updatedProject);
    }

    /**
     * 删除项目
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "删除项目")
    @PreAuthorize("hasRole('INSTITUTION')")
    public ApiResponse<Boolean> deleteProject(@PathVariable String id, @AuthenticationPrincipal UserDetails userDetails) {
        Project existingProject = projectService.getProjectById(id);
        if (existingProject == null) {
            return ApiResponse.error(404, "项目不存在");
        }
        
        Optional<User> userOpt = userRepository.findByUsername(userDetails.getUsername());
        if (!userOpt.isPresent()) {
            return ApiResponse.error(401, "用户不存在");
        }
        User currentUser = userOpt.get();
        
        if (!existingProject.getInstitutionId().equals(currentUser.getId())) {
            return ApiResponse.error(403, "无权操作该项目");
        }
        
        projectService.deleteProject(id);
        return ApiResponse.success(true);
    }
    
    /**
     * 根据分类获取项目
     */
    @GetMapping("/by-category/{category}")
    @Operation(summary = "根据分类获取项目")
    public ApiResponse<PageResponse<ProjectDTO>> getProjectsByCategory(
            @PathVariable Integer category,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "15") int size,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        // 获取分页的项目列表
        PageResponse<Project> pageResponse = projectService.getProjects(page, size, null, null, null);
        List<Project> allProjects = pageResponse.getRecords();
        
        // 过滤符合分类的项目
        List<Project> filteredProjects = new ArrayList<>();
        for (Project project : allProjects) {
            if (category.equals(project.getCategory())) {
                filteredProjects.add(project);
            }
        }
        
        // 转换为DTO
        List<ProjectDTO> projectDTOList = new ArrayList<>();
        User currentUser = null;
        
        if (userDetails != null) {
            Optional<User> userOpt = userRepository.findByUsername(userDetails.getUsername());
            if (userOpt.isPresent()) {
                currentUser = userOpt.get();
            }
        }
        
        for (Project project : filteredProjects) {
            ProjectDTO dto = new ProjectDTO();
            BeanUtils.copyProperties(project, dto);
            // 设置默认分类，如果为null
            if (dto.getCategory() == null) {
                dto.setCategory(1); // 默认为"专业技能"分类
            }
            dto.setCategoryName(ProjectDTO.getCategoryName(dto.getCategory()));
            
            // 如果是登录用户，检查是否观看过
            if (currentUser != null) {
                ProjectWatchRecord record = projectWatchService.checkUserWatchRecord(currentUser.getId(), project.getId());
                if (record != null) {
                    dto.setIsWatched(record.getWatchStatus() == 1);
                    dto.setWatchProgress(record.getWatchProgress());
                } else {
                    dto.setIsWatched(false);
                    dto.setWatchProgress(0);
                }
            } else {
                dto.setIsWatched(false);
                dto.setWatchProgress(0);
            }
            
            projectDTOList.add(dto);
        }
        
        // 创建分页响应对象
        PageResponse<ProjectDTO> response = new PageResponse<>(
            page,
            size,
            (long) filteredProjects.size(), // 转换为Long类型
            projectDTOList
        );
        
        return ApiResponse.success(response);
    }
}
