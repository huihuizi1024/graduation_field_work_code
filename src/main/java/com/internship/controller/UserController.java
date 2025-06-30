package com.internship.controller;

import com.internship.dto.ApiResponse;
import com.internship.dto.PageResponse;
import com.internship.dto.UserUpdateDTO;
import com.internship.entity.User;
import com.internship.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@Tag(name = "用户管理", description = "系统用户管理功能")
@RestController
@RequestMapping("/api/users")
@Slf4j
public class UserController {

    @Autowired
    private UserService userService;

    @Operation(summary = "获取当前用户信息")
    @GetMapping("/me")
    public ApiResponse<User> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        log.info("获取当前用户信息请求, 用户名: {}", username);
        return userService.getCurrentUser(username);
    }

    @Operation(summary = "创建用户")
    @PostMapping
    public ApiResponse<User> createUser(@RequestBody User user) {
        log.info("创建用户请求: {}", user);
        return userService.createUser(user);
    }

    @Operation(summary = "更新用户")
    @PutMapping("/{id}")
    public ApiResponse<User> updateUser(
            @Parameter(description = "用户ID") @PathVariable Long id,
            @RequestBody User user) {
        log.info("更新用户请求, ID: {}, 数据: {}", id, user);
        return userService.updateUser(id, user);
    }

    @Operation(summary = "删除用户")
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteUser(
            @Parameter(description = "用户ID") @PathVariable Long id) {
        log.info("删除用户请求, ID: {}", id);
        return userService.deleteUser(id);
    }

    @Operation(summary = "获取用户详情")
    @GetMapping("/{id}")
    public ApiResponse<User> getUserById(
            @Parameter(description = "用户ID") @PathVariable Long id) {
        log.info("获取用户详情请求, ID: {}", id);
        return userService.getUserById(id);
    }

    @Operation(summary = "分页查询用户列表")
    @GetMapping
    public ApiResponse<PageResponse<User>> getUsers(
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") Integer page,
            @Parameter(description = "每页数量") @RequestParam(defaultValue = "10") Integer size,
            @Parameter(description = "用户名") @RequestParam(required = false) String username,
            @Parameter(description = "角色") @RequestParam(required = false) Integer role,
            @Parameter(description = "状态") @RequestParam(required = false) Integer status) {
        log.info("查询用户列表请求, page: {}, size: {}, username: {}, role: {}, status: {}",
                page, size, username, role, status);
        return userService.getUsers(page, size, username, role, status);
    }

    @Operation(summary = "修改用户状态")
    @PostMapping("/{id}/status")
    public ApiResponse<Void> changeUserStatus(
            @Parameter(description = "用户ID") @PathVariable Long id,
            @Parameter(description = "状态: 0-禁用, 1-启用") @RequestParam Integer status) {
        log.info("修改用户状态请求, ID: {}, 状态: {}", id, status);
        return userService.changeUserStatus(id, status);
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<Void>> updateCurrentUser(@Valid @RequestBody UserUpdateDTO userUpdateDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        boolean success = userService.updateCurrentUser(username, userUpdateDTO);

        if (success) {
            return ResponseEntity.ok(ApiResponse.success("用户信息更新成功"));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.error("用户信息更新失败"));
        }
    }
}
