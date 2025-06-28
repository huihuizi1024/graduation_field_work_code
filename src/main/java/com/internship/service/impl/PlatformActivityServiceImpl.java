package com.internship.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.internship.dto.PageResponse;
import com.internship.entity.PlatformActivity;
import com.internship.exception.BusinessException;
import com.internship.repository.PlatformActivityRepository;
import com.internship.service.PlatformActivityService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class PlatformActivityServiceImpl implements PlatformActivityService {

    @Autowired
    private PlatformActivityRepository platformActivityRepository;

    @Override
    @Transactional
    public PlatformActivity createPlatformActivity(PlatformActivity platformActivity) {
        try {
            platformActivityRepository.insert(platformActivity);
            return platformActivity;
        } catch (Exception e) {
            log.error("创建平台活动失败", e);
            throw new BusinessException("创建平台活动失败");
        }
    }

    @Override
    @Transactional
    public PlatformActivity updatePlatformActivity(Long id, PlatformActivity platformActivity) {
        PlatformActivity existing = platformActivityRepository.selectById(id);
        if (existing == null) {
            throw new BusinessException("平台活动不存在");
        }
        
        platformActivity.setId(id);
        platformActivityRepository.updateById(platformActivity);
        return platformActivity;
    }

    @Override
    @Transactional
    public void deletePlatformActivity(Long id) {
        if (platformActivityRepository.selectById(id) == null) {
            throw new BusinessException("平台活动不存在");
        }
        platformActivityRepository.deleteById(id);
    }

    @Override
    public PlatformActivity getPlatformActivityById(Long id) {
        PlatformActivity activity = platformActivityRepository.selectById(id);
        if (activity == null) {
            throw new BusinessException("平台活动不存在");
        }
        return activity;
    }

    @Override
    public PageResponse<PlatformActivity> getPlatformActivities(Integer page, Integer size, String activityName, Integer activityType, Integer status) {
        LambdaQueryWrapper<PlatformActivity> queryWrapper = new LambdaQueryWrapper<>();
        
        if (activityName != null) {
            queryWrapper.like(PlatformActivity::getActivityName, activityName);
        }
        if (activityType != null) {
            queryWrapper.eq(PlatformActivity::getActivityType, activityType);
        }
        if (status != null) {
            queryWrapper.eq(PlatformActivity::getStatus, status);
        }
        
        IPage<PlatformActivity> pageResult = platformActivityRepository.selectPage(
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
    public void changePlatformActivityStatus(Long id, Integer status) {
        PlatformActivity activity = platformActivityRepository.selectById(id);
        if (activity == null) {
            throw new BusinessException("平台活动不存在");
        }
        activity.setStatus(status);
        platformActivityRepository.updateById(activity);
    }

    @Override
    public Map<String, Object> getPlatformActivityStatistics() {
        Map<String, Object> stats = new HashMap<>();
        // TODO: 实现统计逻辑
        return stats;
    }

    @Override
    public List<PlatformActivity> exportPlatformActivities(Integer activityType, Integer status) {
        LambdaQueryWrapper<PlatformActivity> queryWrapper = new LambdaQueryWrapper<>();
        
        if (activityType != null) {
            queryWrapper.eq(PlatformActivity::getActivityType, activityType);
        }
        if (status != null) {
            queryWrapper.eq(PlatformActivity::getStatus, status);
        }
        
        return platformActivityRepository.selectList(queryWrapper);
    }
}
