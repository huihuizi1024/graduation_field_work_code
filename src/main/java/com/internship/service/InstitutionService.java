package com.internship.service;

import com.internship.dto.PageResponse;
import com.internship.entity.Institution;
import java.util.Map;
import java.util.List;

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
    PageResponse<Institution> getInstitutions(long page, Integer size, String institutionName, 
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

    /**
     * 审核机构
     */
    void reviewInstitution(Long id, Integer reviewStatus, String reviewComment);

    /**
     * 改变机构状态
     */
    void changeInstitutionStatus(Long id, Integer status);

    /**
     * 认证机构等级
     */
    void certifyInstitution(Long id, Integer certificationLevel, Integer validityMonths);

    /**
     * 获取机构统计数据
     */
    Map<String, Object> getInstitutionStatistics();

    /**
     * 获取区域统计数据
     */
    Map<String, Object> getRegionStatistics();

    /**
     * 获取类型统计数据
     */
    Map<String, Object> getTypeStatistics();

    /**
     * 导出机构数据
     */
    List<Institution> exportInstitutions(Integer institutionType, String province, Integer status);
}
