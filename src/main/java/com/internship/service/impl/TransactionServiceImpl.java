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

import java.math.BigDecimal;
import java.time.LocalDateTime;
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
        if (transaction.getPointsChange() == null || transaction.getPointsChange() == 0) {
            throw new BusinessException("积分变动不能为0");
        }
        
        if (transaction.getUserId() == null) {
            throw new BusinessException("用户ID不能为空");
        }
        
        User user = userRepository.selectById(transaction.getUserId());
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        
        // 如果是减少积分，检查用户积分余额是否足够
        if (transaction.getPointsChange() < 0 && (user.getPointsBalance() == null || user.getPointsBalance() < Math.abs(transaction.getPointsChange()))) {
            throw new BusinessException("用户积分余额不足");
        }
        
        // 计算变动后余额
        BigDecimal newBalance;
        if (user.getPointsBalance() == null) {
            newBalance = new BigDecimal(transaction.getPointsChange());
        } else {
            newBalance = new BigDecimal(user.getPointsBalance()).add(new BigDecimal(transaction.getPointsChange()));
        }
        transaction.setBalanceAfter(newBalance.doubleValue());
        
        // 设置交易类型 (如果没有设置)
        if (transaction.getTransactionType() == null) {
            transaction.setTransactionType(transaction.getPointsChange() > 0 ? 1 : 2); // 1-获得，2-消费
        }
        
        // 设置交易时间
        if (transaction.getTransactionTime() == null) {
            transaction.setTransactionTime(LocalDateTime.now());
        }
        
        // 对证书获得积分进行特殊处理
        if (transaction.getRelatedId() != null && transaction.getRelatedId().startsWith("cert_")) {
            transaction.setDescription(transaction.getDescription() != null ? 
                transaction.getDescription() : "获得证书奖励积分");
            
            // 可以添加规则检查，例如每个证书只能获得一次积分
            String certId = transaction.getRelatedId().substring(5); // 去掉"cert_"前缀
            log.info("处理证书{}积分奖励，用户{}获得{}积分", certId, transaction.getUserId(), transaction.getPointsChange());
        }
        
        // 保存交易记录
        transactionRepository.insert(transaction);
        
        // 更新用户积分余额
        user.setPointsBalance(newBalance.doubleValue());
        userRepository.updateById(user);
        
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
