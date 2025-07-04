package com.internship;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.mybatis.spring.annotation.MapperScan;

/**
 * 毕业实习项目主启动类 - 纯MyBatis Plus版本
 * 
 * @author huihuizi1024
 * @date 2025.6.23
 * @version 1.3.1
 */
@SpringBootApplication
@EnableTransactionManagement
@MapperScan("com.internship.repository")
@ComponentScan(basePackages = "com.internship")
public class Application {
    
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
