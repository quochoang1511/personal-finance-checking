package com.example.personalfinancechecking.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long transactionId;

    private BigDecimal amount;
    @Column(name = "description", columnDefinition = "NVARCHAR(50)")
    private String description;

    private LocalDateTime transactionDate = LocalDateTime.now();
    @Column(name = "type", columnDefinition = "NVARCHAR(50)")
    private String type;

    private Long userId;

    private Long categoryId;
}