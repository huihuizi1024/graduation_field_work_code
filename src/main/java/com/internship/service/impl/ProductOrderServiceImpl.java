package com.internship.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.internship.dto.PageResponse;
import com.internship.entity.PointTransaction;
import com.internship.entity.Product;
import com.internship.entity.ProductOrder;
import com.internship.entity.User;
import com.internship.exception.BusinessException;
import com.internship.repository.ProductOrderRepository;
import com.internship.repository.ProductRepository;
import com.internship.repository.UserRepository;
import com.internship.service.ProductOrderService;
import com.internship.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProductOrderServiceImpl implements ProductOrderService {

    @Autowired
    private ProductOrderRepository productOrderRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TransactionService transactionService;

    @Override
    public PageResponse<ProductOrder> getOrders(Integer page, Integer size, Long userId, Integer orderStatus) {
        Page<ProductOrder> pageParam = new Page<>(page + 1, size);
        LambdaQueryWrapper<ProductOrder> queryWrapper = new LambdaQueryWrapper<>();
        
        if (userId != null) {
            queryWrapper.eq(ProductOrder::getUserId, userId);
        }
        
        if (orderStatus != null) {
            queryWrapper.eq(ProductOrder::getOrderStatus, orderStatus);
        }
        
        queryWrapper.orderByDesc(ProductOrder::getCreateTime);
        
        Page<ProductOrder> pageResult = productOrderRepository.selectPage(pageParam, queryWrapper);
        
        return new PageResponse<>(
            (int)(pageResult.getCurrent() - 1),
            (int) pageResult.getSize(),
            pageResult.getTotal(),
            pageResult.getRecords()
        );
    }

    @Override
    public ProductOrder getOrderById(Long id) {
        ProductOrder order = productOrderRepository.selectById(id);
        if (order == null) {
            throw new BusinessException("订单不存在");
        }
        return order;
    }

    @Override
    public ProductOrder createOrder(ProductOrder order) {
        order.setCreateTime(LocalDateTime.now());
        order.setUpdateTime(LocalDateTime.now());
        productOrderRepository.insert(order);
        return order;
    }

    @Override
    public ProductOrder updateOrder(Long id, ProductOrder order) {
        ProductOrder existingOrder = getOrderById(id);
        order.setId(id);
        order.setUpdateTime(LocalDateTime.now());
        productOrderRepository.updateById(order);
        return order;
    }

    @Override
    public void deleteOrder(Long id) {
        ProductOrder existingOrder = getOrderById(id);
        productOrderRepository.deleteById(id);
    }

    @Override
    public void changeOrderStatus(Long id, Integer status) {
        ProductOrder existingOrder = getOrderById(id);
        existingOrder.setOrderStatus(status);
        existingOrder.setUpdateTime(LocalDateTime.now());
        productOrderRepository.updateById(existingOrder);
    }

    @Override
    public List<ProductOrder> getUserOrders(Long userId) {
        return productOrderRepository.findOrdersByUserId(userId);
    }
    
    @Override
    public List<ProductOrder> getUserOrdersByUsername(String username) {
        // 根据用户名查询用户
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (!userOptional.isPresent()) {
            throw new BusinessException("用户不存在");
        }
        
        User user = userOptional.get();
        return getUserOrders(user.getId());
    }

    @Override
    @Transactional
    public ProductOrder purchaseProduct(Long userId, Long productId, String shippingAddress, String contactName, String contactPhone, String remark) {
        // 1. 验证用户是否存在
        User user = userRepository.selectById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        
        // 2. 验证商品是否存在
        Product product = productRepository.selectById(productId);
        if (product == null) {
            throw new BusinessException("商品不存在");
        }
        
        // 3. 验证商品是否上架
        if (product.getStatus() != 1) {
            throw new BusinessException("商品已下架");
        }
        
        // 4. 验证库存是否充足
        if (product.getStock() <= 0) {
            throw new BusinessException("商品库存不足");
        }
        
        // 5. 验证用户积分是否足够
        if (user.getPointsBalance() < product.getPoints()) {
            throw new BusinessException("积分不足");
        }
        
        // 6. 创建积分交易记录
        PointTransaction transaction = new PointTransaction();
        transaction.setUserId(userId);
        transaction.setTransactionType(2); // 消费
        transaction.setPointsChange(product.getPoints());
        transaction.setDescription("购买商品：" + product.getName());
        transaction = transactionService.createTransaction(transaction);
        
        // 7. 创建订单
        ProductOrder order = new ProductOrder();
        order.setUserId(userId);
        order.setProductId(productId);
        order.setPointsUsed(product.getPoints());
        order.setOrderStatus(1); // 待发货
        order.setShippingAddress(shippingAddress);
        order.setContactName(contactName);
        order.setContactPhone(contactPhone);
        order.setRemark(remark);
        order.setTransactionId(transaction.getId());
        order.setCreateTime(LocalDateTime.now());
        order.setUpdateTime(LocalDateTime.now());
        
        productOrderRepository.insert(order);
        
        // 8. 减少商品库存
        product.setStock(product.getStock() - 1);
        productRepository.updateById(product);
        
        return order;
    }
    
    @Override
    @Transactional
    public ProductOrder purchaseProductByUsername(String username, Long productId, String shippingAddress, String contactName, String contactPhone, String remark) {
        // 根据用户名查询用户
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (!userOptional.isPresent()) {
            throw new BusinessException("用户不存在");
        }
        
        User user = userOptional.get();
        return purchaseProduct(user.getId(), productId, shippingAddress, contactName, contactPhone, remark);
    }
} 