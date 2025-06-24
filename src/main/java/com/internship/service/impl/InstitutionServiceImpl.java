package com.internship.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.internship.dto.PageResponse;
import com.internship.entity.Institution;
import com.internship.repository.InstitutionRepository;
import com.internship.service.InstitutionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * 机构管理服务实现
 * 
 * @author huihuizi1024
 * @date 2025.6.24
 * @version 1.2.1
 */
@Service
@Transactional
public class InstitutionServiceImpl implements InstitutionService {
    
    private final InstitutionRepository institutionRepository;
    
    public InstitutionServiceImpl(InstitutionRepository institutionRepository) {
        this.institutionRepository = institutionRepository;
    }
    
    @Override
    public PageResponse<Institution> getInstitutions(Integer page, Integer size, String institutionName, 
                                                   String institutionCode, Integer institutionType, 
                                                   Integer institutionLevel, String province, String city, 
                                                   Integer status, Integer reviewStatus) {
        // 创建分页对象
        Page<Institution> pageParam = new Page<>(page, size);
        
        // 构建查询条件
        QueryWrapper<Institution> queryWrapper = new QueryWrapper<>();
        
        if (institutionName != null && !institutionName.trim().isEmpty()) {
            queryWrapper.like("institution_name", institutionName);
        }
        if (institutionCode != null && !institutionCode.trim().isEmpty()) {
            queryWrapper.like("institution_code", institutionCode);
        }
        if (institutionType != null) {
            queryWrapper.eq("institution_type", institutionType);
        }
        if (institutionLevel != null) {
            queryWrapper.eq("institution_level", institutionLevel);
        }
        if (province != null && !province.trim().isEmpty()) {
            queryWrapper.eq("province", province);
        }
        if (city != null && !city.trim().isEmpty()) {
            queryWrapper.eq("city", city);
        }
        if (status != null) {
            queryWrapper.eq("status", status);
        }
        if (reviewStatus != null) {
            queryWrapper.eq("review_status", reviewStatus);
        }
        
        // 按创建时间倒序排列
        queryWrapper.orderByDesc("create_time");
        
        // 执行分页查询
        IPage<Institution> pageResult = institutionRepository.selectPage(pageParam, queryWrapper);
        
        // 构建返回结果
        return new PageResponse<>(
            (int) pageResult.getCurrent(),
            (int) pageResult.getSize(),
            pageResult.getTotal(),
            pageResult.getRecords()
        );
    }
    
    @Override
    public Institution getInstitutionById(Long id) {
        return institutionRepository.selectById(id);
    }
    
    @Override
    public Institution createInstitution(Institution institution) {
        institution.setCreateTime(LocalDateTime.now());
        institution.setUpdateTime(LocalDateTime.now());
        institutionRepository.insert(institution);
        return institution;
    }
    
    @Override
    public Institution updateInstitution(Long id, Institution institution) {
        institution.setId(id);
        institution.setUpdateTime(LocalDateTime.now());
        institutionRepository.updateById(institution);
        return institution;
    }
    
    @Override
    public void deleteInstitution(Long id) {
        institutionRepository.deleteById(id);
    }
} 