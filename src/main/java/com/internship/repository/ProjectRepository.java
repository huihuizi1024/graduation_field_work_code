package com.internship.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.internship.entity.Project;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 项目数据访问层
 */
@Mapper
public interface ProjectRepository extends BaseMapper<Project> {

    /**
     * 根据项目编码查找项目
     */
    @Select("SELECT * FROM project WHERE project_code = #{projectCode}")
    Project findByProjectCode(@Param("projectCode") String projectCode);

    /**
     * 根据项目编码查找项目（排除指定ID）
     */
    @Select("SELECT * FROM project WHERE project_code = #{projectCode} AND id != #{id}")
    Project findByProjectCodeAndIdNot(@Param("projectCode") String projectCode, @Param("id") String id);

    /**
     * 根据状态查询项目列表
     */
    @Select("SELECT * FROM project WHERE status = #{status}")
    List<Project> findByStatus(@Param("status") Integer status);

    /**
     * 批量查询项目
     */
    @Select("<script>" +
            "SELECT * FROM project WHERE id IN " +
            "<foreach collection='ids' item='id' open='(' separator=',' close=')'>" +
            "#{id}" +
            "</foreach>" +
            "</script>")
    List<Project> findByIdIn(@Param("ids") List<String> ids);

    /**
     * 根据状态查询项目数量
     */
    @Select("SELECT COUNT(*) FROM project WHERE status = #{status}")
    long countByStatus(@Param("status") Integer status);
}
