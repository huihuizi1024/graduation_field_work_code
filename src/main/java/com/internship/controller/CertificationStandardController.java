package com.internship.controller;

import com.internship.dto.ApiResponse;
import com.internship.dto.PageResponse;
import com.internship.entity.CertificationStandard;
import com.internship.service.CertificationStandardService;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/certification-standards")
@Tag(name = "认证标准管理")
public class CertificationStandardController {

    @Autowired
    private CertificationStandardService certificationStandardService;

    @GetMapping
    @Operation(summary = "分页查询认证标准")
    public ApiResponse<PageResponse<CertificationStandard>> list(
            @RequestParam(required = false) String standardName,
            @RequestParam(required = false) String standardCode,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) Integer reviewStatus,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.success(certificationStandardService.getCertificationStandards(
                page, size, standardName, null, status, reviewStatus));
    }

    @PostMapping
    @Operation(summary = "创建认证标准")
    public ApiResponse<CertificationStandard> create(@RequestBody CertificationStandard standard) {
        return ApiResponse.success(certificationStandardService.createCertificationStandard(standard));
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新认证标准")
    public ApiResponse<CertificationStandard> update(
            @PathVariable Long id, 
            @RequestBody CertificationStandard standard) {
        standard.setId(id);
        return ApiResponse.success(certificationStandardService.updateCertificationStandard(id, standard));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除认证标准")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        certificationStandardService.deleteCertificationStandard(id);
        return ApiResponse.success();
    }

    @PostMapping("/{id}/review")
    @Operation(summary = "审核认证标准")
    public ApiResponse<Void> review(
            @PathVariable Long id,
            @RequestParam Integer reviewStatus,
            @RequestParam(required = false) String reviewComment) {
        certificationStandardService.reviewCertificationStandard(id, reviewStatus, reviewComment);
        return ApiResponse.success();
    }

    @PostMapping("/{id}/status")
    @Operation(summary = "变更认证标准状态")
    public ApiResponse<Void> changeStatus(
            @PathVariable Long id,
            @RequestParam Integer status) {
        certificationStandardService.changeCertificationStandardStatus(id, status);
        return ApiResponse.success();
    }
}
