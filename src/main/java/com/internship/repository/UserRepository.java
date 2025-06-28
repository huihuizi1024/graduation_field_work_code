package com.internship.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.internship.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.Optional;

@Mapper
public interface UserRepository extends BaseMapper<User> {
    Optional<User> findByUsername(@Param("username") String username);
    boolean existsByUsername(@Param("username") String username);
}
