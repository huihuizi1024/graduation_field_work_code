package com.internship.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.internship.entity.ProductOrder;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ProductOrderRepository extends BaseMapper<ProductOrder> {
    @Select("SELECT po.*, p.name as product_name, u.username " +
            "FROM product_order po " +
            "LEFT JOIN product p ON po.product_id = p.id " +
            "LEFT JOIN user u ON po.user_id = u.id " +
            "WHERE po.user_id = #{userId} " +
            "ORDER BY po.create_time DESC")
    List<ProductOrder> findOrdersByUserId(@Param("userId") Long userId);
} 