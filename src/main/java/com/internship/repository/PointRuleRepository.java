package com.internship.repository;

import com.internship.entity.PointRule;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 积分规则数据访问层
 *
 * @author huihuizi1024
 * @date 2025.6.23
 * @version 1.1.0
 */
@Repository
public interface PointRuleRepository extends JpaRepository<PointRule, Long> {

    /**
     * 根据规则编码查找积分规则
     */
    Optional<PointRule> findByRuleCode(String ruleCode);

    /**
     * 根据规则编码查找积分规则（排除指定ID）
     */
    Optional<PointRule> findByRuleCodeAndIdNot(String ruleCode, Long id);

    /**
     * 分页查询积分规则（支持多条件筛选）
     */
    @Query("SELECT pr FROM PointRule pr WHERE " +
           "(:ruleName IS NULL OR pr.ruleName LIKE %:ruleName%) AND " +
           "(:ruleCode IS NULL OR pr.ruleCode LIKE %:ruleCode%) AND " +
           "(:pointType IS NULL OR pr.pointType = :pointType) AND " +
           "(:applicableObject IS NULL OR pr.applicableObject = :applicableObject) AND " +
           "(:status IS NULL OR pr.status = :status) AND " +
           "(:reviewStatus IS NULL OR pr.reviewStatus = :reviewStatus) " +
           "ORDER BY pr.createTime DESC")
    Page<PointRule> findByConditions(@Param("ruleName") String ruleName,
                                   @Param("ruleCode") String ruleCode,
                                   @Param("pointType") Integer pointType,
                                   @Param("applicableObject") Integer applicableObject,
                                   @Param("status") Integer status,
                                   @Param("reviewStatus") Integer reviewStatus,
                                   Pageable pageable);

    /**
     * 批量查询积分规则
     */
    List<PointRule> findByIdIn(List<Long> ids);

    /**
     * 根据状态查询积分规则数量
     */
    long countByStatus(Integer status);

    /**
     * 根据审核状态查询积分规则数量
     */
    long countByReviewStatus(Integer reviewStatus);

    /**
     * 根据积分类型查询积分规则数量
     */
    long countByPointType(Integer pointType);

    /**
     * 查询所有有效的积分规则
     */
    List<PointRule> findByStatusAndReviewStatus(Integer status, Integer reviewStatus);
} 