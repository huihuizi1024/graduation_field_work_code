package com.internship.controller;

import com.internship.dto.ApiResponse;
import com.internship.dto.PageResponse;
import com.internship.entity.PointTransaction;
import com.internship.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "交易管理", description = "积分交易记录管理")
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @Operation(summary = "获取交易记录", description = "分页查询交易记录")
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<PointTransaction>>> getTransactions(
            @Parameter(description = "页码") @RequestParam(defaultValue = "0") Integer page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") Integer size,
            @Parameter(description = "用户ID") @RequestParam(required = false) Long userId,
            @Parameter(description = "交易类型") @RequestParam(required = false) Integer transactionType) {
        PageResponse<PointTransaction> pageResponse = transactionService.getTransactions(page, size, userId, transactionType);
        return ResponseEntity.ok(ApiResponse.success(pageResponse));
    }

    @Operation(summary = "获取交易详情", description = "根据ID获取交易详情")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PointTransaction>> getTransactionById(
            @Parameter(description = "交易ID") @PathVariable Long id) {
        PointTransaction transaction = transactionService.getTransactionById(id);
        return ResponseEntity.ok(ApiResponse.success(transaction));
    }

    @Operation(summary = "创建交易记录", description = "创建新的积分交易记录")
    @PostMapping
    public ResponseEntity<ApiResponse<PointTransaction>> createTransaction(
            @RequestBody PointTransaction transaction) {
        PointTransaction created = transactionService.createTransaction(transaction);
        return ResponseEntity.ok(ApiResponse.success("交易记录创建成功", created));
    }

    @Operation(summary = "更新交易记录", description = "更新交易记录信息")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PointTransaction>> updateTransaction(
            @Parameter(description = "交易ID") @PathVariable Long id,
            @RequestBody PointTransaction transaction) {
        PointTransaction updated = transactionService.updateTransaction(id, transaction);
        return ResponseEntity.ok(ApiResponse.success("交易记录更新成功", updated));
    }

    @Operation(summary = "删除交易记录", description = "删除指定交易记录")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTransaction(
            @Parameter(description = "交易ID") @PathVariable Long id) {
        transactionService.deleteTransaction(id);
        return ResponseEntity.ok(ApiResponse.<Void>success("交易记录删除成功"));
    }
}
