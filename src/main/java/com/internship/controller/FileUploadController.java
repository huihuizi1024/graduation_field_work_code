package com.internship.controller;

import com.internship.dto.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {
    private static final Logger logger = LoggerFactory.getLogger(FileUploadController.class);

    @Value("${file.upload-dir:./uploads}")
    private String uploadDir;

    @PostMapping("/image")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadImage(@RequestParam("file") MultipartFile file) {
        logger.info("开始处理文件上传请求，文件名: {}, 大小: {}", file.getOriginalFilename(), file.getSize());
        try {
            // 创建上传目录
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                logger.info("创建上传目录: {}", dir.getAbsolutePath());
                boolean created = dir.mkdirs();
                if (!created) {
                    logger.error("无法创建上传目录: {}", dir.getAbsolutePath());
                    return ResponseEntity.badRequest().body(ApiResponse.error("无法创建上传目录"));
                }
            }

            // 生成唯一文件名
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String newFilename = UUID.randomUUID().toString() + extension;
            
            // 保存文件
            Path filePath = Paths.get(uploadDir, newFilename);
            logger.info("保存文件到路径: {}", filePath.toString());
            Files.write(filePath, file.getBytes());
            
            // 获取当前请求的基础URL
            String baseUrl = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();
            
            // 返回文件URL (包含完整路径)
            String fileUrl = baseUrl + "/uploads/" + newFilename;
            logger.info("文件上传成功，URL: {}", fileUrl);
            
            Map<String, String> result = new HashMap<>();
            result.put("url", fileUrl);
            result.put("filename", newFilename);
            result.put("originalFilename", originalFilename);
            
            return ResponseEntity.ok(ApiResponse.success("文件上传成功", result));
        } catch (IOException e) {
            logger.error("文件上传失败", e);
            return ResponseEntity.badRequest().body(ApiResponse.error("文件上传失败: " + e.getMessage()));
        }
    }
} 