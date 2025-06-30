package com.internship.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.internship.dto.PageResponse;
import com.internship.entity.Expert;
import com.internship.repository.ExpertRepository;
import com.internship.service.ExpertService;
import org.springframework.stereotype.Service;
import com.internship.repository.UserRepository;
import com.internship.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Optional;
import com.internship.dto.ExpertProfileDTO;
import com.internship.dto.ExpertUpdateDTO;
import com.internship.service.UserService;
import org.springframework.transaction.annotation.Transactional;

/**
 * 专家服务实现类
 */
@Service
public class ExpertServiceImpl extends ServiceImpl<ExpertRepository, Expert> implements ExpertService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExpertRepository expertRepository;

    @Autowired
    private UserService userService;

    @Override
    public PageResponse<Expert> getExperts(Integer page, Integer size, String name, String expertise, Integer status) {
        Page<Expert> pageRequest = new Page<>(page, size);
        QueryWrapper<Expert> queryWrapper = new QueryWrapper<>();
        queryWrapper.like(name != null, "name", name);
        queryWrapper.like(expertise != null, "expertise", expertise);
        queryWrapper.eq(status != null, "status", status);
        Page<Expert> pageResult = page(pageRequest, queryWrapper);
        return new PageResponse<>(
                page,
                size,
                pageResult.getTotal(),
                pageResult.getRecords()
        );
    }

    @Override
    public Expert getExpertByUsername(String username) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return expertRepository.selectById(user.getId());
        }
        return null;
    }

    @Override
    public ExpertProfileDTO getExpertProfileByUsername(String username) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            Expert expert = expertRepository.selectById(user.getId());
            return new ExpertProfileDTO(user, expert);
        }
        return null;
    }

    @Override
    @Transactional
    public boolean updateCurrentExpert(String username, ExpertUpdateDTO expertUpdateDTO) {
        // Step 1: Update the common user part
        boolean userPartUpdated = userService.updateCurrentUser(username, expertUpdateDTO);
        if (!userPartUpdated) {
            return false; // or throw an exception
        }

        // Step 2: Update the expert-specific part
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            Expert expert = expertRepository.selectById(user.getId());
            if (expert != null) {
                expert.setExpertise(expertUpdateDTO.getExpertise());
                expert.setDescription(expertUpdateDTO.getDescription());
                return expertRepository.updateById(expert) > 0;
            }
        }
        return false; // User exists but no corresponding expert record
    }
}
