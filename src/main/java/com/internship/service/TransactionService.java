package com.internship.service;

<<<<<<< HEAD
import com.internship.dto.PageResponse;
import com.internship.entity.PointTransaction;

public interface TransactionService {
    PageResponse<PointTransaction> getTransactions(Integer page, Integer size, Long userId, Integer transactionType);
    PointTransaction getTransactionById(Long id);
    PointTransaction createTransaction(PointTransaction transaction);
    PointTransaction updateTransaction(Long id, PointTransaction transaction);
    void deleteTransaction(Long id);
=======
import com.internship.entity.Transaction;
import java.util.List;

public interface TransactionService {
    List<Transaction> getAllTransactions();
    Transaction getTransactionById(Long id);
    Transaction createTransaction(Transaction transaction);
    Transaction updateTransaction(Long id, Transaction transaction);
    void deleteTransaction(Long id);
    List<Transaction> getTransactionsByUserId(String userId);
>>>>>>> ecb1823576adb48f04118c7cefec2dd94e3ef73e
}
