package com.internship.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.internship.dto.PageResponse;
import com.internship.entity.Expert;

/**
 * 专家服务接口
 */
public interface ExpertService extends IService<Expert> {
    PageResponse<Expert> getExperts(Integer page, Integer size, String name, String expertise, Integer status);
}
