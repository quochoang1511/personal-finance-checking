package com.example.personalfinancechecking.service;

import com.example.personalfinancechecking.dto.CreateTransactionRequest;
import com.example.personalfinancechecking.dto.TransactionDTO;
import com.example.personalfinancechecking.entity.*;
import com.example.personalfinancechecking.repository.CategoryRepository;
import com.example.personalfinancechecking.repository.TransactionRepository;
import com.example.personalfinancechecking.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public TransactionService(TransactionRepository transactionRepository,
                              UserRepository userRepository,
                              CategoryRepository categoryRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }

    // Convert Entity to DTO
    private TransactionDTO toDTO(Transaction transaction) {
        return TransactionDTO.builder()
                .id(transaction.getId())
                .amount(transaction.getAmount())
                .description(transaction.getDescription())
                .transactionDate(transaction.getTransactionDate())
                .type(transaction.getType())
                .userId(transaction.getUser().getId())
                .categoryId(transaction.getCategory() != null ? transaction.getCategory().getId() : null)
                .categoryName(transaction.getCategory() != null ? transaction.getCategory().getName() : null)
                .build();
    }

    // Lay tat ca giao dich cua user
    public ApiResponse getAllTransactions(Long userId) {
        List<Transaction> transactions = transactionRepository.findByUserIdOrderByTransactionDateDesc(userId);
        List<TransactionDTO> dtos = transactions.stream().map(this::toDTO).collect(Collectors.toList());
        return new ApiResponse(true, "Transactions retrieved successfully", dtos);
    }

    // Lay giao dich voi phan trang va filter
    public ApiResponse getTransactionsWithFilter(Long userId, TransactionType type, Long categoryId,
                                                  LocalDateTime startDate, LocalDateTime endDate,
                                                  String search, Pageable pageable) {
        Page<Transaction> page = transactionRepository.findWithFilters(
                userId, type, categoryId, startDate, endDate, search, pageable);
        Page<TransactionDTO> dtoPage = page.map(this::toDTO);
        return new ApiResponse(true, "Transactions retrieved successfully", dtoPage);
    }

    // Lay chi tiet giao dich
    public ApiResponse getTransactionById(Long userId, Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId).orElse(null);
        
        if (transaction == null) {
            return new ApiResponse(false, "Transaction not found", null);
        }
        
        if (!transaction.getUser().getId().equals(userId)) {
            return new ApiResponse(false, "Unauthorized access", null);
        }
        
        return new ApiResponse(true, "Transaction found", toDTO(transaction));
    }

    // Tao giao dich moi
    public ApiResponse createTransaction(Long userId, CreateTransactionRequest request) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return new ApiResponse(false, "User not found", null);
        }

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId()).orElse(null);
            if (category == null) {
                return new ApiResponse(false, "Category not found", null);
            }
        }

        Transaction transaction = Transaction.builder()
                .amount(request.getAmount())
                .description(request.getDescription())
                .transactionDate(request.getTransactionDate() != null ? 
                        request.getTransactionDate() : LocalDateTime.now())
                .type(request.getType())
                .user(user)
                .category(category)
                .build();

        Transaction saved = transactionRepository.save(transaction);
        return new ApiResponse(true, "Transaction created successfully", toDTO(saved));
    }

    // Cap nhat giao dich
    public ApiResponse updateTransaction(Long userId, Long transactionId, CreateTransactionRequest request) {
        Transaction transaction = transactionRepository.findById(transactionId).orElse(null);
        
        if (transaction == null) {
            return new ApiResponse(false, "Transaction not found", null);
        }
        
        if (!transaction.getUser().getId().equals(userId)) {
            return new ApiResponse(false, "Unauthorized access", null);
        }

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId()).orElse(null);
            if (category == null) {
                return new ApiResponse(false, "Category not found", null);
            }
        }

        transaction.setAmount(request.getAmount());
        transaction.setDescription(request.getDescription());
        transaction.setType(request.getType());
        transaction.setCategory(category);
        if (request.getTransactionDate() != null) {
            transaction.setTransactionDate(request.getTransactionDate());
        }

        Transaction updated = transactionRepository.save(transaction);
        return new ApiResponse(true, "Transaction updated successfully", toDTO(updated));
    }

    // Xoa giao dich
    public ApiResponse deleteTransaction(Long userId, Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId).orElse(null);
        
        if (transaction == null) {
            return new ApiResponse(false, "Transaction not found", null);
        }
        
        if (!transaction.getUser().getId().equals(userId)) {
            return new ApiResponse(false, "Unauthorized access", null);
        }

        transactionRepository.delete(transaction);
        return new ApiResponse(true, "Transaction deleted successfully", null);
    }

    // Lay giao dich gan nhat
    public ApiResponse getRecentTransactions(Long userId, int limit) {
        List<Transaction> transactions = transactionRepository.findTop10ByUserIdOrderByTransactionDateDesc(userId);
        List<TransactionDTO> dtos = transactions.stream()
                .limit(limit)
                .map(this::toDTO)
                .collect(Collectors.toList());
        return new ApiResponse(true, "Recent transactions retrieved", dtos);
    }
}
