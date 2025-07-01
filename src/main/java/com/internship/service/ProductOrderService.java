package com.internship.service;

import com.internship.dto.PageResponse;
import com.internship.dto.ProductOrderDTO;
import com.internship.entity.ProductOrder;

import java.util.List;

public interface ProductOrderService {
    PageResponse<ProductOrder> getOrders(Integer page, Integer size, Long userId, Integer orderStatus);
    ProductOrder getOrderById(Long id);
    ProductOrder createOrder(ProductOrder order);
    ProductOrder updateOrder(Long id, ProductOrder order);
    void deleteOrder(Long id);
    void changeOrderStatus(Long id, Integer status);
    List<ProductOrder> getUserOrders(Long userId);
    List<ProductOrder> getUserOrdersByUsername(String username);
    ProductOrder purchaseProduct(Long userId, Long productId, String shippingAddress, String contactName, String contactPhone, String remark);
    ProductOrder purchaseProductByUsername(String username, Long productId, String shippingAddress, String contactName, String contactPhone, String remark);
} 