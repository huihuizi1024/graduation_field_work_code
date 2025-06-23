package com.internship.controller;

import com.internship.dto.ApiResponse;
import com.internship.dto.PageResponse;
import com.internship.entity.PointRule;
import com.internship.service.PointRuleService;
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
 * 积分规则管理Controller
 * 
 * @author huihuizi1024
 * @date 2025.6.22
 * @version 1.1.0
 */
@Tag(name = "积分规则管理", description = "积分规则的增删改查和审核功能")
@RestController
@RequestMapping("/api/point-rules")
public class PointRuleController {

    @Autowired
    private PointRuleService pointRuleService;

    /**
     * 健康检查接口
     */
    @Operation(summary = "健康检查", description = "检查积分规则API服务状态")
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> healthCheck() {
        return ResponseEntity.ok(ApiResponse.success("Point Rules API is healthy!"));
    }

    /**
     * 创建积分规则
     */
    @Operation(summary = "创建积分规则", description = "新建积分规则，需要管理员权限")
    @PostMapping
    public ResponseEntity<ApiResponse<PointRule>> createPointRule(
            @Valid @RequestBody PointRule pointRule) {
        PointRule createdRule = pointRuleService.createPointRule(pointRule);
        return ResponseEntity.ok(ApiResponse.success("积分规则创建成功", createdRule));
    }

    /**
     * 更新积分规则
     */
    @Operation(summary = "更新积分规则", description = "更新指定ID的积分规则")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PointRule>> updatePointRule(
            @Parameter(description = "积分规则ID") @PathVariable Long id,
            @Valid @RequestBody PointRule pointRule) {
        PointRule updatedRule = pointRuleService.updatePointRule(id, pointRule);
        return ResponseEntity.ok(ApiResponse.success("积分规则更新成功", updatedRule));
    }

    /**
     * 删除积分规则
     */
    @Operation(summary = "删除积分规则", description = "软删除指定ID的积分规则")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePointRule(
            @Parameter(description = "积分规则ID") @PathVariable Long id) {
        pointRuleService.deletePointRule(id);
        return ResponseEntity.ok(ApiResponse.<Void>success("积分规则删除成功"));
    }

    /**
     * 根据ID获取积分规则
     */
    @Operation(summary = "获取积分规则详情", description = "根据ID获取积分规则详细信息")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PointRule>> getPointRuleById(
            @Parameter(description = "积分规则ID") @PathVariable Long id) {
        PointRule pointRule = pointRuleService.getPointRuleById(id);
        return ResponseEntity.ok(ApiResponse.success("获取积分规则成功", pointRule));
    }

    /**
     * 分页查询积分规则
     */
    @Operation(summary = "分页查询积分规则", description = "支持多条件筛选的分页查询")
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<PointRule>>> getPointRules(
            @Parameter(description = "页码，从0开始") @RequestParam(value = "page", defaultValue = "0") Integer page,
            @Parameter(description = "每页大小") @RequestParam(value = "size", defaultValue = "10") Integer size,
            @Parameter(description = "规则名称") @RequestParam(value = "ruleName", required = false) String ruleName,
            @Parameter(description = "规则编码") @RequestParam(value = "ruleCode", required = false) String ruleCode,
            @Parameter(description = "积分类型") @RequestParam(value = "pointType", required = false) Integer pointType,
            @Parameter(description = "适用对象") @RequestParam(value = "applicableObject", required = false) Integer applicableObject,
            @Parameter(description = "状态") @RequestParam(value = "status", required = false) Integer status,
            @Parameter(description = "审核状态") @RequestParam(value = "reviewStatus", required = false) Integer reviewStatus) {
        PageResponse<PointRule> pageResponse = pointRuleService.getPointRules(
                page, size, ruleName, ruleCode, pointType, applicableObject, status, reviewStatus);
        return ResponseEntity.ok(ApiResponse.success("查询积分规则成功", pageResponse));
    }

    /**
     * 审核积分规则
     */
    @Operation(summary = "审核积分规则", description = "对积分规则进行审核通过或拒绝")
    @PostMapping("/{id}/review")
    public ResponseEntity<ApiResponse<Void>> reviewPointRule(
            @Parameter(description = "积分规则ID") @PathVariable Long id,
            @Parameter(description = "审核结果：1-通过，2-拒绝") @RequestParam(value = "reviewStatus") Integer reviewStatus,
            @Parameter(description = "审核意见") @RequestParam(value = "reviewComment", required = false) String reviewComment) {
        pointRuleService.reviewPointRule(id, reviewStatus, reviewComment);
        return ResponseEntity.ok(ApiResponse.<Void>success("积分规则审核完成"));
    }

    /**
     * 启用/禁用积分规则
     */
    @Operation(summary = "启用/禁用积分规则", description = "修改积分规则的启用状态")
    @PostMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Void>> changePointRuleStatus(
            @Parameter(description = "积分规则ID") @PathVariable Long id,
            @Parameter(description = "状态：1-启用，0-禁用") @RequestParam(value = "status") Integer status) {
        pointRuleService.changePointRuleStatus(id, status);
        return ResponseEntity.ok(ApiResponse.<Void>success("积分规则状态修改成功"));
    }

    /**
     * 批量删除积分规则
     */
    @Operation(summary = "批量删除积分规则", description = "批量软删除积分规则")
    @DeleteMapping("/batch")
    public ResponseEntity<ApiResponse<Void>> batchDeletePointRules(
            @Parameter(description = "积分规则ID列表") @RequestBody List<Long> ids) {
        pointRuleService.batchDeletePointRules(ids);
        return ResponseEntity.ok(ApiResponse.<Void>success("积分规则批量删除成功"));
    }

    /**
     * 获取积分规则统计信息
     */
    @Operation(summary = "获取积分规则统计", description = "获取积分规则的统计信息")
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPointRuleStatistics() {
        Map<String, Object> statistics = pointRuleService.getPointRuleStatistics();
        return ResponseEntity.ok(ApiResponse.success("统计信息获取成功", statistics));
    }

    /**
     * 导出积分规则
     */
    @Operation(summary = "导出积分规则", description = "导出积分规则数据为Excel文件")
    @GetMapping("/export")
    public ResponseEntity<ApiResponse<List<PointRule>>> exportPointRules(
            @Parameter(description = "规则名称") @RequestParam(value = "ruleName", required = false) String ruleName,
            @Parameter(description = "积分类型") @RequestParam(value = "pointType", required = false) Integer pointType,
            @Parameter(description = "状态") @RequestParam(value = "status", required = false) Integer status) {
        List<PointRule> rules = pointRuleService.exportPointRules(ruleName, pointType, status);
        return ResponseEntity.ok(ApiResponse.success("积分规则导出成功", rules));
    }
} 