package com.internship.controller;

import com.internship.dto.ApiResponse;
import com.internship.dto.PageResponse;
import com.internship.entity.ConversionRule;
import com.internship.service.ConversionRuleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

/**
 * 转换规则管理Controller
 * 
 * @author huihuizi1024
 * @date 2025.6.22
 * @version 1.1.0
 */
@Tag(name = "转换规则管理", description = "学分转换规则的管理和审核功能")
@RestController
@RequestMapping("/api/conversion-rules")
public class ConversionRuleController {

    @Autowired
    private ConversionRuleService conversionRuleService;

    /**
     * 创建转换规则
     */
    @Operation(summary = "创建转换规则", description = "新建学分转换规则")
    @PostMapping
    public ResponseEntity<ApiResponse<ConversionRule>> createConversionRule(
            @Valid @RequestBody ConversionRule conversionRule) {
        ConversionRule createdRule = conversionRuleService.createConversionRule(conversionRule);
        return ResponseEntity.ok(ApiResponse.success("转换规则创建成功", createdRule));
    }

    /**
     * 更新转换规则
     */
    @Operation(summary = "更新转换规则", description = "更新指定ID的转换规则")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ConversionRule>> updateConversionRule(
            @Parameter(description = "转换规则ID") @PathVariable Long id,
            @Valid @RequestBody ConversionRule conversionRule) {
        ConversionRule updatedRule = conversionRuleService.updateConversionRule(id, conversionRule);
        return ResponseEntity.ok(ApiResponse.success("转换规则更新成功", updatedRule));
    }

    /**
     * 删除转换规则
     */
    @Operation(summary = "删除转换规则", description = "软删除指定ID的转换规则")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteConversionRule(
            @Parameter(description = "转换规则ID") @PathVariable Long id) {
        conversionRuleService.deleteConversionRule(id);
        return ResponseEntity.ok(ApiResponse.<Void>success("转换规则删除成功"));
    }

    /**
     * 根据ID获取转换规则
     */
    @Operation(summary = "获取转换规则详情", description = "根据ID获取转换规则详细信息")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ConversionRule>> getConversionRuleById(
            @Parameter(description = "转换规则ID") @PathVariable Long id) {
        ConversionRule conversionRule = conversionRuleService.getConversionRuleById(id);
        return ResponseEntity.ok(ApiResponse.success(conversionRule));
    }

    /**
     * 分页查询转换规则
     */
    @Operation(summary = "分页查询转换规则", description = "支持多条件筛选的分页查询")
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ConversionRule>>> getConversionRules(
            @Parameter(description = "页码，从0开始") @RequestParam(value = "page", defaultValue = "0") Integer page,
            @Parameter(description = "每页大小") @RequestParam(value = "size", defaultValue = "10") Integer size,
            @Parameter(description = "规则名称") @RequestParam(required = false) String ruleName,
            @Parameter(description = "源类型") @RequestParam(required = false) Integer sourceType,
            @Parameter(description = "目标类型") @RequestParam(required = false) Integer targetType,
            @Parameter(description = "状态") @RequestParam(required = false) Integer status,
            @Parameter(description = "审核状态") @RequestParam(required = false) Integer reviewStatus) {
        PageResponse<ConversionRule> pageResponse = conversionRuleService.getConversionRules(page, size, ruleName, sourceType, targetType, status, reviewStatus);
        return ResponseEntity.ok(ApiResponse.success(pageResponse));
    }

    /**
     * 审核转换规则
     */
    @Operation(summary = "审核转换规则", description = "对转换规则进行审核通过或拒绝")
    @PostMapping("/{id}/review")
    public ResponseEntity<ApiResponse<Void>> reviewConversionRule(
            @Parameter(description = "转换规则ID") @PathVariable Long id,
            @Parameter(description = "审核结果：1-通过，2-拒绝") @RequestParam Integer reviewStatus,
            @Parameter(description = "审核意见") @RequestParam(required = false) String reviewComment) {
        conversionRuleService.reviewConversionRule(id, reviewStatus, reviewComment);
        return ResponseEntity.ok(ApiResponse.<Void>success("转换规则审核完成"));
    }

    /**
     * 启用/禁用转换规则
     */
    @Operation(summary = "启用/禁用转换规则", description = "修改转换规则的启用状态")
    @PostMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Void>> changeConversionRuleStatus(
            @Parameter(description = "转换规则ID") @PathVariable Long id,
            @Parameter(description = "状态：1-启用，0-禁用") @RequestParam Integer status) {
        conversionRuleService.changeConversionRuleStatus(id, status);
        return ResponseEntity.ok(ApiResponse.<Void>success("转换规则状态修改成功"));
    }

    /**
     * 获取转换比例推荐
     */
    @Operation(summary = "获取转换比例推荐", description = "根据历史数据推荐转换比例")
    @GetMapping("/ratio-recommendations")
    public ResponseEntity<ApiResponse<Object>> getConversionRatioRecommendations(
            @Parameter(description = "源类型") @RequestParam Integer sourceType,
            @Parameter(description = "目标类型") @RequestParam Integer targetType) {
        // TODO: 实现获取转换比例推荐逻辑 - 此处未在 Service 中定义，暂时不处理
        return ResponseEntity.ok(ApiResponse.success("推荐比例获取成功", null));
    }

    /**
     * 测试转换规则
     */
    @Operation(summary = "测试转换规则", description = "测试转换规则的有效性")
    @PostMapping("/{id}/test")
    public ResponseEntity<ApiResponse<Object>> testConversionRule(
            @Parameter(description = "转换规则ID") @PathVariable Long id,
            @Parameter(description = "测试数量") @RequestParam Double testAmount) {
        // TODO: 实现测试转换规则逻辑 - 此处未在 Service 中定义，暂时不处理
        return ResponseEntity.ok(ApiResponse.success("转换规则测试完成", null));
    }

    /**
     * 获取转换规则统计信息
     */
    @Operation(summary = "获取转换规则统计", description = "获取转换规则的统计信息")
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getConversionRuleStatistics() {
        Map<String, Object> statistics = conversionRuleService.getConversionRuleStatistics();
        return ResponseEntity.ok(ApiResponse.success("统计信息获取成功", statistics));
    }
} 