package com.example.personalfinancechecking.controller;

import com.example.personalfinancechecking.dto.CreateTransactionRequest;
import com.example.personalfinancechecking.entity.ApiResponse;
import com.example.personalfinancechecking.entity.TransactionType;
import com.example.personalfinancechecking.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    // GET /api/transactions - Lay danh sach giao dich
    @GetMapping
    public ResponseEntity<ApiResponse> getTransactions(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("transactionDate").descending());
        ApiResponse response = transactionService.getTransactionsWithFilter(
                userId, type, categoryId, startDate, endDate, search, pageable);
        return ResponseEntity.ok(response);
    }

    // GET /api/transactions/all - Lay tat ca giao dich (khong phan trang)
    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllTransactions(@RequestHeader("X-User-Id") Long userId) {
        ApiResponse response = transactionService.getAllTransactions(userId);
        return ResponseEntity.ok(response);
    }

    // GET /api/transactions/recent - Lay giao dich gan nhat
    @GetMapping("/recent")
    public ResponseEntity<ApiResponse> getRecentTransactions(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam(defaultValue = "5") int limit) {
        ApiResponse response = transactionService.getRecentTransactions(userId, limit);
        return ResponseEntity.ok(response);
    }

    // GET /api/transactions/{id} - Lay chi tiet giao dich
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getTransaction(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id) {
        ApiResponse response = transactionService.getTransactionById(userId, id);
        return ResponseEntity.ok(response);
    }

    // POST /api/transactions - Tao giao dich moi
    @PostMapping
    public ResponseEntity<ApiResponse> createTransaction(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody CreateTransactionRequest request) {
        ApiResponse response = transactionService.createTransaction(userId, request);
        return ResponseEntity.ok(response);
    }

    // PUT /api/transactions/{id} - Cap nhat giao dich
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateTransaction(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id,
            @Valid @RequestBody CreateTransactionRequest request) {
        ApiResponse response = transactionService.updateTransaction(userId, id, request);
        return ResponseEntity.ok(response);
    }

    // DELETE /api/transactions/{id} - Xoa giao dich
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteTransaction(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id) {
        ApiResponse response = transactionService.deleteTransaction(userId, id);
        return ResponseEntity.ok(response);
    }
}
