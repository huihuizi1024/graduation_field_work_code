package com.internship.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.internship.dto.PageResponse;
import com.internship.entity.Product;
import com.internship.exception.BusinessException;
import com.internship.repository.ProductRepository;
import com.internship.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public PageResponse<Product> getProducts(Integer page, Integer size, String name, String category, Integer status) {
        Page<Product> pageParam = new Page<>(page + 1, size);
        LambdaQueryWrapper<Product> queryWrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.hasText(name)) {
            queryWrapper.like(Product::getName, name);
        }
        
        if (StringUtils.hasText(category)) {
            queryWrapper.eq(Product::getCategory, category);
        }
        
        if (status != null) {
            queryWrapper.eq(Product::getStatus, status);
        }
        
        queryWrapper.orderByDesc(Product::getCreateTime);
        
        Page<Product> pageResult = productRepository.selectPage(pageParam, queryWrapper);
        
        return new PageResponse<>(
            (int)(pageResult.getCurrent() - 1),
            (int) pageResult.getSize(),
            pageResult.getTotal(),
            pageResult.getRecords()
        );
    }

    @Override
    public Product getProductById(Long id) {
        Product product = productRepository.selectById(id);
        if (product == null) {
            throw new BusinessException("商品不存在");
        }
        return product;
    }

    @Override
    public Product createProduct(Product product) {
        product.setCreateTime(LocalDateTime.now());
        product.setUpdateTime(LocalDateTime.now());
        productRepository.insert(product);
        return product;
    }

    @Override
    public Product updateProduct(Long id, Product product) {
        Product existingProduct = getProductById(id);
        product.setId(id);
        product.setUpdateTime(LocalDateTime.now());
        productRepository.updateById(product);
        return product;
    }

    @Override
    public void deleteProduct(Long id) {
        Product existingProduct = getProductById(id);
        productRepository.deleteById(id);
    }

    @Override
    public void changeProductStatus(Long id, Integer status) {
        Product existingProduct = getProductById(id);
        existingProduct.setStatus(status);
        existingProduct.setUpdateTime(LocalDateTime.now());
        productRepository.updateById(existingProduct);
    }
} 