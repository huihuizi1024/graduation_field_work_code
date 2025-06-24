package com.internship.service;

import com.internship.dto.PageResponse;
import com.internship.entity.Institution;

/**
 * 机构管理服务接口
 * 
 * @author huihuizi1024
 * @date 2025.6.24
 * @version 1.2.1
 */
public interface InstitutionService {
    
    /**
     * 分页查询机构
     */
    PageResponse<Institution> getInstitutions(Integer page, Integer size, String institutionName, 
                                           String institutionCode, Integer institutionType, 
                                           Integer institutionLevel, String province, String city, 
                                           Integer status, Integer reviewStatus);
    
    /**
     * 根据ID获取机构
     */
    Institution getInstitutionById(Long id);
    
    /**
     * 创建机构
     */
    Institution createInstitution(Institution institution);
    
    /**
     * 更新机构
     */
    Institution updateInstitution(Long id, Institution institution);
    
    /**
     * 删除机构
     */
    void deleteInstitution(Long id);
} 