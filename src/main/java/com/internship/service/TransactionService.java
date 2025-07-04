package com.internship.service;

import com.internship.dto.PageResponse;
import com.internship.entity.PointTransaction;
import java.util.List;

public interface TransactionService {
    PageResponse<PointTransaction> getTransactions(Integer page, Integer size, Long userId, Integer transactionType);
    PointTransaction getTransactionById(Long id);
    PointTransaction createTransaction(PointTransaction transaction);
    PointTransaction updateTransaction(Long id, PointTransaction transaction);
    void deleteTransaction(Long id);
    List<PointTransaction> getTransactionsByUsername(String username);

    /**
     * 检查用户是否已有指定项目的奖励交易
     * @param userId 用户ID
     * @param projectId 项目ID
     * @return 是否已有奖励交易
     */
    boolean hasRewardTransaction(Long userId, String projectId);
}
