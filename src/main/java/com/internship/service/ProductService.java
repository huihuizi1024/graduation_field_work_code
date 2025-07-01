package com.internship.service;

import com.internship.dto.PageResponse;
import com.internship.dto.ProductDTO;
import com.internship.entity.Product;

public interface ProductService {
    PageResponse<Product> getProducts(Integer page, Integer size, String name, String category, Integer status);
    Product getProductById(Long id);
    Product createProduct(Product product);
    Product updateProduct(Long id, Product product);
    void deleteProduct(Long id);
    void changeProductStatus(Long id, Integer status);
} 