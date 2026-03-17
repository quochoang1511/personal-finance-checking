package com.example.personalfinancechecking.service;

import com.example.personalfinancechecking.dto.StatisticsDTO;
import com.example.personalfinancechecking.entity.ApiResponse;
import com.example.personalfinancechecking.entity.TransactionType;
import com.example.personalfinancechecking.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;

@Service
@Transactional(readOnly = true)
public class StatisticsService {

    private final TransactionRepository transactionRepository;

    private static final String[] MONTH_NAMES = {
            "T1", "T2", "T3", "T4", "T5", "T6",
            "T7", "T8", "T9", "T10", "T11", "T12"
    };

    public StatisticsService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    // Lay thong ke tong quan
    public ApiResponse getSummary(Long userId) {
        BigDecimal totalIncome = transactionRepository.sumByUserIdAndType(userId, TransactionType.INCOME);
        BigDecimal totalExpense = transactionRepository.sumByUserIdAndType(userId, TransactionType.EXPENSE);
        Long transactionCount = transactionRepository.countByUserId(userId);

        BigDecimal balance = totalIncome.subtract(totalExpense);

        StatisticsDTO summary = StatisticsDTO.builder()
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .balance(balance)
                .transactionCount(transactionCount)
                .build();

        return new ApiResponse(true, "Summary retrieved successfully", summary);
    }

    // Lay thong ke tong quan theo khoang thoi gian
    public ApiResponse getSummaryByDateRange(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        BigDecimal totalIncome = transactionRepository.sumByUserIdAndTypeAndDateRange(
                userId, TransactionType.INCOME, startDate, endDate);
        BigDecimal totalExpense = transactionRepository.sumByUserIdAndTypeAndDateRange(
                userId, TransactionType.EXPENSE, startDate, endDate);
        
        BigDecimal balance = totalIncome.subtract(totalExpense);

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalIncome", totalIncome);
        summary.put("totalExpense", totalExpense);
        summary.put("balance", balance);
        summary.put("startDate", startDate);
        summary.put("endDate", endDate);

        return new ApiResponse(true, "Summary retrieved successfully", summary);
    }

    // Lay du lieu theo thang (cho bieu do cot)
    public ApiResponse getMonthlyData(Long userId, int year) {
        List<Object[]> rawData = transactionRepository.sumByMonthAndType(userId, year);
        
        // Khoi tao du lieu cho tat ca cac thang
        Map<Integer, StatisticsDTO.MonthlyData> monthlyMap = new LinkedHashMap<>();
        for (int i = 1; i <= 12; i++) {
            monthlyMap.put(i, StatisticsDTO.MonthlyData.builder()
                    .month(MONTH_NAMES[i - 1])
                    .monthNumber(i)
                    .income(BigDecimal.ZERO)
                    .expense(BigDecimal.ZERO)
                    .build());
        }

        // Dien du lieu tu database
        for (Object[] row : rawData) {
            Integer month = (Integer) row[0];
            TransactionType type = (TransactionType) row[1];
            BigDecimal amount = (BigDecimal) row[2];

            StatisticsDTO.MonthlyData data = monthlyMap.get(month);
            if (type == TransactionType.INCOME) {
                data.setIncome(amount);
            } else {
                data.setExpense(amount);
            }
        }

        List<StatisticsDTO.MonthlyData> result = new ArrayList<>(monthlyMap.values());
        return new ApiResponse(true, "Monthly data retrieved successfully", result);
    }

    // Lay thong ke theo category (cho bieu do tron)
    public ApiResponse getCategoryStats(Long userId, TransactionType type, int year, Integer month) {
        LocalDateTime startDate;
        LocalDateTime endDate;

        if (month != null) {
            YearMonth yearMonth = YearMonth.of(year, month);
            startDate = yearMonth.atDay(1).atStartOfDay();
            endDate = yearMonth.atEndOfMonth().atTime(23, 59, 59);
        } else {
            startDate = LocalDateTime.of(year, 1, 1, 0, 0, 0);
            endDate = LocalDateTime.of(year, 12, 31, 23, 59, 59);
        }

        List<Object[]> rawData = transactionRepository.sumByCategoryAndDateRange(userId, type, startDate, endDate);

        // Tinh tong de tinh phan tram
        BigDecimal total = rawData.stream()
                .map(row -> (BigDecimal) row[2])
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<StatisticsDTO.CategoryStat> stats = new ArrayList<>();
        for (Object[] row : rawData) {
            Long categoryId = (Long) row[0];
            String categoryName = (String) row[1];
            BigDecimal amount = (BigDecimal) row[2];
            
            Double percentage = total.compareTo(BigDecimal.ZERO) > 0
                    ? amount.divide(total, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)).doubleValue()
                    : 0.0;

            stats.add(StatisticsDTO.CategoryStat.builder()
                    .categoryId(categoryId)
                    .categoryName(categoryName != null ? categoryName : "Khong phan loai")
                    .amount(amount)
                    .percentage(percentage)
                    .build());
        }

        // Sap xep theo so tien giam dan
        stats.sort((a, b) -> b.getAmount().compareTo(a.getAmount()));

        return new ApiResponse(true, "Category stats retrieved successfully", stats);
    }

    // Lay tong quan dashboard (tat ca thong tin can thiet)
    public ApiResponse getDashboardData(Long userId, int year) {
        // Summary
        BigDecimal totalIncome = transactionRepository.sumByUserIdAndType(userId, TransactionType.INCOME);
        BigDecimal totalExpense = transactionRepository.sumByUserIdAndType(userId, TransactionType.EXPENSE);
        Long transactionCount = transactionRepository.countByUserId(userId);
        BigDecimal balance = totalIncome.subtract(totalExpense);

        // Monthly data
        List<Object[]> monthlyRaw = transactionRepository.sumByMonthAndType(userId, year);
        Map<Integer, StatisticsDTO.MonthlyData> monthlyMap = new LinkedHashMap<>();
        for (int i = 1; i <= 12; i++) {
            monthlyMap.put(i, StatisticsDTO.MonthlyData.builder()
                    .month(MONTH_NAMES[i - 1])
                    .monthNumber(i)
                    .income(BigDecimal.ZERO)
                    .expense(BigDecimal.ZERO)
                    .build());
        }
        for (Object[] row : monthlyRaw) {
            Integer month = (Integer) row[0];
            TransactionType type = (TransactionType) row[1];
            BigDecimal amount = (BigDecimal) row[2];
            StatisticsDTO.MonthlyData data = monthlyMap.get(month);
            if (type == TransactionType.INCOME) {
                data.setIncome(amount);
            } else {
                data.setExpense(amount);
            }
        }

        // Category stats for expenses
        LocalDateTime startOfYear = LocalDateTime.of(year, 1, 1, 0, 0, 0);
        LocalDateTime endOfYear = LocalDateTime.of(year, 12, 31, 23, 59, 59);
        List<Object[]> categoryRaw = transactionRepository.sumByCategoryAndDateRange(
                userId, TransactionType.EXPENSE, startOfYear, endOfYear);
        
        BigDecimal totalCategoryExpense = categoryRaw.stream()
                .map(row -> (BigDecimal) row[2])
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<StatisticsDTO.CategoryStat> categoryStats = new ArrayList<>();
        for (Object[] row : categoryRaw) {
            Long categoryId = (Long) row[0];
            String categoryName = (String) row[1];
            BigDecimal amount = (BigDecimal) row[2];
            Double percentage = totalCategoryExpense.compareTo(BigDecimal.ZERO) > 0
                    ? amount.divide(totalCategoryExpense, 4, RoundingMode.HALF_UP)
                            .multiply(BigDecimal.valueOf(100)).doubleValue()
                    : 0.0;
            categoryStats.add(StatisticsDTO.CategoryStat.builder()
                    .categoryId(categoryId)
                    .categoryName(categoryName != null ? categoryName : "Khong phan loai")
                    .amount(amount)
                    .percentage(percentage)
                    .build());
        }
        categoryStats.sort((a, b) -> b.getAmount().compareTo(a.getAmount()));

        // Build response
        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("summary", Map.of(
                "totalIncome", totalIncome,
                "totalExpense", totalExpense,
                "balance", balance,
                "transactionCount", transactionCount
        ));
        dashboard.put("monthlyData", new ArrayList<>(monthlyMap.values()));
        dashboard.put("categoryStats", categoryStats);
        dashboard.put("year", year);

        return new ApiResponse(true, "Dashboard data retrieved successfully", dashboard);
    }
}
