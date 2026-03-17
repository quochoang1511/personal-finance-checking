package com.example.personalfinancechecking.controller;

import com.example.personalfinancechecking.entity.ApiResponse;
import com.example.personalfinancechecking.entity.TransactionType;
import com.example.personalfinancechecking.service.StatisticsService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.Year;

@RestController
@RequestMapping("/api/statistics")
@CrossOrigin(origins = "*")
public class StatisticsController {

    private final StatisticsService statisticsService;

    public StatisticsController(StatisticsService statisticsService) {
        this.statisticsService = statisticsService;
    }

    // GET /api/statistics/summary - Thong ke tong quan
    @GetMapping("/summary")
    public ResponseEntity<ApiResponse> getSummary(@RequestHeader("X-User-Id") Long userId) {
        ApiResponse response = statisticsService.getSummary(userId);
        return ResponseEntity.ok(response);
    }

    // GET /api/statistics/summary/range - Thong ke theo khoang thoi gian
    @GetMapping("/summary/range")
    public ResponseEntity<ApiResponse> getSummaryByRange(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        ApiResponse response = statisticsService.getSummaryByDateRange(userId, startDate, endDate);
        return ResponseEntity.ok(response);
    }

    // GET /api/statistics/monthly - Du lieu theo thang (cho bieu do)
    @GetMapping("/monthly")
    public ResponseEntity<ApiResponse> getMonthlyData(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam(required = false) Integer year) {
        int targetYear = year != null ? year : Year.now().getValue();
        ApiResponse response = statisticsService.getMonthlyData(userId, targetYear);
        return ResponseEntity.ok(response);
    }

    // GET /api/statistics/by-category - Thong ke theo danh muc
    @GetMapping("/by-category")
    public ResponseEntity<ApiResponse> getCategoryStats(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam(defaultValue = "EXPENSE") TransactionType type,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {
        int targetYear = year != null ? year : Year.now().getValue();
        ApiResponse response = statisticsService.getCategoryStats(userId, type, targetYear, month);
        return ResponseEntity.ok(response);
    }

    // GET /api/statistics/dashboard - Du lieu dashboard (tat ca trong 1 API)
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse> getDashboard(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam(required = false) Integer year) {
        int targetYear = year != null ? year : Year.now().getValue();
        ApiResponse response = statisticsService.getDashboardData(userId, targetYear);
        return ResponseEntity.ok(response);
    }
}
