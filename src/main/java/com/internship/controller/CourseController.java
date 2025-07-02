package com.internship.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.internship.dto.ApiResponse;
import com.internship.dto.CourseDTO;
import com.internship.entity.CourseWatchRecord;
import com.internship.entity.Project;
import com.internship.entity.User;
import com.internship.repository.ProjectRepository;
import com.internship.service.CourseWatchService;
import com.internship.service.ProjectService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 课程控制器
 */
@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private static final Logger log = LoggerFactory.getLogger(CourseController.class);

    @Autowired
    private ProjectService projectService;

    @Autowired
    private CourseWatchService courseWatchService;

    @Autowired
    private ProjectRepository projectRepository;

    /**
     * 获取课程列表（分页）
     * @param page 页码
     * @param size 每页大小
     * @param category 课程分类
     * @return 课程列表
     */
    @GetMapping
    public ResponseEntity<?> getCourses(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Integer category) {
        try {
            // 使用ProjectService的getProjects方法获取分页数据
            String projectName = null;
            String projectCode = null;
            Integer status = null;
            
            // 获取所有项目
            com.internship.dto.PageResponse<Project> projectPage = 
                projectService.getProjects(page, size, projectName, projectCode, status);
            
            // 如果需要按分类过滤
            List<Project> filteredProjects = new ArrayList<>();
            for (Project project : projectPage.getRecords()) {
                if (category == null || category.equals(project.getCategory())) {
                    filteredProjects.add(project);
                }
            }
            
            // 创建返回结果
            Page<Project> result = new Page<>(page, size, projectPage.getTotalRecords());
            result.setRecords(filteredProjects);
            
            return ResponseEntity.ok(ApiResponse.success(result));
        } catch (Exception e) {
            log.error("获取课程列表失败", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("获取课程列表失败"));
        }
    }

    /**
     * 获取课程详情
     * @param id 课程ID
     * @return 课程详情
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getCourseDetail(@PathVariable String id) {
        try {
            Project course = projectRepository.selectById(id);
            if (course == null) {
                return ResponseEntity.badRequest().body(ApiResponse.error("课程不存在"));
            }
            
            CourseDTO courseDTO = new CourseDTO();
            courseDTO.setId(course.getId());
            courseDTO.setCourseName(course.getProjectName());
            courseDTO.setCourseCode(course.getProjectCode());
            courseDTO.setInstructor(course.getManager());
            courseDTO.setStartDate(course.getStartDate());
            courseDTO.setEndDate(course.getEndDate());
            courseDTO.setStatus(course.getStatus());
            courseDTO.setDescription(course.getDescription());
            courseDTO.setInstitutionId(course.getInstitutionId());
            courseDTO.setCategory(course.getCategory());
            courseDTO.setCategoryName(CourseDTO.getCategoryName(course.getCategory()));
            courseDTO.setVideoUrl(course.getVideoUrl());
            courseDTO.setCoverImageUrl(course.getCoverImageUrl());
            courseDTO.setPointsReward(course.getPointsReward());
            courseDTO.setDuration(course.getDuration());
            courseDTO.setViewCount(course.getViewCount());
            
            // 更新浏览量
            course.setViewCount(course.getViewCount() == null ? 1 : course.getViewCount() + 1);
            projectRepository.updateById(course);
            
            // 检查当前用户是否观看过该课程
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getPrincipal() instanceof User) {
                User user = (User) authentication.getPrincipal();
                CourseWatchRecord record = courseWatchService.checkUserWatchRecord(user.getId(), id);
                if (record != null) {
                    courseDTO.setIsWatched(record.getWatchStatus() == 1);
                    courseDTO.setWatchProgress(record.getWatchProgress());
                }
            }
            
            return ResponseEntity.ok(ApiResponse.success(courseDTO));
        } catch (Exception e) {
            log.error("获取课程详情失败", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("获取课程详情失败"));
        }
    }

    /**
     * 记录课程观看进度
     * @param id 课程ID
     * @param progress 观看进度
     * @return 结果
     */
    @PostMapping("/{id}/progress")
    public ResponseEntity<?> recordProgress(
            @PathVariable String id,
            @RequestParam Integer progress) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !(authentication.getPrincipal() instanceof User)) {
                return ResponseEntity.badRequest().body(ApiResponse.error("未登录"));
            }
            
            User user = (User) authentication.getPrincipal();
            boolean success = courseWatchService.recordWatching(user.getId(), id, progress);
            
            if (success) {
                return ResponseEntity.ok(ApiResponse.success("记录成功"));
            } else {
                return ResponseEntity.badRequest().body(ApiResponse.error("记录失败"));
            }
        } catch (Exception e) {
            log.error("记录课程观看进度失败", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("记录课程观看进度失败"));
        }
    }

    /**
     * 完成课程观看
     * @param id 课程ID
     * @return 结果
     */
    @PostMapping("/{id}/complete")
    public ResponseEntity<?> completeCourse(@PathVariable String id) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !(authentication.getPrincipal() instanceof User)) {
                return ResponseEntity.badRequest().body(ApiResponse.error("未登录"));
            }
            
            User user = (User) authentication.getPrincipal();
            boolean success = courseWatchService.completeCourse(user.getId(), id);
            
            if (success) {
                return ResponseEntity.ok(ApiResponse.success("完成课程观看成功"));
            } else {
                return ResponseEntity.badRequest().body(ApiResponse.error("完成课程观看失败"));
            }
        } catch (Exception e) {
            log.error("完成课程观看失败", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("完成课程观看失败"));
        }
    }

    /**
     * 获取当前用户的课程观看记录
     * @param page 页码
     * @param size 每页大小
     * @return 课程观看记录
     */
    @GetMapping("/me/records")
    public ResponseEntity<?> getMyCourseRecords(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !(authentication.getPrincipal() instanceof User)) {
                return ResponseEntity.badRequest().body(ApiResponse.error("未登录"));
            }
            
            User user = (User) authentication.getPrincipal();
            Page<CourseDTO> records = courseWatchService.getUserCourseRecords(user.getId(), page, size);
            
            return ResponseEntity.ok(ApiResponse.success(records));
        } catch (Exception e) {
            log.error("获取课程观看记录失败", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("获取课程观看记录失败"));
        }
    }

    /**
     * 获取当前用户已完成的课程
     * @return 已完成的课程
     */
    @GetMapping("/me/completed")
    public ResponseEntity<?> getMyCompletedCourses() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !(authentication.getPrincipal() instanceof User)) {
                return ResponseEntity.badRequest().body(ApiResponse.error("未登录"));
            }
            
            User user = (User) authentication.getPrincipal();
            List<CourseDTO> courses = courseWatchService.getCompletedCourses(user.getId());
            
            return ResponseEntity.ok(ApiResponse.success(courses));
        } catch (Exception e) {
            log.error("获取已完成课程失败", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("获取已完成课程失败"));
        }
    }
} 