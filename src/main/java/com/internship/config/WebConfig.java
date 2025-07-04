package com.internship.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

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
        // 允许所有API路径的跨域请求
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
    
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 添加上传文件的资源处理
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadDir + "/");
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
