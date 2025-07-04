package com.internship.controller;

import com.internship.dto.ApiResponse;
import com.internship.dto.PageResponse;
import com.internship.entity.CertificationStandard;
import com.internship.exception.BusinessException;
import com.internship.service.CertificationStandardService;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/certification-standards")
@Tag(name = "认证标准管理", description = "认证标准管理相关接口")
public class CertificationStandardController {

    @Autowired
    private CertificationStandardService standardService;

    @GetMapping
    @Operation(summary = "分页查询认证标准")
    public ApiResponse<PageResponse<CertificationStandard>> list(
            @RequestParam(required = false) String standardName,
            @RequestParam(required = false) String standardCode,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) Integer reviewStatus,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.success(standardService.getCertificationStandards(
                page, size, standardName, null, status, reviewStatus));
    }

    @PostMapping
    @Operation(summary = "添加认证标准")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ApiResponse<CertificationStandard> addStandard(@Valid @RequestBody CertificationStandard standard) {
        standard.setCreatorName("系统管理员"); // 实际项目中，从SecurityContext中获取
        standard.setCreateTime(LocalDateTime.now());
        standard.setReviewStatus(0);  // 0-待审核
        
        // 确保积分值非负数
        if (standard.getPointValue() != null && standard.getPointValue() < 0) {
            throw new BusinessException("积分奖励不能为负数");
        }
        
        CertificationStandard saved = standardService.createCertificationStandard(standard);
        return ApiResponse.success(saved);
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新认证标准")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ApiResponse<CertificationStandard> updateStandard(@PathVariable Long id, @Valid @RequestBody CertificationStandard standard) {
        CertificationStandard existing = standardService.getCertificationStandardById(id);
        if (existing == null) {
            return ApiResponse.error("认证标准不存在");
        }
        standard.setId(id);
        standard.setUpdateTime(LocalDateTime.now());
        
        // 确保积分值非负数
        if (standard.getPointValue() != null && standard.getPointValue() < 0) {
            throw new BusinessException("积分奖励不能为负数");
        }
        
        CertificationStandard updated = standardService.updateCertificationStandard(id, standard);
        return ApiResponse.success(updated);
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取认证标准详情")
    public ApiResponse<CertificationStandard> getStandard(@PathVariable Long id) {
        CertificationStandard standard = standardService.getCertificationStandardById(id);
        if (standard == null) {
            return ApiResponse.error("认证标准不存在");
        }
        return ApiResponse.success(standard);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除认证标准")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ApiResponse<Void> deleteStandard(@PathVariable Long id) {
        CertificationStandard standard = standardService.getCertificationStandardById(id);
        if (standard == null) {
            return ApiResponse.error("认证标准不存在");
        }
        standardService.deleteCertificationStandard(id);
        return ApiResponse.success();
    }

    @PutMapping("/{id}/review")
    @Operation(summary = "审核认证标准")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ApiResponse<CertificationStandard> reviewStandard(
            @PathVariable Long id,
            @RequestParam Integer reviewStatus,
            @RequestParam(required = false) String reviewComment) {
        if (reviewStatus != 1 && reviewStatus != 2) {
            return ApiResponse.error("无效的审核状态");
        }
        CertificationStandard standard = standardService.getCertificationStandardById(id);
        if (standard == null) {
            return ApiResponse.error("认证标准不存在");
        }
        standard.setReviewStatus(reviewStatus);
        standard.setReviewComment(reviewComment);
        standard.setReviewerId(1L); // 实际项目中，从SecurityContext中获取
        standard.setReviewerName("管理员");
        standard.setReviewTime(LocalDateTime.now());
        CertificationStandard updated = standardService.updateCertificationStandard(id, standard);
        return ApiResponse.success(updated);
    }

    @PostMapping("/{id}/status")
    @Operation(summary = "变更认证标准状态")
    public ApiResponse<Void> changeStatus(
            @PathVariable Long id,
            @RequestParam Integer status) {
        standardService.changeCertificationStandardStatus(id, status);
        return ApiResponse.success();
    }
}
