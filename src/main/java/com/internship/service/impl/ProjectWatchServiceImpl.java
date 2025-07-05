package com.internship.service.impl;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.internship.dto.ProjectDTO;
import com.internship.entity.ProjectWatchRecord;
import com.internship.entity.PointTransaction;
import com.internship.entity.Project;
import com.internship.entity.User;
import com.internship.repository.ProjectWatchRecordRepository;
import com.internship.repository.ProjectRepository;
import com.internship.repository.UserRepository;
import com.internship.service.ProjectWatchService;
import com.internship.service.TransactionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Isolation;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProjectWatchServiceImpl implements ProjectWatchService {

    private static final Logger log = LoggerFactory.getLogger(ProjectWatchServiceImpl.class);

    @Autowired
    private ProjectWatchRecordRepository projectWatchRecordRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionService transactionService;

    @Override
    public boolean recordWatching(Long userId, String projectId, Integer progress) {
        try {
            // 变更：查询多条记录并取最新的一条
            List<ProjectWatchRecord> records = projectWatchRecordRepository.findListByUserIdAndProjectId(userId, projectId);
            ProjectWatchRecord record = records.isEmpty() ? null : records.get(0);

            if (record == null) {
                // 创建新记录
                record = new ProjectWatchRecord();
                record.setUserId(userId);
                record.setProjectId(projectId);
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
            if (progress >= 90 && (record == null || record.getWatchStatus() == 0)) {
                // 如果record是新创建的，需要先保存获取ID
                if (record == null) {
                    record = projectWatchRecordRepository.findByUserIdAndProjectId(userId, projectId);
                }
                if(record.getWatchStatus() == 0) {
                    return completeProject(userId, projectId);
                }
            }
            
            return true;
        } catch (Exception e) {
            log.error("记录项目观看失败", e);
            return false;
        }
    }

    @Override
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public synchronized boolean completeProject(Long userId, String projectId) {
        try {
            log.info("开始处理项目完成请求 - 用户ID: {}, 项目ID: {}", userId, projectId);

            // 变更：查询多条记录并取最新的一条进行加锁
            List<ProjectWatchRecord> records = projectWatchRecordRepository.findListByUserIdAndProjectIdForUpdate(userId, projectId);
            if (records.isEmpty()) {
                 log.warn("在completeProject中未找到观看记录 - 用户ID: {}, 项目ID: {}", userId, projectId);
                 // 即使没有记录，也可能需要创建。下面的逻辑会处理。
            }
            
            ProjectWatchRecord record = records.isEmpty() ? null : records.get(0);

            // 如果记录已经存在且已经获得过积分，则不再奖励
            if (record != null && record.getIsRewarded() == 1) {
                log.info("用户已获得过该项目积分，不再重复奖励 - 用户ID: {}, 项目ID: {}", userId, projectId);
                return true;
            }
            
            // 记录完成前查询是否已有重复交易
            boolean hasExistingTransaction = transactionService.hasRewardTransaction(userId, projectId);
            if (hasExistingTransaction) {
                log.info("检测到已存在积分奖励交易，避免重复奖励 - 用户ID: {}, 项目ID: {}", userId, projectId);
                
                // 如果有交易但记录状态未更新，则更新记录状态
                if (record != null && record.getIsRewarded() == 0) {
                    record.setIsRewarded(1);
                    record.setWatchStatus(1);
                    record.setWatchProgress(100);
                    record.setLastWatchTime(LocalDateTime.now());
                    projectWatchRecordRepository.updateById(record);
                    log.info("更新记录状态为已奖励 - 用户ID: {}, 项目ID: {}", userId, projectId);
                }
                
                return true;
            }
            
            if (record == null) {
                // 创建新记录并标记为完成
                log.info("创建新的项目观看记录 - 用户ID: {}, 项目ID: {}", userId, projectId);
                record = new ProjectWatchRecord();
                record.setUserId(userId);
                record.setProjectId(projectId);
                record.setWatchStatus(1); // 已完成
                record.setWatchProgress(100);
                record.setLastWatchTime(LocalDateTime.now());
                record.setIsRewarded(0); // 未获得积分
                projectWatchRecordRepository.insert(record);
            } else if (record.getWatchStatus() == 0) {
                // 更新为已完成
                log.info("更新项目观看记录为已完成 - 用户ID: {}, 项目ID: {}", userId, projectId);
                record.setWatchStatus(1);
                record.setWatchProgress(100);
                record.setLastWatchTime(LocalDateTime.now());
                projectWatchRecordRepository.updateById(record);
            }
            
            // 获取项目积分奖励
            Project project = projectRepository.selectById(projectId);
            if (project != null && project.getPointsReward() != null && project.getPointsReward() > 0) {
                // 给用户奖励积分
                User user = userRepository.selectById(userId);
                if (user != null) {
                    log.info("准备奖励积分 - 用户ID: {}, 项目ID: {}, 积分数: {}", 
                            userId, projectId, project.getPointsReward());
                    
                    // 为避免重复积分，先标记为已获得积分
                    record.setIsRewarded(1);
                    projectWatchRecordRepository.updateById(record);
                    log.info("已标记用户项目记录为已获得积分 - 用户ID: {}, 项目ID: {}", userId, projectId);
                    
                    // 不在这里更新用户积分，交由TransactionService处理
                    // 避免重复加积分
                    
                    // 创建积分交易记录
                    PointTransaction transaction = new PointTransaction();
                    transaction.setUserId(userId);
                    transaction.setTransactionType(1); // 获得
                    transaction.setPointsChange((double) project.getPointsReward());
                    // 不设置balanceAfter，由TransactionService计算
                    transaction.setDescription("完成项目《" + project.getProjectName() + "》获得积分");
                    transaction.setRelatedId(projectId);
                    transactionService.createTransaction(transaction);
                    log.info("已创建积分交易记录 - 用户ID: {}, 项目ID: {}, 交易ID: {}", 
                            userId, projectId, transaction.getId());
                }
            }
            
            return true;
        } catch (Exception e) {
            log.error("完成项目观看失败 - 用户ID: {}, 项目ID: {}", userId, projectId, e);
            return false;
        }
    }

    @Override
    public Page<ProjectDTO> getUserProjectRecords(Long userId, int page, int size) {
        try {
            Page<ProjectWatchRecord> recordPage = new Page<>(page, size);
            Page<ProjectWatchRecord> result = projectWatchRecordRepository.findUserProjectRecords(recordPage, userId);
            
            Page<ProjectDTO> dtoPage = new Page<>(result.getCurrent(), result.getSize(), result.getTotal());
            List<ProjectDTO> dtoList = new ArrayList<>();
            
            for (ProjectWatchRecord record : result.getRecords()) {
                Project project = projectRepository.selectById(record.getProjectId());
                if (project != null) {
                    ProjectDTO dto = convertToDTO(project);
                    dto.setIsWatched(record.getWatchStatus() == 1);
                    dto.setWatchProgress(record.getWatchProgress());
                    dtoList.add(dto);
                }
            }
            
            dtoPage.setRecords(dtoList);
            return dtoPage;
        } catch (Exception e) {
            log.error("获取用户项目记录失败", e);
            return new Page<>();
        }
    }

    @Override
    public List<ProjectDTO> getCompletedProjects(Long userId) {
        try {
            List<ProjectWatchRecord> records = projectWatchRecordRepository.findCompletedProjectsByUserId(userId);
            return records.stream().map(record -> {
                Project project = projectRepository.selectById(record.getProjectId());
                if (project != null) {
                    ProjectDTO dto = convertToDTO(project);
                    dto.setIsWatched(true);
                    dto.setWatchProgress(100);
                    return dto;
                }
                return null;
            }).filter(dto -> dto != null).collect(Collectors.toList());
        } catch (Exception e) {
            log.error("获取用户已完成项目失败", e);
            return new ArrayList<>();
        }
    }

    @Override
    public ProjectWatchRecord checkUserWatchRecord(Long userId, String projectId) {
        // 变更：查询多条记录并取最新的一条
        List<ProjectWatchRecord> records = projectWatchRecordRepository.findListByUserIdAndProjectId(userId, projectId);
        return records.isEmpty() ? null : records.get(0);
    }
    
    /**
     * 将项目实体转换为DTO
     * @param project 项目实体
     * @return 项目DTO
     */
    private ProjectDTO convertToDTO(Project project) {
        ProjectDTO dto = new ProjectDTO();
        dto.setId(project.getId());
        dto.setProjectName(project.getProjectName());
        dto.setProjectCode(project.getProjectCode());
        dto.setManager(project.getManager());
        dto.setStartDate(project.getStartDate());
        dto.setEndDate(project.getEndDate());
        dto.setStatus(project.getStatus());
        dto.setDescription(project.getDescription());
        dto.setInstitutionId(project.getInstitutionId());
        dto.setCategory(project.getCategory());
        dto.setCategoryName(ProjectDTO.getCategoryName(project.getCategory()));
        dto.setVideoUrl(project.getVideoUrl());
        dto.setCoverImageUrl(project.getCoverImageUrl());
        dto.setPointsReward(project.getPointsReward());
        dto.setDuration(project.getDuration());
        dto.setViewCount(project.getViewCount());
        dto.setCreateTime(project.getCreateTime());
        dto.setUpdateTime(project.getUpdateTime());
        return dto;
    }
} 