package com.internship.service.impl;

import com.internship.dto.PageResponse;
import com.internship.entity.PointTransaction;
import com.internship.entity.User;
import com.internship.repository.TransactionRepository;
import com.internship.repository.UserRepository;
import com.internship.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionServiceImpl implements TransactionService {

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
    public PointTransaction createTransaction(PointTransaction transaction) {
        // 获取用户当前积分
        User user = userRepository.selectById(transaction.getUserId());
        double currentBalance = user.getPointsBalance();
        double newBalance = currentBalance;
        
        // 根据交易类型计算新余额
        switch(transaction.getTransactionType()) {
            case 1: // 获得积分
                newBalance = currentBalance + transaction.getPointsChange();
                break;
            case 2: // 消费积分
                newBalance = currentBalance - transaction.getPointsChange();
                break;
            case 3: // 积分过期
                newBalance = currentBalance - transaction.getPointsChange();
                break;
        }
        
        // 设置交易后的余额
        transaction.setBalanceAfter(newBalance);
        
        // 更新用户积分
        user.setPointsBalance(newBalance);
        userRepository.updateById(user);
        
        transactionRepository.insert(transaction);
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
}
