package com.internship.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.internship.dto.PageResponse;
import com.internship.entity.Expert;
import com.internship.repository.ExpertRepository;
import com.internship.service.ExpertService;
import org.springframework.stereotype.Service;

/**
 * 专家服务实现类
 */
@Service
public class ExpertServiceImpl extends ServiceImpl<ExpertRepository, Expert> implements ExpertService {

    @Override
    public PageResponse<Expert> getExperts(Integer page, Integer size, String name, String expertise, Integer status) {
        QueryWrapper<Expert> queryWrapper = new QueryWrapper<>();
        
        if (name != null && !name.isEmpty()) {
            queryWrapper.like("name", name);
        }
        if (expertise != null && !expertise.isEmpty()) {
            queryWrapper.like("expertise", expertise);
        }
        if (status != null) {
            queryWrapper.eq("status", status);
        }

        Page<Expert> pageResult = page(new Page<>(page, size), queryWrapper);
        return new PageResponse<>(
            (int)pageResult.getCurrent(),
            (int)pageResult.getSize(),
            pageResult.getTotal(),
            pageResult.getRecords()
        );
    }
}
