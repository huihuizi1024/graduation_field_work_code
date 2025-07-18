package com.internship.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.internship.dto.ApiResponse;
import com.internship.dto.PageResponse;
import com.internship.dto.UserUpdateDTO;
import com.internship.entity.User;
import com.internship.exception.BusinessException;
import com.internship.repository.UserRepository;
import com.internship.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
public class UserServiceImpl extends ServiceImpl<UserRepository, User> implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public ApiResponse<User> getCurrentUser(String username) {
        try {
            Optional<User> userOpt = userRepository.findByUsername(username);
            if (!userOpt.isPresent()) {
                log.error("用户不存在: {}", username);
                throw new BusinessException("用户不存在");
            }
            User user = userOpt.get();
            log.info("获取当前用户信息成功: {}", username);
            return ApiResponse.success(user);
        } catch (Exception e) {
            log.error("获取当前用户信息失败: {}", e.getMessage());
            throw new BusinessException("获取用户信息失败");
        }
    }

    @Override
    @Transactional
    public ApiResponse<User> createUser(User user) {
        try {
            user.setCreateTime(LocalDateTime.now());
            user.setUpdateTime(LocalDateTime.now());
            userRepository.insert(user);
            log.info("创建用户成功: {}", user);
            return ApiResponse.success("用户创建成功", user);
        } catch (Exception e) {
            log.error("创建用户失败: {}", e.getMessage());
            throw new BusinessException("创建用户失败");
        }
    }

    @Override
    @Transactional
    public ApiResponse<User> updateUser(Long id, User user) {
        try {
            user.setId(id);
            user.setUpdateTime(LocalDateTime.now());
            userRepository.updateById(user);
            log.info("更新用户成功: {}", user);
            return ApiResponse.success("用户更新成功", user);
        } catch (Exception e) {
            log.error("更新用户失败: {}", e.getMessage());
            throw new BusinessException("更新用户失败");
        }
    }

    @Override
    @Transactional
    public ApiResponse<Void> deleteUser(Long id) {
        try {
            userRepository.deleteById(id);
            log.info("删除用户成功, ID: {}", id);
            return ApiResponse.success("用户删除成功");
        } catch (Exception e) {
            log.error("删除用户失败: {}", e.getMessage());
            throw new BusinessException("删除用户失败");
        }
    }

    @Override
    public ApiResponse<User> getUserById(Long id) {
        try {
            User user = userRepository.selectById(id);
            if (user == null) {
                throw new BusinessException("用户不存在");
            }
            return ApiResponse.success(user);
        } catch (Exception e) {
            log.error("获取用户失败: {}", e.getMessage());
            throw new BusinessException("获取用户失败");
        }
    }

    @Override
    public ApiResponse<PageResponse<User>> getUsers(Integer page, Integer size, String username, Integer role, Integer status) {
        try {
            QueryWrapper<User> queryWrapper = new QueryWrapper<>();
            if (username != null) {
                queryWrapper.like("username", username);
            }
            if (role != null) {
                queryWrapper.eq("role", role);
            }
            if (status != null) {
                queryWrapper.eq("status", status);
            }
            queryWrapper.orderByDesc("create_time");

            Page<User> pageResult = userRepository.selectPage(new Page<>(page, size), queryWrapper);
            PageResponse<User> response = new PageResponse<>(
                    Integer.valueOf((int)(pageResult.getCurrent() - 1)),
                    Integer.valueOf((int)pageResult.getSize()),
                    Long.valueOf(pageResult.getTotal()),
                    pageResult.getRecords()
            );
            log.info("查询用户列表成功, 页码: {}, 每页大小: {}, 总数: {}",
                    pageResult.getCurrent(), pageResult.getSize(), pageResult.getTotal());
            return ApiResponse.success(response);
        } catch (Exception e) {
            log.error("查询用户列表失败: {}", e.getMessage());
            throw new BusinessException("查询用户列表失败");
        }
    }

    @Override
    @Transactional
    public ApiResponse<Void> changeUserStatus(Long id, Integer status) {
        try {
            User user = new User();
            user.setId(id);
            user.setStatus(status);
            user.setUpdateTime(LocalDateTime.now());
            userRepository.updateById(user);
            log.info("更新用户状态成功, ID: {}, 状态: {}", id, status);
            return ApiResponse.success("用户状态更新成功");
        } catch (Exception e) {
            log.error("更新用户状态失败: {}", e.getMessage());
            throw new BusinessException("更新用户状态失败");
        }
    }

    @Override
    public boolean updateCurrentUser(String username, UserUpdateDTO userUpdateDTO) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            
            // 只更新非空字段
            if (userUpdateDTO.getFullName() != null && !userUpdateDTO.getFullName().trim().isEmpty()) {
                user.setFullName(userUpdateDTO.getFullName());
            }
            if (userUpdateDTO.getEmail() != null && !userUpdateDTO.getEmail().trim().isEmpty()) {
                user.setEmail(userUpdateDTO.getEmail());
            }
            if (userUpdateDTO.getPhone() != null && !userUpdateDTO.getPhone().trim().isEmpty()) {
                user.setPhone(userUpdateDTO.getPhone());
            }
            if (userUpdateDTO.getAvatarUrl() != null && !userUpdateDTO.getAvatarUrl().trim().isEmpty()) {
                user.setAvatarUrl(userUpdateDTO.getAvatarUrl());
            }
            
            user.setUpdateTime(LocalDateTime.now());
            return userRepository.updateById(user) > 0;
        }
        return false;
    }
}
