package com.internship;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.redis.RedisAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.data.jpa.JpaRepositoriesAutoConfiguration;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.mybatis.spring.annotation.MapperScan;

/**
 * 毕业实习项目主启动类 - 纯MyBatis Plus版本
 * 
 * @author huihuizi1024
 * @date 2025.6.22
 * @version 1.3.0
 */
@SpringBootApplication(exclude = {
        RedisAutoConfiguration.class,
        HibernateJpaAutoConfiguration.class,
        JpaRepositoriesAutoConfiguration.class
})
@EnableTransactionManagement
@MapperScan("com.internship.repository")
public class Application {
    
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
} 