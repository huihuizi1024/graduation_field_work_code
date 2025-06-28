package com.internship.service;

import com.internship.dto.PageResponse;
import com.internship.entity.PointTransaction;

public interface TransactionService {
    PageResponse<PointTransaction> getTransactions(Integer page, Integer size, Long userId, Integer transactionType);
    PointTransaction getTransactionById(Long id);
    PointTransaction createTransaction(PointTransaction transaction);
    PointTransaction updateTransaction(Long id, PointTransaction transaction);
    void deleteTransaction(Long id);
}
