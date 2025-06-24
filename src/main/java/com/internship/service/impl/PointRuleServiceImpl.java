package com.internship.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.internship.dto.PageResponse;
import com.internship.entity.PointRule;
import com.internship.exception.BusinessException;
import com.internship.repository.PointRuleRepository;
import com.internship.service.PointRuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 积分规则服务实现类 (MyBatis Plus Version)
 *
 * @author huihuizi1024
 * @date 2025.6.23
 * @version 1.2.0
 */
@Service
@Transactional
public class PointRuleServiceImpl implements PointRuleService {

    @Autowired
    private PointRuleRepository pointRuleRepository;

    @Override
    public PointRule createPointRule(PointRule pointRule) {
        // 强制设置ID为null，确保执行创建操作
        pointRule.setId(null);
        
        // 检查规则编码是否已存在
        PointRule existingRule = pointRuleRepository.findByRuleCode(pointRule.getRuleCode());
        if (existingRule != null) {
            throw new BusinessException("RULE_CODE_EXISTS", "规则编码已存在");
        }

        // 设置默认值
        if (pointRule.getStatus() == null) {
            pointRule.setStatus(1); // 默认启用
        }
        if (pointRule.getReviewStatus() == null) {
            pointRule.setReviewStatus(0); // 默认待审核
        }

        // 设置创建时间
        pointRule.setCreateTime(LocalDateTime.now());
        pointRule.setUpdateTime(LocalDateTime.now());

        // 模拟当前用户信息（实际项目中应从认证上下文获取）
        pointRule.setCreatorId(1L);
        pointRule.setCreatorName("系统管理员");

        pointRuleRepository.insert(pointRule);
        return pointRule;
    }

    @Override
    public PointRule updatePointRule(Long id, PointRule pointRule) {
        PointRule existingRule = getPointRuleById(id);

        // 检查规则编码是否被其他规则使用
        if (StringUtils.hasText(pointRule.getRuleCode()) && 
            !pointRule.getRuleCode().equals(existingRule.getRuleCode())) {
            PointRule duplicateRule = pointRuleRepository.findByRuleCodeAndIdNot(pointRule.getRuleCode(), id);
            if (duplicateRule != null) {
                throw new BusinessException("RULE_CODE_EXISTS", "规则编码已存在");
            }
        }

        // 更新字段
        if (StringUtils.hasText(pointRule.getRuleName())) {
            existingRule.setRuleName(pointRule.getRuleName());
        }
        if (StringUtils.hasText(pointRule.getRuleCode())) {
            existingRule.setRuleCode(pointRule.getRuleCode());
        }
        if (StringUtils.hasText(pointRule.getRuleDescription())) {
            existingRule.setRuleDescription(pointRule.getRuleDescription());
        }
        if (pointRule.getPointType() != null) {
            existingRule.setPointType(pointRule.getPointType());
        }
        if (pointRule.getPointValue() != null) {
            existingRule.setPointValue(pointRule.getPointValue());
        }
        if (pointRule.getApplicableObject() != null) {
            existingRule.setApplicableObject(pointRule.getApplicableObject());
        }
        if (pointRule.getValidityType() != null) {
            existingRule.setValidityType(pointRule.getValidityType());
        }
        if (pointRule.getValidityDays() != null) {
            existingRule.setValidityDays(pointRule.getValidityDays());
        }

        // 如果规则被修改，重置审核状态
        existingRule.setReviewStatus(0);
        existingRule.setReviewTime(null);
        existingRule.setReviewComment(null);
        existingRule.setReviewerId(null);
        existingRule.setReviewerName(null);
        existingRule.setUpdateTime(LocalDateTime.now());

        pointRuleRepository.updateById(existingRule);
        return existingRule;
    }

    @Override
    public void deletePointRule(Long id) {
        PointRule pointRule = getPointRuleById(id);
        // 软删除：设置状态为无效
        pointRule.setStatus(0);
        pointRule.setUpdateTime(LocalDateTime.now());
        pointRuleRepository.updateById(pointRule);
    }

    @Override
    @Transactional(readOnly = true)
    public PointRule getPointRuleById(Long id) {
        PointRule pointRule = pointRuleRepository.selectById(id);
        if (pointRule == null) {
            throw new BusinessException("POINT_RULE_NOT_FOUND", "积分规则不存在");
        }
        return pointRule;
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<PointRule> getPointRules(Integer page, Integer size, String ruleName, 
                                               String ruleCode, Integer pointType, Integer applicableObject, 
                                               Integer status, Integer reviewStatus) {
        // 参数校验和默认值设置
        if (page == null || page < 1) {
            page = 1;
        }
        if (size == null || size < 1) {
            size = 10;
        }
        if (size > 100) {
            size = 100; // 限制最大分页大小
        }

        // 构建查询条件
        LambdaQueryWrapper<PointRule> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.like(StringUtils.hasText(ruleName), PointRule::getRuleName, ruleName)
                   .like(StringUtils.hasText(ruleCode), PointRule::getRuleCode, ruleCode)
                   .eq(pointType != null, PointRule::getPointType, pointType)
                   .eq(applicableObject != null, PointRule::getApplicableObject, applicableObject)
                   .eq(status != null, PointRule::getStatus, status)
                   .eq(reviewStatus != null, PointRule::getReviewStatus, reviewStatus)
                   .orderByDesc(PointRule::getCreateTime);

        Page<PointRule> pageQuery = new Page<>(page, size);
        IPage<PointRule> pageResult = pointRuleRepository.selectPage(pageQuery, queryWrapper);

        return new PageResponse<>(
                page,
                size,
                pageResult.getTotal(),
                pageResult.getRecords()
        );
    }

    @Override
    public void reviewPointRule(Long id, Integer reviewStatus, String reviewComment) {
        PointRule pointRule = getPointRuleById(id);

        if (pointRule.getReviewStatus() != 0) {
            throw new BusinessException("INVALID_REVIEW_STATUS", "该积分规则已经审核过，无法重复审核");
        }

        if (reviewStatus == null || (reviewStatus != 1 && reviewStatus != 2)) {
            throw new BusinessException("INVALID_REVIEW_RESULT", "审核结果无效，必须是1（通过）或2（拒绝）");
        }

        pointRule.setReviewStatus(reviewStatus);
        pointRule.setReviewTime(LocalDateTime.now());
        pointRule.setReviewComment(reviewComment);
        pointRule.setUpdateTime(LocalDateTime.now());
        
        // 模拟当前审核人信息
        pointRule.setReviewerId(1L);
        pointRule.setReviewerName("系统审核员");

        pointRuleRepository.updateById(pointRule);
    }

    @Override
    public void changePointRuleStatus(Long id, Integer status) {
        PointRule pointRule = getPointRuleById(id);

        if (status == null || (status != 0 && status != 1)) {
            throw new BusinessException("INVALID_STATUS", "状态值无效，必须是0（禁用）或1（启用）");
        }

        pointRule.setStatus(status);
        pointRule.setUpdateTime(LocalDateTime.now());
        pointRuleRepository.updateById(pointRule);
    }

    @Override
    public void batchDeletePointRules(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            throw new BusinessException("EMPTY_ID_LIST", "ID列表不能为空");
        }

        List<PointRule> pointRules = pointRuleRepository.findByIdIn(ids);
        if (pointRules.size() != ids.size()) {
            throw new BusinessException("SOME_RULES_NOT_FOUND", "部分积分规则不存在");
        }

        // 批量软删除
        pointRules.forEach(rule -> {
            rule.setStatus(0);
            rule.setUpdateTime(LocalDateTime.now());
        });
        
        // MyBatis Plus批量更新
        pointRules.forEach(rule -> pointRuleRepository.updateById(rule));
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getPointRuleStatistics() {
        Map<String, Object> statistics = new HashMap<>();

        // 总数统计
        long totalCount = pointRuleRepository.selectCount(null);
        statistics.put("totalCount", totalCount);

        // 按状态统计
        long activeCount = pointRuleRepository.countByStatus(1);
        long inactiveCount = pointRuleRepository.countByStatus(0);
        statistics.put("activeCount", activeCount);
        statistics.put("inactiveCount", inactiveCount);

        // 按审核状态统计
        long pendingReviewCount = pointRuleRepository.countByReviewStatus(0);
        long approvedCount = pointRuleRepository.countByReviewStatus(1);
        long rejectedCount = pointRuleRepository.countByReviewStatus(2);
        statistics.put("pendingReviewCount", pendingReviewCount);
        statistics.put("approvedCount", approvedCount);
        statistics.put("rejectedCount", rejectedCount);

        // 按积分类型统计
        Map<String, Long> pointTypeStats = new HashMap<>();
        pointTypeStats.put("learningPoints", pointRuleRepository.countByPointType(1));
        pointTypeStats.put("activityPoints", pointRuleRepository.countByPointType(2));
        pointTypeStats.put("contributionPoints", pointRuleRepository.countByPointType(3));
        statistics.put("pointTypeStats", pointTypeStats);

        return statistics;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PointRule> exportPointRules(String ruleName, Integer pointType, Integer status) {
        // 构建查询条件
        LambdaQueryWrapper<PointRule> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.like(StringUtils.hasText(ruleName), PointRule::getRuleName, ruleName)
                   .eq(pointType != null, PointRule::getPointType, pointType)
                   .eq(status != null, PointRule::getStatus, status)
                   .orderByDesc(PointRule::getCreateTime);

        return pointRuleRepository.selectList(queryWrapper);
    }
} 