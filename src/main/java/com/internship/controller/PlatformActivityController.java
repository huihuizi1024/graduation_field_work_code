package com.internship.controller;

import com.internship.dto.ApiResponse;
import com.internship.dto.PageResponse;
import com.internship.entity.PlatformActivity;
import com.internship.service.PlatformActivityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

/**
 * 平台活动管理Controller
 * 
 * @author huihuizi1024
 * @date 2025.6.28
 * @version 1.0.0
 */
@Tag(name = "平台活动管理", description = "平台发布的各类学习活动和事件的配置和管理功能")
@RestController
@RequestMapping("/api/platform-activities")
@Slf4j
public class PlatformActivityController {

    @Autowired
    private PlatformActivityService platformActivityService;

    /**
     * 创建平台活动
     */
    @Operation(summary = "创建平台活动", description = "新建平台活动信息")
    @PostMapping
    public ResponseEntity<ApiResponse<PlatformActivity>> createPlatformActivity(
            @Valid @RequestBody PlatformActivity platformActivity) {
        PlatformActivity createdActivity = platformActivityService.createPlatformActivity(platformActivity);
        log.info("平台活动API响应: {code: 200, message: '操作成功', data: {}, timestamp: {}}", 
            createdActivity, System.currentTimeMillis());
        return ResponseEntity.ok(ApiResponse.success("平台活动创建成功", createdActivity));
    }

    /**
     * 更新平台活动
     */
    @Operation(summary = "更新平台活动", description = "更新指定ID的平台活动信息")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PlatformActivity>> updatePlatformActivity(
            @Parameter(description = "平台活动ID") @PathVariable Long id,
            @Valid @RequestBody PlatformActivity platformActivity) {
        PlatformActivity updatedActivity = platformActivityService.updatePlatformActivity(id, platformActivity);
        log.info("平台活动API响应: {code: 200, message: '操作成功', data: {}, timestamp: {}}", 
            updatedActivity, System.currentTimeMillis());
        return ResponseEntity.ok(ApiResponse.success("平台活动更新成功", updatedActivity));
    }

    /**
     * 删除平台活动
     */
    @Operation(summary = "删除平台活动", description = "软删除指定ID的平台活动")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePlatformActivity(
            @Parameter(description = "平台活动ID") @PathVariable Long id) {
        platformActivityService.deletePlatformActivity(id);
        return ResponseEntity.ok(ApiResponse.<Void>success("平台活动删除成功"));
    }

    /**
     * 根据ID获取平台活动
     */
    @Operation(summary = "获取平台活动详情", description = "根据ID获取平台活动详细信息")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PlatformActivity>> getPlatformActivityById(
            @Parameter(description = "平台活动ID") @PathVariable Long id) {
        PlatformActivity platformActivity = platformActivityService.getPlatformActivityById(id);
        return ResponseEntity.ok(ApiResponse.success(platformActivity));
    }

    /**
     * 分页查询平台活动
     */
    @Operation(summary = "分页查询平台活动", description = "支持多条件筛选的分页查询")
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<PlatformActivity>>> getPlatformActivities(
            @Parameter(description = "页码，从0开始") @RequestParam(value = "page", defaultValue = "0") Integer page,
            @Parameter(description = "每页大小") @RequestParam(value = "size", defaultValue = "10") Integer size,
            @Parameter(description = "活动名称") @RequestParam(required = false) String activityName,
            @Parameter(description = "活动类型") @RequestParam(required = false) Integer activityType,
            @Parameter(description = "状态") @RequestParam(required = false) Integer status) {
        PageResponse<PlatformActivity> pageResponse = platformActivityService.getPlatformActivities(page, size, activityName, activityType, status);
        return ResponseEntity.ok(ApiResponse.success(pageResponse));
    }

    /**
     * 更改平台活动状态
     */
    @Operation(summary = "更改平台活动状态", description = "修改平台活动的进行状态（进行中、已结束、已取消）")
    @PostMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Void>> changePlatformActivityStatus(
            @Parameter(description = "平台活动ID") @PathVariable Long id,
            @Parameter(description = "状态：1-进行中，0-已结束，2-已取消") @RequestParam Integer status) {
        platformActivityService.changePlatformActivityStatus(id, status);
        return ResponseEntity.ok(ApiResponse.<Void>success("平台活动状态修改成功"));
    }

    /**
     * 获取平台活动统计信息
     */
    @Operation(summary = "获取平台活动统计", description = "获取平台活动的统计信息")
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPlatformActivityStatistics() {
        Map<String, Object> statistics = platformActivityService.getPlatformActivityStatistics();
        return ResponseEntity.ok(ApiResponse.success(statistics));
    }

    /**
     * 导出平台活动信息
     */
    @Operation(summary = "导出平台活动信息", description = "导出平台活动数据为Excel文件")
    @GetMapping("/export")
    public ResponseEntity<List<PlatformActivity>> exportPlatformActivities(
            @Parameter(description = "活动类型") @RequestParam(required = false) Integer activityType,
            @Parameter(description = "状态") @RequestParam(required = false) Integer status) {
        List<PlatformActivity> activities = platformActivityService.exportPlatformActivities(activityType, status);
        return ResponseEntity.ok().body(activities);
    }
}
