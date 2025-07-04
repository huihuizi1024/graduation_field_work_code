package com.internship.controller;

import com.internship.dto.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    @PostMapping("/file")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadFile(@RequestParam("file") MultipartFile file) {
        logger.info("开始处理文件上传请求");
        logger.debug("文件信息 - 名称: {}, 大小: {}, 类型: {}",
            file.getOriginalFilename(),
            file.getSize(),
            file.getContentType());
        
        try {
            // 检查文件是否为空
            if (file.isEmpty()) {
                logger.error("上传的文件为空");
                return ResponseEntity.badRequest().body(ApiResponse.error("上传的文件为空"));
            }

            // 检查文件类型，允许图片、视频和常见文档类型
            String contentType = file.getContentType();
            if (contentType == null || !(contentType.startsWith("image/") ||
                                        contentType.startsWith("video/") ||
                                        contentType.equals("application/pdf") ||
                                        contentType.equals("application/msword") ||
                                        contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
                                        contentType.equals("application/vnd.ms-excel") ||
                                        contentType.equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") ||
                                        contentType.equals("application/vnd.ms-powerpoint") ||
                                        contentType.equals("application/vnd.openxmlformats-officedocument.presentationml.presentation"))) {
                logger.error("不支持的文件类型: {}", contentType);
                return ResponseEntity.badRequest().body(ApiResponse.error("只支持图片、视频、PDF和常见文档文件上传"));
            }

            // 创建上传目录
            File dir = new File(uploadDir);
            if (!dir.exists() && !dir.mkdirs()) {
                logger.error("无法创建上传目录: {}", dir.getAbsolutePath());
                return ResponseEntity.internalServerError().body(ApiResponse.error("服务器错误：无法创建上传目录"));
            }

            // 检查目录权限
            if (!dir.canWrite()) {
                logger.error("上传目录没有写入权限: {}", dir.getAbsolutePath());
                return ResponseEntity.internalServerError().body(ApiResponse.error("服务器错误：上传目录没有写入权限"));
            }

            // 生成文件名
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null) {
                return ResponseEntity.badRequest().body(ApiResponse.error("无效的文件名"));
            }
            
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String newFilename = UUID.randomUUID().toString() + extension;
            Path filePath = Paths.get(dir.getAbsolutePath(), newFilename);
            
            // 保存文件
            logger.debug("保存文件到: {}", filePath);
            Files.write(filePath, file.getBytes());
            
            // 验证文件是否成功保存
            if (!Files.exists(filePath)) {
                logger.error("文件保存失败: {}", filePath);
                return ResponseEntity.internalServerError().body(ApiResponse.error("文件保存失败"));
            }
            
            // 构建文件URL
            String fileUrl = "/uploads/" + newFilename;
            logger.info("文件上传成功: {}", fileUrl);
            
            Map<String, String> result = new HashMap<>();
            result.put("url", fileUrl);
            result.put("filename", newFilename);
            result.put("originalFilename", originalFilename);
            
            return ResponseEntity.ok(ApiResponse.success("文件上传成功", result));
            
        } catch (IOException e) {
            logger.error("文件上传失败", e);
            return ResponseEntity.internalServerError().body(ApiResponse.error("文件上传失败: " + e.getMessage()));
        } catch (Exception e) {
            logger.error("未预期的错误", e);
            return ResponseEntity.internalServerError().body(ApiResponse.error("服务器错误: " + e.getMessage()));
        }
    }

    @PostMapping("/image")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadImage(@RequestParam("file") MultipartFile file) {
        logger.info("开始处理图片上传请求");
        logger.debug("图片信息 - 名称: {}, 大小: {}, 类型: {}",
            file.getOriginalFilename(),
            file.getSize(),
            file.getContentType());
        
        try {
            // 检查文件是否为空
            if (file.isEmpty()) {
                logger.error("上传的图片为空");
                return ResponseEntity.badRequest().body(ApiResponse.error("上传的图片为空"));
            }

            // 检查文件类型，只允许图片
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                logger.error("不支持的图片类型: {}", contentType);
                return ResponseEntity.badRequest().body(ApiResponse.error("只支持图片文件上传"));
            }

            // 检查文件大小（限制为10MB）
            if (file.getSize() > 10 * 1024 * 1024) {
                logger.error("图片文件过大: {} bytes", file.getSize());
                return ResponseEntity.badRequest().body(ApiResponse.error("图片文件大小不能超过10MB"));
            }

            // 创建上传目录
            File dir = new File(uploadDir);
            if (!dir.exists() && !dir.mkdirs()) {
                logger.error("无法创建上传目录: {}", dir.getAbsolutePath());
                return ResponseEntity.internalServerError().body(ApiResponse.error("服务器错误：无法创建上传目录"));
            }

            // 生成文件名
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null) {
                return ResponseEntity.badRequest().body(ApiResponse.error("无效的文件名"));
            }
            
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String newFilename = UUID.randomUUID().toString() + extension;
            Path filePath = Paths.get(dir.getAbsolutePath(), newFilename);
            
            // 保存文件
            logger.debug("保存图片到: {}", filePath);
            Files.write(filePath, file.getBytes());
            
            // 验证文件是否成功保存
            if (!Files.exists(filePath)) {
                logger.error("图片保存失败: {}", filePath);
                return ResponseEntity.internalServerError().body(ApiResponse.error("图片保存失败"));
            }
            
            // 构建文件URL
            String fileUrl = "/uploads/" + newFilename;
            logger.info("图片上传成功: {}", fileUrl);
            
            Map<String, String> result = new HashMap<>();
            result.put("url", fileUrl);
            result.put("filename", newFilename);
            result.put("originalFilename", originalFilename);
            
            return ResponseEntity.ok(ApiResponse.success("图片上传成功", result));
            
        } catch (IOException e) {
            logger.error("图片上传失败", e);
            return ResponseEntity.internalServerError().body(ApiResponse.error("图片上传失败: " + e.getMessage()));
        } catch (Exception e) {
            logger.error("未预期的错误", e);
            return ResponseEntity.internalServerError().body(ApiResponse.error("服务器错误: " + e.getMessage()));
        }
    }

    @PostMapping("/video")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadVideo(@RequestParam("file") MultipartFile file) {
        logger.info("开始处理视频上传请求");
        logger.debug("视频信息 - 名称: {}, 大小: {}, 类型: {}",
            file.getOriginalFilename(),
            file.getSize(),
            file.getContentType());
        
        try {
            // 检查文件是否为空
            if (file.isEmpty()) {
                logger.error("上传的视频为空");
                return ResponseEntity.badRequest().body(ApiResponse.error("上传的视频为空"));
            }

            // 检查文件类型，只允许视频
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("video/")) {
                logger.error("不支持的视频类型: {}", contentType);
                return ResponseEntity.badRequest().body(ApiResponse.error("只支持视频文件上传"));
            }

            // 检查文件大小（限制为500MB）
            if (file.getSize() > 500 * 1024 * 1024) {
                logger.error("视频文件过大: {} bytes", file.getSize());
                return ResponseEntity.badRequest().body(ApiResponse.error("视频文件大小不能超过500MB"));
            }

            // 创建上传目录
            File dir = new File(uploadDir);
            if (!dir.exists() && !dir.mkdirs()) {
                logger.error("无法创建上传目录: {}", dir.getAbsolutePath());
                return ResponseEntity.internalServerError().body(ApiResponse.error("服务器错误：无法创建上传目录"));
            }

            // 生成文件名
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null) {
                return ResponseEntity.badRequest().body(ApiResponse.error("无效的文件名"));
            }
            
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String newFilename = UUID.randomUUID().toString() + extension;
            Path filePath = Paths.get(dir.getAbsolutePath(), newFilename);
            
            // 保存文件
            logger.debug("保存视频到: {}", filePath);
            Files.write(filePath, file.getBytes());
            
            // 验证文件是否成功保存
            if (!Files.exists(filePath)) {
                logger.error("视频保存失败: {}", filePath);
                return ResponseEntity.internalServerError().body(ApiResponse.error("视频保存失败"));
            }
            
            // 构建文件URL
            String fileUrl = "/uploads/" + newFilename;
            logger.info("视频上传成功: {}", fileUrl);
            
            Map<String, String> result = new HashMap<>();
            result.put("url", fileUrl);
            result.put("filename", newFilename);
            result.put("originalFilename", originalFilename);
            
            return ResponseEntity.ok(ApiResponse.success("视频上传成功", result));
            
        } catch (IOException e) {
            logger.error("视频上传失败", e);
            return ResponseEntity.internalServerError().body(ApiResponse.error("视频上传失败: " + e.getMessage()));
        } catch (Exception e) {
            logger.error("未预期的错误", e);
            return ResponseEntity.internalServerError().body(ApiResponse.error("服务器错误: " + e.getMessage()));
        }
    }
} 