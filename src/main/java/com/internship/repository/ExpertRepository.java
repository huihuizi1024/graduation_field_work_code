package com.internship.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.internship.entity.Expert;
import org.apache.ibatis.annotations.Mapper;

/**
 * 专家Repository接口
 */
@Mapper
public interface ExpertRepository extends BaseMapper<Expert> {
}
