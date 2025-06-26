package com.internship.controller;

import com.internship.dto.ApiResponse;
import com.internship.dto.PageResponse;
import com.internship.entity.Project;
import com.internship.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

/**
 * 项目管理Controller
 */
@Tag(name = "项目管理", description = "项目的增删改查功能")
@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    /**
     * 健康检查接口
     */
    @Operation(summary = "健康检查", description = "检查项目API服务状态")
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> healthCheck() {
        return ResponseEntity.ok(ApiResponse.success("Project API is healthy!"));
    }

    /**
     * 创建项目
     */
    @Operation(summary = "创建项目", description = "新建项目")
    @PostMapping
    public ResponseEntity<ApiResponse<Project>> createProject(
            @Valid @RequestBody Project project) {
        Project createdProject = projectService.createProject(project);
        return ResponseEntity.ok(ApiResponse.success("项目创建成功", createdProject));
    }

    /**
     * 更新项目
     */
    @Operation(summary = "更新项目", description = "更新指定ID的项目")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Project>> updateProject(
            @Parameter(description = "项目ID") @PathVariable String id,
            @Valid @RequestBody Project project) {
        Project updatedProject = projectService.updateProject(id, project);
        return ResponseEntity.ok(ApiResponse.success("项目更新成功", updatedProject));
    }

    /**
     * 删除项目
     */
    @Operation(summary = "删除项目", description = "删除指定ID的项目")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProject(
            @Parameter(description = "项目ID") @PathVariable String id) {
        projectService.deleteProject(id);
        return ResponseEntity.ok(ApiResponse.<Void>success("项目删除成功"));
    }

    /**
     * 根据ID获取项目
     */
    @Operation(summary = "获取项目详情", description = "根据ID获取项目详细信息")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Project>> getProjectById(
            @Parameter(description = "项目ID") @PathVariable String id) {
        Project project = projectService.getProjectById(id);
        return ResponseEntity.ok(ApiResponse.success("获取项目成功", project));
    }

    /**
     * 分页查询项目
     */
    @Operation(summary = "分页查询项目", description = "支持多条件筛选的分页查询")
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<Project>>> getProjects(
            @Parameter(description = "页码，从0开始") @RequestParam(value = "page", defaultValue = "0") Integer page,
            @Parameter(description = "每页大小") @RequestParam(value = "size", defaultValue = "10") Integer size,
            @Parameter(description = "项目名称") @RequestParam(value = "projectName", required = false) String projectName,
            @Parameter(description = "项目编码") @RequestParam(value = "projectCode", required = false) String projectCode,
            @Parameter(description = "状态") @RequestParam(value = "status", required = false) Integer status) {
        PageResponse<Project> pageResponse = projectService.getProjects(
                page, size, projectName, projectCode, status);
        return ResponseEntity.ok(ApiResponse.success("查询项目成功", pageResponse));
    }

    /**
     * 修改项目状态
     */
    @Operation(summary = "修改项目状态", description = "修改项目的状态")
    @PostMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Void>> changeProjectStatus(
            @Parameter(description = "项目ID") @PathVariable String id,
            @Parameter(description = "状态：1-进行中，0-已完成") @RequestParam(value = "status") Integer status) {
        projectService.changeProjectStatus(id, status);
        return ResponseEntity.ok(ApiResponse.<Void>success("项目状态修改成功"));
    }

    /**
     * 批量删除项目
     */
    @Operation(summary = "批量删除项目", description = "批量删除项目")
    @DeleteMapping("/batch")
    public ResponseEntity<ApiResponse<Void>> batchDeleteProjects(
            @Parameter(description = "项目ID列表") @RequestBody List<String> ids) {
        projectService.batchDeleteProjects(ids);
        return ResponseEntity.ok(ApiResponse.<Void>success("项目批量删除成功"));
    }

    /**
     * 获取项目统计信息
     */
    @Operation(summary = "获取项目统计", description = "获取项目的统计信息")
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProjectStatistics() {
        Map<String, Object> statistics = projectService.getProjectStatistics();
        return ResponseEntity.ok(ApiResponse.success("统计信息获取成功", statistics));
    }
}
