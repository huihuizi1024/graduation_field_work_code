package com.internship;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration;
import com.baomidou.mybatisplus.autoconfigure.MybatisPlusAutoConfiguration;

/**
 * 毕业实习项目主启动类
 * 
 * @author huihuizi1024
 * @date 2025.6.22
 * @version 1.1.0
 */
@SpringBootApplication(exclude = {
        RedisAutoConfiguration.class,
        MybatisPlusAutoConfiguration.class
})
public class Application {
    
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
} 