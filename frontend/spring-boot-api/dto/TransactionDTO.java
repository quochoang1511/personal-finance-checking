package com.example.personalfinancechecking.dto;

import com.example.personalfinancechecking.entity.TransactionType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionDTO {
    private Long id;
    private BigDecimal amount;
    private String description;
    private LocalDateTime transactionDate;
    private TransactionType type;
    private Long userId;
    private Long categoryId;
    private String categoryName;
}
