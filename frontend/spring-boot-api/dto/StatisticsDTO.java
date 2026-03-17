package com.example.personalfinancechecking.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatisticsDTO {

    // Summary statistics
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal balance;
    private Long transactionCount;

    // Monthly data for charts
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MonthlyData {
        private String month;
        private int monthNumber;
        private BigDecimal income;
        private BigDecimal expense;
    }

    // Category statistics
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CategoryStat {
        private Long categoryId;
        private String categoryName;
        private BigDecimal amount;
        private Double percentage;
    }
}
