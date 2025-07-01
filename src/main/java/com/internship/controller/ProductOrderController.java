package com.internship.controller;

import com.internship.dto.ApiResponse;
import com.internship.dto.PageResponse;
import com.internship.entity.ProductOrder;
import com.internship.service.ProductOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class ProductOrderController {

    @Autowired
    private ProductOrderService productOrderService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ProductOrder>>> getOrders(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Integer orderStatus) {
        PageResponse<ProductOrder> pageResponse = productOrderService.getOrders(page, size, userId, orderStatus);
        return ResponseEntity.ok(ApiResponse.success(pageResponse));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductOrder>> getOrderById(@PathVariable Long id) {
        ProductOrder order = productOrderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.success(order));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<ApiResponse<List<ProductOrder>>> getMyOrders() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        // 通过用户服务查询用户ID
        List<ProductOrder> orders = productOrderService.getUserOrdersByUsername(username);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProductOrder>> createOrder(@RequestBody ProductOrder order) {
        ProductOrder created = productOrderService.createOrder(order);
        return ResponseEntity.ok(ApiResponse.success("订单创建成功", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductOrder>> updateOrder(
            @PathVariable Long id,
            @RequestBody ProductOrder order) {
        ProductOrder updated = productOrderService.updateOrder(id, order);
        return ResponseEntity.ok(ApiResponse.success("订单更新成功", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteOrder(@PathVariable Long id) {
        productOrderService.deleteOrder(id);
        return ResponseEntity.ok(ApiResponse.<Void>success("订单删除成功"));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Void>> changeOrderStatus(
            @PathVariable Long id,
            @RequestParam Integer status) {
        productOrderService.changeOrderStatus(id, status);
        return ResponseEntity.ok(ApiResponse.<Void>success("订单状态更新成功"));
    }

    @PostMapping("/purchase")
    public ResponseEntity<ApiResponse<ProductOrder>> purchaseProduct(@RequestBody Map<String, Object> purchaseRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        Long productId = Long.valueOf(purchaseRequest.get("productId").toString());
        String shippingAddress = (String) purchaseRequest.get("shippingAddress");
        String contactName = (String) purchaseRequest.get("contactName");
        String contactPhone = (String) purchaseRequest.get("contactPhone");
        String remark = (String) purchaseRequest.get("remark");
        
        ProductOrder order = productOrderService.purchaseProductByUsername(username, productId, shippingAddress, contactName, contactPhone, remark);
        return ResponseEntity.ok(ApiResponse.success("商品购买成功", order));
    }
} 