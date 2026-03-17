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
    public ResponseEntity<APIResponse> getAllTransactions() {
        try {
            APIResponse response = transactionService.getAllTransaction();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new APIResponse(false, "Lỗi server: " + e.getMessage(), null));
        }
    }

    // 2. Lấy giao dịch theo ID
    @GetMapping("/{id}")
    public ResponseEntity<APIResponse> getTransactionById(@PathVariable Long id) {
        APIResponse response = transactionService.getTransactionById(id);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    // 3. Tạo mới giao dịch
    @PostMapping
    public ResponseEntity<APIResponse> addTransaction(@Valid @RequestBody Transaction transaction) {
        try {
            APIResponse response = transactionService.addTransaction(transaction);
            if (response.isSuccess()) {
                return ResponseEntity.status(HttpStatus.CREATED).body(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new APIResponse(false, "Lỗi khi thêm giao dịch: " + e.getMessage(), null));
        }
    }

    // 4. Cập nhật giao dịch
    @PutMapping("/{id}")
    public ResponseEntity<APIResponse> updateTransaction(
            @PathVariable Long id,
            @Valid @RequestBody Transaction updatedTransaction) {
        try {
            APIResponse response = transactionService.updateCategory(id, updatedTransaction);
            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new APIResponse(false, "Lỗi khi cập nhật giao dịch: " + e.getMessage(), null));
        }
    }

    // 5. Xóa giao dịch
    @DeleteMapping("/{id}")
    public ResponseEntity<APIResponse> deleteTransaction(@PathVariable Long id) {
        APIResponse response = transactionService.deleteTransaction(id);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);  // 200 OK, hoặc bạn có thể dùng 204 No Content
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    // 6. Lấy giao dịch theo tháng (rất quan trọng cho tính năng "view theo tháng")
    @GetMapping("/monthly")
    public ResponseEntity<APIResponse> getTransactionsByMonth(
            @RequestParam Long userId,
            @RequestParam int year,
            @RequestParam int month) {

        if (userId == null || userId <= 0) {
            return ResponseEntity.badRequest()
                    .body(new APIResponse(false, "UserId không hợp lệ", null));
        }
        if (year < 1900 || month < 1 || month > 12) {
            return ResponseEntity.badRequest()
                    .body(new APIResponse(false, "Năm hoặc tháng không hợp lệ", null));
        }

        APIResponse response = transactionService.getTransactionsByMonth(userId, year, month);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
}