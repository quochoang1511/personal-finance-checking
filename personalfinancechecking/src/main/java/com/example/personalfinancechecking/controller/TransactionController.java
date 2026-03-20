package com.example.personalfinancechecking.controller;

import com.example.personalfinancechecking.entity.APIResponse;
import com.example.personalfinancechecking.entity.Transaction;
import com.example.personalfinancechecking.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public APIResponse getAllTransactions() throws Exception{
            APIResponse response = transactionService.getAllTransaction();
            return response;
    }

    // 2. Lấy giao dịch theo ID
    @GetMapping("/{id}")
    public APIResponse getTransactionById(@PathVariable Long id) {
        APIResponse response = transactionService.getTransactionById(id);
            return response;
    }

    @GetMapping("/user/{id}")
    public APIResponse getTransactionByUserId(@PathVariable Long id) {
        APIResponse response = transactionService.getTransactionByUserId(id);
            return response;
    }

    // 3. Tạo mới giao dịch
    @PostMapping
    public APIResponse addTransaction(@Valid @RequestBody Transaction transaction) throws Exception{
            APIResponse response = transactionService.addTransaction(transaction);
            return response;
    }

    // 4. Cập nhật giao dịch
    @PutMapping("/{id}")
    public APIResponse updateTransaction (
            @PathVariable Long id,
            @Valid @RequestBody Transaction updatedTransaction) throws Exception{
            APIResponse response = transactionService.updateTransaction(id, updatedTransaction);
            return response;
    }

    // 5. Xóa giao dịch
    @DeleteMapping("/{id}")
    public APIResponse deleteTransaction(@PathVariable Long id) {
        APIResponse response = transactionService.deleteTransaction(id);
        return response;

    }

    // 6. Lấy giao dịch theo tháng (rất quan trọng cho tính năng "view theo tháng")
    @GetMapping("/monthly")
    public APIResponse getTransactionsByMonth(
            @RequestParam Long userId,
            @RequestParam int year,
            @RequestParam int month) {
        APIResponse response = transactionService.getTransactionsByMonth(userId, year, month);
        return response;
    }
}