package com.internship.controller;

import com.internship.dto.ApiResponse;
import com.internship.dto.PageResponse;
import com.internship.entity.Product;
import com.internship.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<Product>>> getProducts(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Integer status) {
        PageResponse<Product> pageResponse = productService.getProducts(page, size, name, category, status);
        return ResponseEntity.ok(ApiResponse.success(pageResponse));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> getProductById(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.success(product));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Product>> createProduct(@RequestBody Product product) {
        Product created = productService.createProduct(product);
        return ResponseEntity.ok(ApiResponse.success("商品创建成功", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> updateProduct(
            @PathVariable Long id,
            @RequestBody Product product) {
        Product updated = productService.updateProduct(id, product);
        return ResponseEntity.ok(ApiResponse.success("商品更新成功", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.<Void>success("商品删除成功"));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Void>> changeProductStatus(
            @PathVariable Long id,
            @RequestParam Integer status) {
        productService.changeProductStatus(id, status);
        return ResponseEntity.ok(ApiResponse.<Void>success("商品状态更新成功"));
    }
} 