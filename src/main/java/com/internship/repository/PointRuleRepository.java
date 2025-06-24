package com.internship.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.internship.entity.PointRule;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 积分规则数据访问层 (MyBatis Plus Version)
 *
 * @author huihuizi1024
 * @date 2025.6.23
 * @version 1.2.0
 */
@Mapper
public interface PointRuleRepository extends BaseMapper<PointRule> {

    /**
     * 根据规则编码查找积分规则
     */
    @Select("SELECT * FROM point_rule WHERE rule_code = #{ruleCode}")
    PointRule findByRuleCode(@Param("ruleCode") String ruleCode);

    /**
     * 根据规则编码查找积分规则（排除指定ID）
     */
    @Select("SELECT * FROM point_rule WHERE rule_code = #{ruleCode} AND id != #{id}")
    PointRule findByRuleCodeAndIdNot(@Param("ruleCode") String ruleCode, @Param("id") Long id);

    /**
     * 批量查询积分规则
     */
    @Select("<script>" +
            "SELECT * FROM point_rule WHERE id IN " +
            "<foreach collection='ids' item='id' open='(' separator=',' close=')'>" +
            "#{id}" +
            "</foreach>" +
            "</script>")
    List<PointRule> findByIdIn(@Param("ids") List<Long> ids);

    /**
     * 根据状态查询积分规则数量
     */
    @Select("SELECT COUNT(*) FROM point_rule WHERE status = #{status}")
    long countByStatus(@Param("status") Integer status);

    /**
     * 根据审核状态查询积分规则数量
     */
    @Select("SELECT COUNT(*) FROM point_rule WHERE review_status = #{reviewStatus}")
    long countByReviewStatus(@Param("reviewStatus") Integer reviewStatus);

    /**
     * 根据积分类型查询积分规则数量
     */
    @Select("SELECT COUNT(*) FROM point_rule WHERE point_type = #{pointType}")
    long countByPointType(@Param("pointType") Integer pointType);

    /**
     * 查询所有有效的积分规则
     */
    @Select("SELECT * FROM point_rule WHERE status = #{status} AND review_status = #{reviewStatus}")
    List<PointRule> findByStatusAndReviewStatus(@Param("status") Integer status, 
                                               @Param("reviewStatus") Integer reviewStatus);
} 