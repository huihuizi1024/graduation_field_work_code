package com.internship.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.internship.entity.CourseWatchRecord;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseWatchRecordRepository extends BaseMapper<CourseWatchRecord> {
    
    /**
     * 查询用户的课程观看记录
     * @param page 分页参数
     * @param userId 用户ID
     * @return 课程观看记录页
     */
    @Select("SELECT cwr.*, p.project_name as courseName, p.cover_image_url as coverImageUrl " +
            "FROM course_watch_record cwr " +
            "LEFT JOIN project p ON cwr.course_id = p.id " +
            "WHERE cwr.user_id = #{userId} " +
            "ORDER BY cwr.last_watch_time DESC")
    Page<CourseWatchRecord> findUserCourseRecords(Page<?> page, @Param("userId") Long userId);
    
    /**
     * 查询用户是否观看过指定课程
     * @param userId 用户ID
     * @param courseId 课程ID
     * @return 观看记录
     */
    @Select("SELECT * FROM course_watch_record WHERE user_id = #{userId} AND course_id = #{courseId} LIMIT 1")
    CourseWatchRecord findByUserIdAndCourseId(@Param("userId") Long userId, @Param("courseId") String courseId);
    
    /**
     * 查询用户所有已完成的课程
     * @param userId 用户ID
     * @return 已完成的课程列表
     */
    @Select("SELECT cwr.* FROM course_watch_record cwr WHERE cwr.user_id = #{userId} AND cwr.watch_status = 1")
    List<CourseWatchRecord> findCompletedCoursesByUserId(@Param("userId") Long userId);
} 