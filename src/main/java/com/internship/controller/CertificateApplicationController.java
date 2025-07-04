package com.internship.controller;

import com.internship.dto.ApiResponse;
import com.internship.entity.User;
import com.internship.repository.UserRepository;
import com.internship.service.CertificateApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.internship.exception.BusinessException;
import com.internship.dto.CertificateApplicationRequest;
import com.internship.dto.CertificateApplicationDTO;
import com.internship.dto.UserCertificateDTO;
import com.internship.entity.CertificateApplication;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/certification-applications")
@Tag(name = "证书申请管理")
public class CertificateApplicationController {

    @Autowired
    private CertificateApplicationService applicationService;

    @Autowired
    private UserRepository userRepository;

    /**
     * 提交证书申请
     */
    @PostMapping(consumes = "application/json")
    @Operation(summary = "提交证书申请")
    public ApiResponse<CertificateApplication> apply(@RequestBody CertificateApplicationRequest request,
                                                     Principal principal) {
        Long userId = getCurrentUserId(principal);
        return ApiResponse.success(applicationService.apply(userId, request.getStandardId(), request.getEvidenceUrl(), request.getDescription()));
    }

    /**
     * 当前用户的申请列表
     */
    @GetMapping("/my")
    @Operation(summary = "我的证书申请")
    public ApiResponse<List<CertificateApplicationDTO>> myApplications(Principal principal) {
        Long userId = getCurrentUserId(principal);
        return ApiResponse.success(applicationService.getMyApplications(userId));
    }

    /**
     * 后台/专家查看申请列表（可传 status 过滤）
     */
    @GetMapping
    @Operation(summary = "申请列表")
    public ApiResponse<List<CertificateApplicationDTO>> list(@RequestParam(required = false) Integer status) {
        return ApiResponse.success(applicationService.listAll(status));
    }

    /**
     * 审核申请
     */
    @PostMapping("/{id}/review")
    @Operation(summary = "审核申请")
    public ApiResponse<Void> review(@PathVariable Long id,
                                    @RequestParam Integer reviewStatus,
                                    @RequestParam(required = false) String reviewComment,
                                    Principal principal) {
        Long reviewerId = getCurrentUserId(principal);
        applicationService.review(id, reviewerId, reviewStatus, reviewComment);
        return ApiResponse.success();
    }

    /**
     * 我的已获证书
     */
    @GetMapping("/my-certificates")
    @Operation(summary = "我的证书")
    public ApiResponse<List<UserCertificateDTO>> myCertificates(Principal principal) {
        Long userId = getCurrentUserId(principal);
        return ApiResponse.success(applicationService.getUserCertificates(userId));
    }

    /**
     * 专家审核记录
     */
    @GetMapping("/my-reviewed")
    @Operation(summary = "我的审核记录")
    public ApiResponse<List<CertificateApplicationDTO>> myReviewed(Principal principal) {
        Long reviewerId = getCurrentUserId(principal);
        return ApiResponse.success(applicationService.getReviewedApplications(reviewerId));
    }

    /** 取消申请 */
    @DeleteMapping("/{id}")
    @Operation(summary = "取消未审核的申请")
    public ApiResponse<Void> cancel(@PathVariable Long id, Principal principal) {
        Long userId = getCurrentUserId(principal);
        applicationService.cancelApplication(id, userId);
        return ApiResponse.success();
    }

    /** 根据ID获取申请详情 */
    @GetMapping("/{id}")
    @Operation(summary = "申请详情")
    public ApiResponse<CertificateApplicationDTO> getById(@PathVariable Long id) {
        return ApiResponse.success(applicationService.getApplicationById(id));
    }

    private Long getCurrentUserId(Principal principal) {
        // 先尝试从 Principal 中解析用户 ID（兼容旧逻辑）
        if (principal != null) {
            try {
                return Long.valueOf(principal.getName());
            } catch (Exception ignored) {
                // 忽略解析失败，继续使用用户名查找
            }
        }

        // 使用 Spring Security 上下文中的用户名查询用户 ID
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            String username = authentication.getName();
            return userRepository.findByUsername(username)
                    .map(User::getId)
                    .orElseThrow(() -> new BusinessException("请先登录"));
        }

        throw new BusinessException("请先登录");
    }
} 