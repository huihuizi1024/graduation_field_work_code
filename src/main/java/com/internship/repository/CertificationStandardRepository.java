package com.internship.repository;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.internship.entity.CertificationStandard;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface CertificationStandardRepository extends BaseMapper<CertificationStandard> {
} 