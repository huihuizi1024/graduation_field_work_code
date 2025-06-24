package com.internship.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.internship.entity.Institution;
import org.apache.ibatis.annotations.Mapper;

/**
 * 机构数据访问层
 * 
 * @author huihuizi1024
 * @date 2025.6.24
 * @version 1.2.1
 */
@Mapper
public interface InstitutionRepository extends BaseMapper<Institution> {
} 