package com.internship.service;

import com.internship.dto.PageResponse;
import com.internship.entity.PointRule;

import java.util.List;
import java.util.Map;

/**
 * 积分规则服务接口
 *
 * @author huihuizi1024
 * @date 2025.6.23
 * @version 1.1.0
 */
public interface PointRuleService {

    /**
     * 创建积分规则
     */
    PointRule createPointRule(PointRule pointRule);

    /**
     * 更新积分规则
     */
    PointRule updatePointRule(Long id, PointRule pointRule);

    /**
     * 删除积分规则（软删除）
     */
    void deletePointRule(Long id);

    /**
     * 根据ID获取积分规则
     */
    PointRule getPointRuleById(Long id);

    /**
     * 分页查询积分规则
     */
    PageResponse<PointRule> getPointRules(Integer page, Integer size, String ruleName, 
                                        String ruleCode, Integer pointType, Integer applicableObject, 
                                        Integer status, Integer reviewStatus);

    /**
     * 审核积分规则
     */
    void reviewPointRule(Long id, Integer reviewStatus, String reviewComment);

    /**
     * 修改积分规则状态
     */
    void changePointRuleStatus(Long id, Integer status);

    /**
     * 批量删除积分规则
     */
    void batchDeletePointRules(List<Long> ids);

    /**
     * 获取积分规则统计信息
     */
    Map<String, Object> getPointRuleStatistics();

    /**
     * 导出积分规则数据
     */
    List<PointRule> exportPointRules(String ruleName, Integer pointType, Integer status);
} 