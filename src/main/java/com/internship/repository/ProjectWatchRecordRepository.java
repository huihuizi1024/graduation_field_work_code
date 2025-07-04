package com.internship.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.internship.entity.ProjectWatchRecord;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectWatchRecordRepository extends BaseMapper<ProjectWatchRecord> {
    
    /**
     * 查询用户的项目观看记录
     * @param page 分页参数
     * @param userId 用户ID
     * @return 项目观看记录页
     */
    @Select("SELECT pwr.*, p.project_name as projectName, p.cover_image_url as coverImageUrl " +
            "FROM project_watch_record pwr " +
            "LEFT JOIN project p ON pwr.project_id = p.id " +
            "WHERE pwr.user_id = #{userId} " +
            "ORDER BY pwr.last_watch_time DESC")
    Page<ProjectWatchRecord> findUserProjectRecords(Page<?> page, @Param("userId") Long userId);
    
    /**
     * 查询用户是否观看过指定项目
     * @param userId 用户ID
     * @param projectId 项目ID
     * @return 观看记录
     */
    @Select("SELECT * FROM project_watch_record WHERE user_id = #{userId} AND project_id = #{projectId} LIMIT 1")
    ProjectWatchRecord findByUserIdAndProjectId(@Param("userId") Long userId, @Param("projectId") String projectId);
    
    /**
     * 查询用户所有已完成的项目
     * @param userId 用户ID
     * @return 已完成的项目列表
     */
    @Select("SELECT pwr.* FROM project_watch_record pwr WHERE pwr.user_id = #{userId} AND pwr.watch_status = 1")
    List<ProjectWatchRecord> findCompletedProjectsByUserId(@Param("userId") Long userId);

    // 添加带锁的查询方法，确保同一记录不会被同时更新
    @Select("SELECT * FROM project_watch_record WHERE user_id = #{userId} AND project_id = #{projectId} FOR UPDATE")
    ProjectWatchRecord findByUserIdAndProjectIdForUpdate(@Param("userId") Long userId, @Param("projectId") String projectId);
} 