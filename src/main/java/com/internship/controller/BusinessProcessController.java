package com.internship.controller;

import com.internship.dto.ApiResponse;
import com.internship.dto.PageResponse;
import com.internship.entity.BusinessProcess;
import com.internship.service.BusinessProcessService;
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
 * 业务流程管理Controller
 * 
 * @author huihuizi1024
 * @date 2025.6.27
 * @version 1.0.0
 */
@Tag(name = "业务流程管理", description = "学分银行平台各类业务流程的配置和管理功能")
@RestController
@RequestMapping("/api/business-processes")
public class BusinessProcessController {

    @Autowired
    private BusinessProcessService businessProcessService;

    /**
     * 创建业务流程
     */
    @Operation(summary = "创建业务流程", description = "新建业务流程信息")
    @PostMapping
    public ResponseEntity<ApiResponse<BusinessProcess>> createBusinessProcess(
            @Valid @RequestBody BusinessProcess businessProcess) {
        BusinessProcess createdProcess = businessProcessService.createBusinessProcess(businessProcess);
        return ResponseEntity.ok(ApiResponse.success("业务流程创建成功", createdProcess));
    }

    /**
     * 更新业务流程
     */
    @Operation(summary = "更新业务流程", description = "更新指定ID的业务流程信息")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BusinessProcess>> updateBusinessProcess(
            @Parameter(description = "业务流程ID") @PathVariable Long id,
            @Valid @RequestBody BusinessProcess businessProcess) {
        BusinessProcess updatedProcess = businessProcessService.updateBusinessProcess(id, businessProcess);
        return ResponseEntity.ok(ApiResponse.success("业务流程更新成功", updatedProcess));
    }

    /**
     * 删除业务流程
     */
    @Operation(summary = "删除业务流程", description = "软删除指定ID的业务流程")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBusinessProcess(
            @Parameter(description = "业务流程ID") @PathVariable Long id) {
        businessProcessService.deleteBusinessProcess(id);
        return ResponseEntity.ok(ApiResponse.<Void>success("业务流程删除成功"));
    }

    /**
     * 根据ID获取业务流程
     */
    @Operation(summary = "获取业务流程详情", description = "根据ID获取业务流程详细信息")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BusinessProcess>> getBusinessProcessById(
            @Parameter(description = "业务流程ID") @PathVariable Long id) {
        BusinessProcess businessProcess = businessProcessService.getBusinessProcessById(id);
        return ResponseEntity.ok(ApiResponse.success(businessProcess));
    }

    /**
     * 分页查询业务流程
     */
    @Operation(summary = "分页查询业务流程", description = "支持多条件筛选的分页查询")
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<BusinessProcess>>> getBusinessProcesses(
            @Parameter(description = "页码，从0开始") @RequestParam(value = "page", defaultValue = "0") Integer page,
            @Parameter(description = "每页大小") @RequestParam(value = "size", defaultValue = "10") Integer size,
            @Parameter(description = "流程名称") @RequestParam(required = false) String processName,
            @Parameter(description = "流程类别") @RequestParam(required = false) Integer category,
            @Parameter(description = "状态") @RequestParam(required = false) Integer status) {
        PageResponse<BusinessProcess> pageResponse = businessProcessService.getBusinessProcesses(page, size, processName, category, status);
        return ResponseEntity.ok(ApiResponse.success(pageResponse));
    }

    /**
     * 启用/禁用业务流程
     */
    @Operation(summary = "启用/禁用业务流程", description = "修改业务流程的启用状态")
    @PostMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Void>> changeBusinessProcessStatus(
            @Parameter(description = "业务流程ID") @PathVariable Long id,
            @Parameter(description = "状态：1-启用，0-禁用") @RequestParam Integer status) {
        businessProcessService.changeBusinessProcessStatus(id, status);
        return ResponseEntity.ok(ApiResponse.<Void>success("业务流程状态修改成功"));
    }

    /**
     * 获取业务流程统计信息
     */
    @Operation(summary = "获取业务流程统计", description = "获取业务流程的统计信息")
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getBusinessProcessStatistics() {
        Map<String, Object> statistics = businessProcessService.getBusinessProcessStatistics();
        return ResponseEntity.ok(ApiResponse.success(statistics));
    }

    /**
     * 导出业务流程信息
     */
    @Operation(summary = "导出业务流程信息", description = "导出业务流程数据为Excel文件")
    @GetMapping("/export")
    public ResponseEntity<List<BusinessProcess>> exportBusinessProcesses(
            @Parameter(description = "流程类别") @RequestParam(required = false) Integer category,
            @Parameter(description = "状态") @RequestParam(required = false) Integer status) {
        List<BusinessProcess> processes = businessProcessService.exportBusinessProcesses(category, status);
        return ResponseEntity.ok().body(processes);
    }
} 