package com.internship.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.internship.dto.PageResponse;
import com.internship.entity.ConversionRule;
import com.internship.exception.BusinessException;
import com.internship.repository.ConversionRuleRepository;
import com.internship.service.ConversionRuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Service
public class ConversionRuleServiceImpl implements ConversionRuleService {

    @Autowired
    private ConversionRuleRepository conversionRuleRepository;

    @Override
    public ConversionRule createConversionRule(ConversionRule conversionRule) {
        if (conversionRuleRepository.selectOne(new LambdaQueryWrapper<ConversionRule>()
                .eq(ConversionRule::getRuleCode, conversionRule.getRuleCode())) != null) {
            throw new BusinessException("转换规则编码已存在");
        }
        conversionRule.setCreateTime(LocalDateTime.now());
        conversionRule.setUpdateTime(LocalDateTime.now());
        conversionRuleRepository.insert(conversionRule);
        return conversionRule;
    }

    @Override
    public ConversionRule updateConversionRule(Long id, ConversionRule conversionRule) {
        ConversionRule existingRule = conversionRuleRepository.selectById(id);
        if (existingRule == null) {
            throw new BusinessException("转换规则不存在");
        }
        // 检查编码是否被其他规则占用
        ConversionRule ruleWithSameCode = conversionRuleRepository.selectOne(new LambdaQueryWrapper<ConversionRule>()
                .eq(ConversionRule::getRuleCode, conversionRule.getRuleCode()));
        if (ruleWithSameCode != null && !ruleWithSameCode.getId().equals(id)) {
            throw new BusinessException("转换规则编码已存在");
        }
        conversionRule.setId(id);
        conversionRule.setUpdateTime(LocalDateTime.now());
        conversionRuleRepository.updateById(conversionRule);
        return conversionRule;
    }

    @Override
    public void deleteConversionRule(Long id) {
        ConversionRule existingRule = conversionRuleRepository.selectById(id);
        if (existingRule == null) {
            throw new BusinessException("转换规则不存在");
        }
        existingRule.setStatus(0); // 软删除，将状态设为0（无效）
        existingRule.setUpdateTime(LocalDateTime.now());
        conversionRuleRepository.updateById(existingRule);
    }

    @Override
    public ConversionRule getConversionRuleById(Long id) {
        return conversionRuleRepository.selectById(id);
    }

    @Override
    public PageResponse<ConversionRule> getConversionRules(Integer page, Integer size, String ruleName, Integer sourceType, Integer targetType, Integer status, Integer reviewStatus) {
        Page<ConversionRule> pageCondition = new Page<>(page + 1, size); // 后端页码从1开始
        LambdaQueryWrapper<ConversionRule> queryWrapper = new LambdaQueryWrapper<>();

        if (StringUtils.hasText(ruleName)) {
            queryWrapper.like(ConversionRule::getRuleName, ruleName);
        }
        if (sourceType != null) {
            queryWrapper.eq(ConversionRule::getSourceType, sourceType);
        }
        if (targetType != null) {
            queryWrapper.eq(ConversionRule::getTargetType, targetType);
        }
        if (status != null) {
            queryWrapper.eq(ConversionRule::getStatus, status);
        }
        if (reviewStatus != null) {
            queryWrapper.eq(ConversionRule::getReviewStatus, reviewStatus);
        }

        IPage<ConversionRule> iPage = conversionRuleRepository.selectPage(pageCondition, queryWrapper);
        return new PageResponse<ConversionRule>(Integer.valueOf((int) (iPage.getCurrent() - 1)), Integer.valueOf((int) iPage.getSize()), Long.valueOf(iPage.getTotal()), iPage.getRecords());
    }

    @Override
    public void reviewConversionRule(Long id, Integer reviewStatus, String reviewComment) {
        ConversionRule existingRule = conversionRuleRepository.selectById(id);
        if (existingRule == null) {
            throw new BusinessException("转换规则不存在");
        }
        existingRule.setReviewStatus(reviewStatus);
        existingRule.setReviewComment(reviewComment);
        existingRule.setReviewTime(LocalDateTime.now());
        existingRule.setUpdateTime(LocalDateTime.now());
        // TODO: 审核人ID和姓名需要从当前登录用户获取
        existingRule.setReviewerId(1L);
        existingRule.setReviewerName("系统管理员");
        conversionRuleRepository.updateById(existingRule);
    }

    @Override
    public void changeConversionRuleStatus(Long id, Integer status) {
        ConversionRule existingRule = conversionRuleRepository.selectById(id);
        if (existingRule == null) {
            throw new BusinessException("转换规则不存在");
        }
        existingRule.setStatus(status);
        existingRule.setUpdateTime(LocalDateTime.now());
        conversionRuleRepository.updateById(existingRule);
    }

    @Override
    public Map<String, Object> getConversionRuleStatistics() {
        // 示例统计数据，实际应从数据库查询
        Map<String, Object> statistics = new HashMap<>();
        statistics.put("totalRules", conversionRuleRepository.selectCount(null));
        statistics.put("activeRules", conversionRuleRepository.selectCount(new LambdaQueryWrapper<ConversionRule>().eq(ConversionRule::getStatus, 1)));
        statistics.put("pendingReview", conversionRuleRepository.selectCount(new LambdaQueryWrapper<ConversionRule>().eq(ConversionRule::getReviewStatus, 0)));
        statistics.put("approvedReview", conversionRuleRepository.selectCount(new LambdaQueryWrapper<ConversionRule>().eq(ConversionRule::getReviewStatus, 1)));
        statistics.put("rejectedReview", conversionRuleRepository.selectCount(new LambdaQueryWrapper<ConversionRule>().eq(ConversionRule::getReviewStatus, 2)));
        return statistics;
    }
} 