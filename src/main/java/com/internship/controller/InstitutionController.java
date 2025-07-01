package com.internship.controller;

import com.internship.dto.ApiResponse;
import com.internship.dto.InstitutionProfileDTO;
import com.internship.dto.PageResponse;
import com.internship.entity.Institution;
import com.internship.service.InstitutionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

/**
 * 机构管理Controller
 * 
 * @author huihuizi1024
 * @date 2025.6.22
 * @version 1.1.0
 */
@Tag(name = "机构管理", description = "教育机构的注册、审核和管理功能")
@RestController
@RequestMapping("/api/institutions")
public class InstitutionController {
    
    private final InstitutionService institutionService;
    
    public InstitutionController(InstitutionService institutionService) {
        this.institutionService = institutionService;
    }

    /**
     * 创建机构
     */
    @Operation(summary = "创建机构", description = "新建教育机构信息")
    @PostMapping
    public ResponseEntity<ApiResponse<Institution>> createInstitution(
            @Valid @RequestBody Institution institution) {
        Institution createdInstitution = institutionService.createInstitution(institution);
        return ResponseEntity.ok(ApiResponse.success("机构创建成功", createdInstitution));
    }

    /**
     * 更新机构信息
     */
    @Operation(summary = "更新机构信息", description = "更新指定ID的机构信息")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Institution>> updateInstitution(
            @Parameter(description = "机构ID") @PathVariable Long id,
            @Valid @RequestBody Institution institution) {
        Institution updatedInstitution = institutionService.updateInstitution(id, institution);
        return ResponseEntity.ok(ApiResponse.success("机构信息更新成功", updatedInstitution));
    }

    /**
     * 删除机构
     */
    @Operation(summary = "删除机构", description = "软删除指定ID的机构")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteInstitution(
            @Parameter(description = "机构ID") @PathVariable Long id) {
        institutionService.deleteInstitution(id);
        return ResponseEntity.ok(ApiResponse.<Void>success("机构删除成功"));
    }

    /**
     * 根据ID获取机构信息
     */
    @Operation(summary = "获取机构详情", description = "根据ID获取机构详细信息")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Institution>> getInstitutionById(
            @Parameter(description = "机构ID") @PathVariable Long id) {
        Institution institution = institutionService.getInstitutionById(id);
        return ResponseEntity.ok(ApiResponse.success(institution));
    }

    /**
     * 分页查询机构
     */
    @Operation(summary = "分页查询机构", description = "支持多条件筛选的分页查询")
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<Institution>>> getInstitutions(
            @Parameter(description = "页码，从0开始") @RequestParam(value = "page", defaultValue = "0") long page,
            @Parameter(description = "每页大小") @RequestParam(value = "size", defaultValue = "10") Integer size,
            @Parameter(description = "机构名称") @RequestParam(required = false) String institutionName,
            @Parameter(description = "机构代码") @RequestParam(required = false) String institutionCode,
            @Parameter(description = "机构类型") @RequestParam(required = false) Integer institutionType,
            @Parameter(description = "机构级别") @RequestParam(required = false) Integer institutionLevel,
            @Parameter(description = "省份") @RequestParam(required = false) String province,
            @Parameter(description = "城市") @RequestParam(required = false) String city,
            @Parameter(description = "状态") @RequestParam(required = false) Integer status,
            @Parameter(description = "审核状态") @RequestParam(required = false) Integer reviewStatus) {
        try {
            System.out.println("获取机构列表参数: " + 
                "page=" + page + ", size=" + size + 
                ", institutionName=" + institutionName + 
                ", institutionCode=" + institutionCode + 
                ", institutionType=" + institutionType + 
                ", institutionLevel=" + institutionLevel + 
                ", province=" + province + 
                ", city=" + city + 
                ", status=" + status + 
                ", reviewStatus=" + reviewStatus);
                
            PageResponse<Institution> pageResponse = institutionService.getInstitutions(
                page, size, institutionName, institutionCode, institutionType, 
                institutionLevel, province, city, status, reviewStatus);
                
            System.out.println("获取机构列表成功，返回数据: " + pageResponse);
            return ResponseEntity.ok(ApiResponse.success(pageResponse));
        } catch (Exception e) {
            System.err.println("获取机构列表异常: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(ApiResponse.error("获取机构列表失败: " + e.getMessage()));
        }
    }

    /**
     * 审核机构
     */
    @Operation(summary = "审核机构", description = "对机构进行审核通过或拒绝")
    @PostMapping("/{id}/review")
    public ResponseEntity<ApiResponse<Void>> reviewInstitution(
            @Parameter(description = "机构ID") @PathVariable Long id,
            @Parameter(description = "审核结果：1-通过，2-拒绝") @RequestParam Integer reviewStatus,
            @Parameter(description = "审核意见") @RequestParam(required = false) String reviewComment) {
        institutionService.reviewInstitution(id, reviewStatus, reviewComment);
        return ResponseEntity.ok(ApiResponse.<Void>success("机构审核完成"));
    }

    /**
     * 修改机构状态
     */
    @Operation(summary = "修改机构状态", description = "修改机构的运营状态")
    @PostMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Void>> changeInstitutionStatus(
            @Parameter(description = "机构ID") @PathVariable Long id,
            @Parameter(description = "状态：1-正常，2-暂停，3-注销") @RequestParam Integer status) {
        institutionService.changeInstitutionStatus(id, status);
        return ResponseEntity.ok(ApiResponse.<Void>success("机构状态修改成功"));
    }

    /**
     * 机构认证等级评定
     */
    @Operation(summary = "机构认证等级评定", description = "对机构进行认证等级评定")
    @PostMapping("/{id}/certification")
    public ResponseEntity<ApiResponse<Void>> certifyInstitution(
            @Parameter(description = "机构ID") @PathVariable Long id,
            @Parameter(description = "认证等级：1-AAA，2-AA，3-A，4-B，5-C") @RequestParam Integer certificationLevel,
            @Parameter(description = "认证有效期（月）") @RequestParam Integer validityMonths) {
        institutionService.certifyInstitution(id, certificationLevel, validityMonths);
        return ResponseEntity.ok(ApiResponse.<Void>success("机构认证等级评定完成"));
    }

    /**
     * 获取机构统计信息
     */
    @Operation(summary = "获取机构统计", description = "获取机构的统计信息")
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getInstitutionStatistics() {
        Map<String, Object> statistics = institutionService.getInstitutionStatistics();
        return ResponseEntity.ok(ApiResponse.success(statistics));
    }

    /**
     * 获取省市区域统计
     */
    @Operation(summary = "获取区域统计", description = "获取机构按省市的分布统计")
    @GetMapping("/region-statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getRegionStatistics() {
        Map<String, Object> statistics = institutionService.getRegionStatistics();
        return ResponseEntity.ok(ApiResponse.success(statistics));
    }

    /**
     * 获取机构类型统计
     */
    @Operation(summary = "获取类型统计", description = "获取机构按类型的分布统计")
    @GetMapping("/type-statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getTypeStatistics() {
        Map<String, Object> statistics = institutionService.getTypeStatistics();
        return ResponseEntity.ok(ApiResponse.success(statistics));
    }

    /**
     * 导出机构信息
     */
    @Operation(summary = "导出机构信息", description = "导出机构数据为Excel文件")
    @GetMapping("/export")
    public ResponseEntity<List<Institution>> exportInstitutions(
            @Parameter(description = "机构类型") @RequestParam(required = false) Integer institutionType,
            @Parameter(description = "省份") @RequestParam(required = false) String province,
            @Parameter(description = "状态") @RequestParam(required = false) Integer status) {
        List<Institution> institutions = institutionService.exportInstitutions(institutionType, province, status);
        return ResponseEntity.ok().body(institutions);
    }
    
    /**
     * 获取当前登录机构的信息
     */
    @Operation(summary = "获取当前机构信息", description = "获取当前登录机构的详细信息")
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<InstitutionProfileDTO>> getCurrentInstitution() {
        // 从安全上下文中获取当前登录用户名
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(ApiResponse.error("用户未登录"));
        }
        
        String username = authentication.getName();
        
        // 获取综合机构信息
        InstitutionProfileDTO institutionProfile = institutionService.getCurrentInstitutionProfile(username);
        
        return ResponseEntity.ok(ApiResponse.success("获取当前机构信息成功", institutionProfile));
    }
}
