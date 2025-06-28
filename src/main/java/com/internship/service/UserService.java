package com.internship.service;

import com.internship.dto.ApiResponse;
import com.internship.dto.PageResponse;
import com.internship.entity.User;
import java.util.List;

public interface UserService {
    ApiResponse<User> createUser(User user);
    ApiResponse<User> updateUser(Long id, User user);
    ApiResponse<Void> deleteUser(Long id);
    ApiResponse<User> getUserById(Long id);
    ApiResponse<PageResponse<User>> getUsers(Integer page, Integer size, String username, Integer role, Integer status);
    ApiResponse<Void> changeUserStatus(Long id, Integer status);
}