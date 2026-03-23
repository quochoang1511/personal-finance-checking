package com.example.personalfinancechecking.controller;

import com.example.personalfinancechecking.entity.ApiResponse;
import com.example.personalfinancechecking.entity.Transaction;
import com.example.personalfinancechecking.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    // 1. Lấy tất cả giao dịch (của tất cả user - chỉ dùng cho test/admin, production nên hạn chế)
    @GetMapping
    public ApiResponse getAllTransactions() throws Exception{
            ApiResponse response = transactionService.getAllTransaction();
            return response;
    }

    // 2. Lấy giao dịch theo ID
    @GetMapping("/{id}")
    public ApiResponse getTransactionById(@PathVariable Long id) {
        ApiResponse response = transactionService.getTransactionById(id);
            return response;
    }

    @GetMapping("/user/{id}")
    public ApiResponse getTransactionByUserId(@PathVariable Long id) {
        ApiResponse response = transactionService.getTransactionByUserId(id);
            return response;
    }

    // 3. Tạo mới giao dịch
    @PostMapping
    public ApiResponse addTransaction(@Valid @RequestBody Transaction transaction) throws Exception{
            ApiResponse response = transactionService.addTransaction(transaction);
            return response;
    }

    // 4. Cập nhật giao dịch
    @PutMapping("/{id}")
    public ApiResponse updateTransaction (
            @PathVariable Long id,
            @Valid @RequestBody Transaction updatedTransaction) throws Exception{
            ApiResponse response = transactionService.updateTransaction(id, updatedTransaction);
            return response;
    }

    // 5. Xóa giao dịch
    @DeleteMapping("/{id}")
    public ApiResponse deleteTransaction(@PathVariable Long id) {
        ApiResponse response = transactionService.deleteTransaction(id);
        return response;

    }

    // 6. Lấy giao dịch theo tháng (rất quan trọng cho tính năng "view theo tháng")
    @GetMapping("/monthly")
    public ApiResponse getTransactionsByMonth(
            @RequestParam Long userId,
            @RequestParam int year,
            @RequestParam int month) {
        ApiResponse response = transactionService.getTransactionsByMonth(userId, year, month);
        return response;
    }
}