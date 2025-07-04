package com.internship.service.impl;

import com.internship.entity.User;
import com.internship.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class JwtUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        
        // 根据用户角色设置权限
        List<GrantedAuthority> authorities = new ArrayList<>();
        switch (user.getRole()) {
            case 1: // 学生
                authorities.add(new SimpleGrantedAuthority("ROLE_STUDENT"));
                break;
            case 2: // 机构
                authorities.add(new SimpleGrantedAuthority("ROLE_INSTITUTION"));
                break;
            case 3: // 专家
                authorities.add(new SimpleGrantedAuthority("ROLE_EXPERT"));
                break;
            case 4: // 管理员
                authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
                break;
            default:
                authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
                break;
        }
        
        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPasswordHash(),
                authorities);
    }
} 