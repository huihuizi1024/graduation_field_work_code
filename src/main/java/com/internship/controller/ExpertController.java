package com.internship.controller;

import com.internship.dto.ApiResponse;
import com.internship.dto.PageResponse;
import com.internship.entity.Expert;
import com.internship.service.ExpertService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

/**
 * 专家管理Controller
 */
@Tag(name = "专家管理", description = "专家的增删改查功能")
@RestController
@RequestMapping("/api/auth/experts")
public class ExpertController {

    @Autowired
    private ExpertService expertService;

    @Operation(summary = "创建专家", description = "新建专家")
    @PostMapping
    public ResponseEntity<ApiResponse<Expert>> createExpert(
            @Valid @RequestBody Expert expert) {
        boolean saved = expertService.save(expert);
        if (!saved) {
            return ResponseEntity.badRequest().body(ApiResponse.error("专家创建失败"));
        }
        Expert createdExpert = expertService.getById(expert.getId());
        return ResponseEntity.ok(ApiResponse.success("专家创建成功", createdExpert));
    }

    @Operation(summary = "更新专家", description = "更新指定ID的专家")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Expert>> updateExpert(
            @Parameter(description = "专家ID") @PathVariable String id,
            @Valid @RequestBody Expert expert) {
        expert.setId(id);
        boolean updated = expertService.updateById(expert);
        if (!updated) {
            return ResponseEntity.badRequest().body(ApiResponse.error("专家更新失败"));
        }
        Expert updatedExpert = expertService.getById(id);
        return ResponseEntity.ok(ApiResponse.success("专家更新成功", updatedExpert));
    }

    @Operation(summary = "删除专家", description = "删除指定ID的专家")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExpert(
            @Parameter(description = "专家ID") @PathVariable String id) {
        expertService.removeById(id);
        return ResponseEntity.ok(ApiResponse.<Void>success("专家删除成功"));
    }

    @Operation(summary = "获取专家详情", description = "根据ID获取专家详细信息")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Expert>> getExpertById(
            @Parameter(description = "专家ID") @PathVariable String id) {
        Expert expert = expertService.getById(id);
        return ResponseEntity.ok(ApiResponse.success("获取专家成功", expert));
    }

    @Operation(summary = "分页查询专家", description = "支持多条件筛选的分页查询")
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<Expert>>> getExperts(
            @Parameter(description = "页码，从0开始") @RequestParam(value = "page", defaultValue = "0") Integer page,
            @Parameter(description = "每页大小") @RequestParam(value = "size", defaultValue = "10") Integer size,
            @Parameter(description = "专家姓名") @RequestParam(value = "name", required = false) String name,
            @Parameter(description = "专业领域") @RequestParam(value = "expertise", required = false) String expertise,
            @Parameter(description = "状态") @RequestParam(value = "status", required = false) Integer status) {
        // 实现分页查询逻辑
        PageResponse<Expert> pageResponse = expertService.getExperts(page, size, name, expertise, status);
        return ResponseEntity.ok(ApiResponse.success("查询专家成功", pageResponse));
    }
}
