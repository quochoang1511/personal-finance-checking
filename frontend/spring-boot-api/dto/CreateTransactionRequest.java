package com.example.personalfinancechecking.dto;

import com.example.personalfinancechecking.entity.TransactionType;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateTransactionRequest {

    @NotNull(message = "Amount is required")
    @PositiveOrZero(message = "Amount must be non-negative")
    private BigDecimal amount;

    private String description;

    private LocalDateTime transactionDate;

    @NotNull(message = "Transaction type is required")
    private TransactionType type;

    private Long categoryId;
}
