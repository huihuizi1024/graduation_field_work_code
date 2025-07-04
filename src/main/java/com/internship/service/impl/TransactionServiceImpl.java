package com.internship.service.impl;

import com.internship.dto.PageResponse;
import com.internship.entity.PointTransaction;
import com.internship.entity.User;
import com.internship.exception.BusinessException;
import com.internship.repository.TransactionRepository;
import com.internship.repository.UserRepository;
import com.internship.service.TransactionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionServiceImpl implements TransactionService {

    private static final Logger log = LoggerFactory.getLogger(TransactionServiceImpl.class);

    @Autowired
    private TransactionRepository transactionRepository;
    
    @Autowired
    private UserRepository userRepository;

    @Override
    public PageResponse<PointTransaction> getTransactions(Integer page, Integer size, Long userId, Integer transactionType) {
        com.baomidou.mybatisplus.extension.plugins.pagination.Page<PointTransaction> mpPage = 
            new com.baomidou.mybatisplus.extension.plugins.pagination.Page<>(page , size);
        
        if (userId != null && transactionType != null) {
            transactionRepository.findByUserIdAndTransactionType(userId, transactionType, mpPage);
        } else if (userId != null) {
            transactionRepository.findByUserId(userId, mpPage);
        } else if (transactionType != null) {
            transactionRepository.findByTransactionType(transactionType, mpPage);
        } else {
            transactionRepository.selectPage(mpPage, null);
        }

        return new PageResponse<PointTransaction>(
            Integer.valueOf((int)(mpPage.getCurrent() - 1)), 
            Integer.valueOf((int)mpPage.getSize()), 
            Long.valueOf(mpPage.getTotal()),
            mpPage.getRecords()
        );
    }

    @Override
    public PointTransaction getTransactionById(Long id) {
        return transactionRepository.selectById(id);
    }

    @Override
    @Transactional
    public PointTransaction createTransaction(PointTransaction transaction) {
        log.info("开始创建积分交易记录 - 用户ID: {}, 交易类型: {}, 积分变化: {}", 
                transaction.getUserId(), transaction.getTransactionType(), transaction.getPointsChange());
                
        // 获取用户当前积分，加锁读取确保一致性
        User user = userRepository.selectById(transaction.getUserId());
        double currentBalance = user.getPointsBalance();
        double newBalance = currentBalance;
        
        log.info("用户当前积分余额: {}", currentBalance);
        
        // 根据交易类型计算新余额
        switch(transaction.getTransactionType()) {
            case 1: // 获得积分
                newBalance = currentBalance + transaction.getPointsChange();
                log.info("交易类型: 获得积分, 新余额将更新为: {}", newBalance);
                break;
            case 2: // 消费积分
                newBalance = currentBalance - transaction.getPointsChange();
                log.info("交易类型: 消费积分, 新余额将更新为: {}", newBalance);
                break;
            case 3: // 积分过期
                newBalance = currentBalance - transaction.getPointsChange();
                log.info("交易类型: 积分过期, 新余额将更新为: {}", newBalance);
                break;
        }
        
        // 设置交易后的余额
        transaction.setBalanceAfter(newBalance);
        
        // 更新用户积分
        user.setPointsBalance(newBalance);
        userRepository.updateById(user);
        log.info("已更新用户积分余额 - 用户ID: {}, 新余额: {}", transaction.getUserId(), newBalance);
        
        transactionRepository.insert(transaction);
        log.info("积分交易记录创建成功 - 交易ID: {}, 用户ID: {}, 积分变化: {}, 余额: {}, 描述: {}", 
                transaction.getId(), transaction.getUserId(), transaction.getPointsChange(), 
                transaction.getBalanceAfter(), transaction.getDescription());
                
        return transaction;
    }

    @Override
    public PointTransaction updateTransaction(Long id, PointTransaction transaction) {
        transaction.setId(id);
        transactionRepository.updateById(transaction);
        return transaction;
    }

    @Override
    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }
    
    @Override
    public List<PointTransaction> getTransactionsByUsername(String username) {
        // 根据用户名查询用户
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (!userOptional.isPresent()) {
            throw new BusinessException("用户不存在");
        }
        
        User user = userOptional.get();
        Long userId = user.getId();
        
        // 查询该用户的所有交易记录
        return transactionRepository.findByUserIdOrderByCreateTimeDesc(userId);
    }

    @Override
    public boolean hasRewardTransaction(Long userId, String projectId) {
        try {
            // 查询与项目相关的积分交易记录
            List<PointTransaction> transactions = transactionRepository.findByUserIdAndRelatedId(userId, projectId);
            
            // 检查是否有获得积分类型的交易
            return transactions != null && transactions.stream()
                .anyMatch(t -> t.getTransactionType() != null && t.getTransactionType() == 1); // 1-获得积分
        } catch (Exception e) {
            log.error("检查项目奖励交易记录失败 - 用户ID: {}, 项目ID: {}", userId, projectId, e);
            return false; // 出错时返回false，避免重复奖励
        }
    }
}
