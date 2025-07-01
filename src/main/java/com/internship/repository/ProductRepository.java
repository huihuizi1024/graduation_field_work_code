package com.internship.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.internship.entity.Product;
import org.apache.ibatis.annotations.Mapper;
 
@Mapper
public interface ProductRepository extends BaseMapper<Product> {
} 