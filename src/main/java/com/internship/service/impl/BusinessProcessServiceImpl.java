package com.internship.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.internship.dto.PageResponse;
import com.internship.entity.BusinessProcess;
import com.internship.exception.BusinessException;
import com.internship.repository.BusinessProcessRepository;
import com.internship.service.BusinessProcessService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class BusinessProcessServiceImpl implements BusinessProcessService {

    @Autowired
    private BusinessProcessRepository businessProcessRepository;

    @Override
    @Transactional
    public BusinessProcess createBusinessProcess(BusinessProcess businessProcess) {
        try {
            businessProcessRepository.insert(businessProcess);
            return businessProcess;
        } catch (Exception e) {
            log.error("创建业务流程失败", e);
            throw new BusinessException("创建业务流程失败");
        }
    }

    @Override
    @Transactional
    public BusinessProcess updateBusinessProcess(Long id, BusinessProcess businessProcess) {
        BusinessProcess existing = businessProcessRepository.selectById(id);
        if (existing == null) {
            throw new BusinessException("业务流程不存在");
        }
        
        businessProcess.setId(id);
        businessProcessRepository.updateById(businessProcess);
        return businessProcess;
    }

    @Override
    @Transactional
    public void deleteBusinessProcess(Long id) {
        if (businessProcessRepository.selectById(id) == null) {
            throw new BusinessException("业务流程不存在");
        }
        businessProcessRepository.deleteById(id);
    }

    @Override
    public BusinessProcess getBusinessProcessById(Long id) {
        BusinessProcess process = businessProcessRepository.selectById(id);
        if (process == null) {
            throw new BusinessException("业务流程不存在");
        }
        return process;
    }

    @Override
    public PageResponse<BusinessProcess> getBusinessProcesses(Integer page, Integer size, String processName, Integer category, Integer status) {
        LambdaQueryWrapper<BusinessProcess> queryWrapper = new LambdaQueryWrapper<>();
        
        if (processName != null) {
            queryWrapper.like(BusinessProcess::getProcessName, processName);
        }
        if (category != null) {
            queryWrapper.eq(BusinessProcess::getCategory, category);
        }
        if (status != null) {
            queryWrapper.eq(BusinessProcess::getStatus, status);
        }
        
        IPage<BusinessProcess> pageResult = businessProcessRepository.selectPage(
            new Page<>(page, size), 
            queryWrapper
        );
        
        return new PageResponse<>(
            (int)pageResult.getCurrent(),
            (int)pageResult.getSize(),
            pageResult.getTotal(),
            pageResult.getRecords()
        );
    }

    @Override
    @Transactional
    public void changeBusinessProcessStatus(Long id, Integer status) {
        BusinessProcess process = businessProcessRepository.selectById(id);
        if (process == null) {
            throw new BusinessException("业务流程不存在");
        }
        process.setStatus(status);
        businessProcessRepository.updateById(process);
    }

    @Override
    public Map<String, Object> getBusinessProcessStatistics() {
        Map<String, Object> stats = new HashMap<>();
        // Implement statistics logic here
        return stats;
    }

    @Override
    public List<BusinessProcess> exportBusinessProcesses(Integer category, Integer status) {
        LambdaQueryWrapper<BusinessProcess> queryWrapper = new LambdaQueryWrapper<>();
        
        if (category != null) {
            queryWrapper.eq(BusinessProcess::getCategory, category);
        }
        if (status != null) {
            queryWrapper.eq(BusinessProcess::getStatus, status);
        }
        
        return businessProcessRepository.selectList(queryWrapper);
    }
}
