package com.internship.service;

import com.internship.dto.PageResponse;
import com.internship.entity.PlatformActivity;

import java.util.List;
import java.util.Map;

public interface PlatformActivityService {

    PlatformActivity createPlatformActivity(PlatformActivity platformActivity);

    PlatformActivity updatePlatformActivity(Long id, PlatformActivity platformActivity);

    void deletePlatformActivity(Long id);

    PlatformActivity getPlatformActivityById(Long id);

    PageResponse<PlatformActivity> getPlatformActivities(Integer page, Integer size, String activityName, Integer activityType, Integer status);

    void changePlatformActivityStatus(Long id, Integer status);

    Map<String, Object> getPlatformActivityStatistics();

    List<PlatformActivity> exportPlatformActivities(Integer activityType, Integer status);
} 