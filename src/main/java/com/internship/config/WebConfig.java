package com.internship.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

/**
 * Web配置类，用于配置CORS
 *
 * @author huihuizi1024
 * @date 2025.6.24
 * @version 1.1.0
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir:./uploads}")
    private String uploadDir;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // 允许所有路径
                .allowedOrigins("http://localhost:3000", "http://localhost:8080")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 确保上传目录存在
        File uploadDirectory = new File(uploadDir);
        if (!uploadDirectory.exists()) {
            uploadDirectory.mkdirs();
        }
        
        // 配置静态资源映射
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadDirectory.getAbsolutePath() + File.separator)
                .setCachePeriod(3600)
                .resourceChain(true);
                
        // 添加其他静态资源路径
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/");
    }
    
    /**
     * 自定义Tomcat配置，增加HTTP请求头大小限制
     */
    @Bean
    public WebServerFactoryCustomizer<TomcatServletWebServerFactory> containerCustomizer() {
        return factory -> {
            // 使用通用配置方法设置最大请求头大小
            factory.addConnectorCustomizers(connector -> {
                // 设置最大请求体大小为10MB
                connector.setMaxPostSize(10 * 1024 * 1024); // 10MB
                connector.setMaxParameterCount(1000);
                
                // 使用反射方式尝试设置请求头大小 (兼容性更好)
                try {
                    java.lang.reflect.Method method = connector.getClass().getMethod("setMaxHeaderCount", Integer.TYPE);
                    method.invoke(connector, 100);
                } catch (Exception e) {
                    System.out.println("注意: 无法设置最大头部数量，将依赖application.properties配置");
                }
            });
        };
    }
}
