package com.internship.service.impl;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.internship.dto.CourseDTO;
import com.internship.entity.PointTransaction;
import com.internship.entity.Project;
import com.internship.entity.ProjectWatchRecord;
import com.internship.entity.User;
import com.internship.repository.ProjectRepository;
import com.internship.repository.ProjectWatchRecordRepository;
import com.internship.repository.UserRepository;
import com.internship.service.CourseWatchService;
import com.internship.service.TransactionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseWatchServiceImpl implements CourseWatchService {

    private static final Logger log = LoggerFactory.getLogger(CourseWatchServiceImpl.class);

    @Autowired
    private ProjectWatchRecordRepository projectWatchRecordRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionService transactionService;

    @Override
    public boolean recordWatching(Long userId, String courseId, Integer progress) {
        try {
            ProjectWatchRecord record = projectWatchRecordRepository.findByUserIdAndProjectId(userId, courseId);
            
            if (record == null) {
                // 创建新记录
                record = new ProjectWatchRecord();
                record.setUserId(userId);
                record.setProjectId(courseId);
                record.setWatchStatus(0); // 未完成
                record.setWatchProgress(progress);
                record.setIsRewarded(0); // 未获得积分
                record.setLastWatchTime(LocalDateTime.now());
                projectWatchRecordRepository.insert(record);
            } else {
                // 更新进度
                if (progress > record.getWatchProgress()) {
                    record.setWatchProgress(progress);
                }
                record.setLastWatchTime(LocalDateTime.now());
                projectWatchRecordRepository.updateById(record);
            }
            
            // 如果进度达到90%以上，自动标记为完成
            if (progress >= 90 && record.getWatchStatus() == 0) {
                return completeCourse(userId, courseId);
            }
            
            return true;
        } catch (Exception e) {
            log.error("记录课程观看失败", e);
            return false;
        }
    }

    @Override
    @Transactional
    public boolean completeCourse(Long userId, String courseId) {
        try {
            ProjectWatchRecord record = projectWatchRecordRepository.findByUserIdAndProjectId(userId, courseId);
            
            if (record == null) {
                // 创建新记录并标记为完成
                record = new ProjectWatchRecord();
                record.setUserId(userId);
                record.setProjectId(courseId);
                record.setWatchStatus(1); // 已完成
                record.setWatchProgress(100);
                record.setLastWatchTime(LocalDateTime.now());
                record.setIsRewarded(0); // 未获得积分
                projectWatchRecordRepository.insert(record);
            } else if (record.getWatchStatus() == 0) {
                // 更新为已完成
                record.setWatchStatus(1);
                record.setWatchProgress(100);
                record.setLastWatchTime(LocalDateTime.now());
                projectWatchRecordRepository.updateById(record);
            }
            
            // 如果已经获得过积分，则不再奖励
            if (record.getIsRewarded() == 1) {
                return true;
            }
            
            // 获取课程积分奖励
            Project course = projectRepository.selectById(courseId);
            if (course != null && course.getPointsReward() != null && course.getPointsReward() > 0) {
                // 给用户奖励积分
                User user = userRepository.selectById(userId);
                if (user != null) {
                    // 创建积分交易记录（TransactionService会自动更新用户积分余额）
                    PointTransaction transaction = new PointTransaction();
                    transaction.setUserId(userId);
                    transaction.setTransactionType(1); // 获得
                    transaction.setPointsChange((double) course.getPointsReward());
                    transaction.setDescription("完成课程《" + course.getProjectName() + "》获得积分");
                    transaction.setRelatedId(courseId);
                    transactionService.createTransaction(transaction);
                    
                    // 标记为已获得积分
                    record.setIsRewarded(1);
                    projectWatchRecordRepository.updateById(record);
                }
            }
            
            return true;
        } catch (Exception e) {
            log.error("完成课程观看失败", e);
            return false;
        }
    }

    @Override
    public Page<CourseDTO> getUserCourseRecords(Long userId, int page, int size) {
        try {
            Page<ProjectWatchRecord> recordPage = new Page<>(page, size);
            Page<ProjectWatchRecord> result = projectWatchRecordRepository.findUserProjectRecords(recordPage, userId);
            
            Page<CourseDTO> dtoPage = new Page<>(result.getCurrent(), result.getSize(), result.getTotal());
            List<CourseDTO> dtoList = new ArrayList<>();
            
            for (ProjectWatchRecord record : result.getRecords()) {
                Project project = projectRepository.selectById(record.getProjectId());
                if (project != null) {
                    CourseDTO dto = convertToDTO(project);
                    dto.setIsWatched(record.getWatchStatus() == 1);
                    dto.setWatchProgress(record.getWatchProgress());
                    dtoList.add(dto);
                }
            }
            
            dtoPage.setRecords(dtoList);
            return dtoPage;
        } catch (Exception e) {
            log.error("获取用户课程记录失败", e);
            return new Page<>();
        }
    }

    @Override
    public List<CourseDTO> getCompletedCourses(Long userId) {
        try {
            List<ProjectWatchRecord> records = projectWatchRecordRepository.findCompletedProjectsByUserId(userId);
            return records.stream().map(record -> {
                Project project = projectRepository.selectById(record.getProjectId());
                if (project != null) {
                    CourseDTO dto = convertToDTO(project);
                    dto.setIsWatched(true);
                    dto.setWatchProgress(100);
                    return dto;
                }
                return null;
            }).filter(dto -> dto != null).collect(Collectors.toList());
        } catch (Exception e) {
            log.error("获取用户已完成课程失败", e);
            return new ArrayList<>();
        }
    }

    @Override
    public ProjectWatchRecord checkUserWatchRecord(Long userId, String courseId) {
        return projectWatchRecordRepository.findByUserIdAndProjectId(userId, courseId);
    }
    
    /**
     * 将课程实体转换为DTO
     * @param course 课程实体
     * @return 课程DTO
     */
    private CourseDTO convertToDTO(Project course) {
        CourseDTO dto = new CourseDTO();
        dto.setId(course.getId());
        dto.setCourseName(course.getProjectName());
        dto.setCourseCode(course.getProjectCode());
        dto.setInstructor(course.getManager());
        dto.setStartDate(course.getStartDate());
        dto.setEndDate(course.getEndDate());
        dto.setStatus(course.getStatus());
        dto.setDescription(course.getDescription());
        dto.setInstitutionId(course.getInstitutionId());
        dto.setCategory(course.getCategory());
        dto.setCategoryName(CourseDTO.getCategoryName(course.getCategory()));
        dto.setVideoUrl(course.getVideoUrl());
        dto.setCoverImageUrl(course.getCoverImageUrl());
        dto.setPointsReward(course.getPointsReward());
        dto.setDuration(course.getDuration());
        dto.setViewCount(course.getViewCount());
        dto.setCreateTime(course.getCreateTime());
        dto.setUpdateTime(course.getUpdateTime());
        return dto;
    }
} 