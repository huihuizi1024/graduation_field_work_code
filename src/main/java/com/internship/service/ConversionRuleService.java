package com.internship.service;

import com.internship.dto.PageResponse;
import com.internship.entity.ConversionRule;

import java.util.Map;

public interface ConversionRuleService {

    ConversionRule createConversionRule(ConversionRule conversionRule);

    ConversionRule updateConversionRule(Long id, ConversionRule conversionRule);

    void deleteConversionRule(Long id);

    ConversionRule getConversionRuleById(Long id);

    PageResponse<ConversionRule> getConversionRules(Integer page, Integer size, String ruleName, Integer sourceType, Integer targetType, Integer status, Integer reviewStatus);

    void reviewConversionRule(Long id, Integer reviewStatus, String reviewComment);

    void changeConversionRuleStatus(Long id, Integer status);

    Map<String, Object> getConversionRuleStatistics();
} 