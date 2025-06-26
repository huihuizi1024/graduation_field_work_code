package com.internship.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.internship.dto.PageResponse;
import com.internship.entity.Institution;
import com.internship.exception.BusinessException;
import com.internship.repository.InstitutionRepository;
import com.internship.service.InstitutionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    public PageResponse<Institution> getInstitutions(long page, Integer size, String institutionName, 
                                                   String institutionCode, Integer institutionType, 
                                                   Integer institutionLevel, String province, String city, 
                                                   Integer status, Integer reviewStatus) {
        try {
            // 创建分页对象
            Page<Institution> pageParam = new Page<>(page + 1, size); // 后端页码从1开始
            
            // 构建查询条件
            LambdaQueryWrapper<Institution> queryWrapper = new LambdaQueryWrapper<>();
            
            if (StringUtils.hasText(institutionName)) {
                queryWrapper.like(Institution::getInstitutionName, institutionName);
            }
            if (StringUtils.hasText(institutionCode)) {
                queryWrapper.eq(Institution::getInstitutionCode, institutionCode);
            }
            if (institutionType != null) {
                queryWrapper.eq(Institution::getInstitutionType, institutionType);
            }
            if (institutionLevel != null) {
                queryWrapper.eq(Institution::getInstitutionLevel, institutionLevel);
            }
            if (StringUtils.hasText(province)) {
                queryWrapper.eq(Institution::getProvince, province);
            }
            if (StringUtils.hasText(city)) {
                queryWrapper.eq(Institution::getCity, city);
            }
            if (status != null) {
                queryWrapper.eq(Institution::getStatus, status);
            }
            if (reviewStatus != null) {
                queryWrapper.eq(Institution::getReviewStatus, reviewStatus);
            }
            
            // 按创建时间倒序排列
            queryWrapper.orderByDesc(Institution::getCreateTime);
            
            // 执行分页查询
            IPage<Institution> pageResult = institutionRepository.selectPage(pageParam, queryWrapper);
            
            // 构建返回结果
            return new PageResponse<Institution>(
                (int)(pageResult.getCurrent() - 1),
                    (int) pageResult.getSize(),
                pageResult.getTotal(),
                pageResult.getRecords()
            );
        } catch (Exception e) {
            throw new BusinessException("查询机构列表失败: " + e.getMessage());
        }
    }
    
    @Override
    public Institution getInstitutionById(Long id) {
        return institutionRepository.selectById(id);
    }
    
    @Override
    public Institution createInstitution(Institution institution) {
        if (institutionRepository.selectOne(new LambdaQueryWrapper<Institution>()
                .eq(Institution::getInstitutionCode, institution.getInstitutionCode())) != null) {
            throw new BusinessException("机构代码已存在");
        }
        institution.setCreateTime(LocalDateTime.now());
        institution.setUpdateTime(LocalDateTime.now());
        institutionRepository.insert(institution);
        return institution;
    }
    
    @Override
    public Institution updateInstitution(Long id, Institution institution) {
        Institution existingInstitution = institutionRepository.selectById(id);
        if (existingInstitution == null) {
            throw new BusinessException("机构不存在");
        }
        // 检查编码是否被其他机构占用
        Institution institutionWithSameCode = institutionRepository.selectOne(new LambdaQueryWrapper<Institution>()
                .eq(Institution::getInstitutionCode, institution.getInstitutionCode()));
        if (institutionWithSameCode != null && !institutionWithSameCode.getId().equals(id)) {
            throw new BusinessException("机构代码已存在");
        }
        institution.setId(id);
        institution.setUpdateTime(LocalDateTime.now());
        institutionRepository.updateById(institution);
        return institution;
    }
    
    @Override
    public void deleteInstitution(Long id) {
        Institution existingInstitution = institutionRepository.selectById(id);
        if (existingInstitution == null) {
            throw new BusinessException("机构不存在");
        }
        existingInstitution.setStatus(0); // 软删除，将状态设为0（无效）
        existingInstitution.setUpdateTime(LocalDateTime.now());
        institutionRepository.updateById(existingInstitution);
    }

    @Override
    public void reviewInstitution(Long id, Integer reviewStatus, String reviewComment) {
        Institution existingInstitution = institutionRepository.selectById(id);
        if (existingInstitution == null) {
            throw new BusinessException("机构不存在");
        }
        existingInstitution.setReviewStatus(reviewStatus);
        existingInstitution.setReviewComment(reviewComment);
        existingInstitution.setReviewTime(LocalDateTime.now());
        existingInstitution.setUpdateTime(LocalDateTime.now());
        // TODO: 审核人ID和姓名需要从当前登录用户获取
        existingInstitution.setReviewerId(1L);
        existingInstitution.setReviewerName("系统管理员");
        institutionRepository.updateById(existingInstitution);
    }

    @Override
    public void changeInstitutionStatus(Long id, Integer status) {
        Institution existingInstitution = institutionRepository.selectById(id);
        if (existingInstitution == null) {
            throw new BusinessException("机构不存在");
        }
        // 根据状态类型进行更新：1-正常，2-暂停，3-注销
        existingInstitution.setStatus(status);
        existingInstitution.setUpdateTime(LocalDateTime.now());
        institutionRepository.updateById(existingInstitution);
    }

    @Override
    public void certifyInstitution(Long id, Integer certificationLevel, Integer validityMonths) {
        Institution existingInstitution = institutionRepository.selectById(id);
        if (existingInstitution == null) {
            throw new BusinessException("机构不存在");
        }
        existingInstitution.setCertificationLevel(certificationLevel);
        existingInstitution.setValidityMonths(validityMonths);
        existingInstitution.setUpdateTime(LocalDateTime.now());
        institutionRepository.updateById(existingInstitution);
    }

    @Override
    public Map<String, Object> getInstitutionStatistics() {
        Map<String, Object> statistics = new HashMap<>();
        statistics.put("regionStatistics", getRegionStatistics());
        statistics.put("typeStatistics", getTypeStatistics());
        return statistics;
    }

    @Override
    public Map<String, Object> getRegionStatistics() {
        List<Map<String, Object>> regionCounts = institutionRepository.selectMaps(
                new QueryWrapper<Institution>()
                        .select("province", "city", "COUNT(id) as count")
                        .groupBy("province", "city")
        );
        Map<String, Object> regionStatistics = new HashMap<>();
        regionStatistics.put("regionCounts", regionCounts);
        return regionStatistics;
    }

    @Override
    public Map<String, Object> getTypeStatistics() {
        List<Map<String, Object>> typeCounts = institutionRepository.selectMaps(
                new QueryWrapper<Institution>()
                        .select("institution_type", "COUNT(id) as count")
                        .groupBy("institution_type")
        );
        Map<String, Object> typeStatistics = new HashMap<>();
        typeStatistics.put("typeCounts", typeCounts);
        return typeStatistics;
    }

    @Override
    public List<Institution> exportInstitutions(Integer institutionType, String province, Integer status) {
        LambdaQueryWrapper<Institution> queryWrapper = new LambdaQueryWrapper<>();
        if (institutionType != null) {
            queryWrapper.eq(Institution::getInstitutionType, institutionType);
        }
        if (StringUtils.hasText(province)) {
            queryWrapper.eq(Institution::getProvince, province);
        }
        if (status != null) {
            queryWrapper.eq(Institution::getStatus, status);
        }
        return institutionRepository.selectList(queryWrapper);
    }
}
