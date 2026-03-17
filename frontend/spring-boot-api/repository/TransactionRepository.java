package com.example.personalfinancechecking.repository;

import com.example.personalfinancechecking.entity.Transaction;
import com.example.personalfinancechecking.entity.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // Tim tat ca giao dich cua user
    List<Transaction> findByUserIdOrderByTransactionDateDesc(Long userId);

    // Tim giao dich theo user voi phan trang
    Page<Transaction> findByUserId(Long userId, Pageable pageable);

    // Tim giao dich theo user va loai (INCOME/EXPENSE)
    Page<Transaction> findByUserIdAndType(Long userId, TransactionType type, Pageable pageable);

    // Tim giao dich theo user va category
    Page<Transaction> findByUserIdAndCategoryId(Long userId, Long categoryId, Pageable pageable);

    // Tim giao dich trong khoang thoi gian
    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId " +
           "AND t.transactionDate BETWEEN :startDate AND :endDate " +
           "ORDER BY t.transactionDate DESC")
    List<Transaction> findByUserIdAndDateRange(
            @Param("userId") Long userId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    // Tim giao dich theo user, loai va khoang thoi gian
    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId " +
           "AND t.type = :type " +
           "AND t.transactionDate BETWEEN :startDate AND :endDate " +
           "ORDER BY t.transactionDate DESC")
    List<Transaction> findByUserIdAndTypeAndDateRange(
            @Param("userId") Long userId,
            @Param("type") TransactionType type,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    // Tim kiem theo description
    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId " +
           "AND LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "ORDER BY t.transactionDate DESC")
    Page<Transaction> searchByDescription(
            @Param("userId") Long userId,
            @Param("search") String search,
            Pageable pageable
    );

    // Tinh tong theo loai giao dich
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
           "WHERE t.user.id = :userId AND t.type = :type")
    BigDecimal sumByUserIdAndType(@Param("userId") Long userId, @Param("type") TransactionType type);

    // Tinh tong theo loai va khoang thoi gian
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
           "WHERE t.user.id = :userId AND t.type = :type " +
           "AND t.transactionDate BETWEEN :startDate AND :endDate")
    BigDecimal sumByUserIdAndTypeAndDateRange(
            @Param("userId") Long userId,
            @Param("type") TransactionType type,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    // Dem so giao dich cua user
    Long countByUserId(Long userId);

    // Dem so giao dich theo loai
    Long countByUserIdAndType(Long userId, TransactionType type);

    // Lay giao dich gan nhat
    List<Transaction> findTop10ByUserIdOrderByTransactionDateDesc(Long userId);

    // Thong ke theo category
    @Query("SELECT t.category.id, t.category.name, SUM(t.amount) " +
           "FROM Transaction t " +
           "WHERE t.user.id = :userId AND t.type = :type " +
           "AND t.transactionDate BETWEEN :startDate AND :endDate " +
           "GROUP BY t.category.id, t.category.name")
    List<Object[]> sumByCategoryAndDateRange(
            @Param("userId") Long userId,
            @Param("type") TransactionType type,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );

    // Thong ke theo thang
    @Query("SELECT MONTH(t.transactionDate), t.type, SUM(t.amount) " +
           "FROM Transaction t " +
           "WHERE t.user.id = :userId " +
           "AND YEAR(t.transactionDate) = :year " +
           "GROUP BY MONTH(t.transactionDate), t.type " +
           "ORDER BY MONTH(t.transactionDate)")
    List<Object[]> sumByMonthAndType(@Param("userId") Long userId, @Param("year") int year);

    // Tim giao dich voi filter tong hop
    @Query("SELECT t FROM Transaction t WHERE t.user.id = :userId " +
           "AND (:type IS NULL OR t.type = :type) " +
           "AND (:categoryId IS NULL OR t.category.id = :categoryId) " +
           "AND (:startDate IS NULL OR t.transactionDate >= :startDate) " +
           "AND (:endDate IS NULL OR t.transactionDate <= :endDate) " +
           "AND (:search IS NULL OR LOWER(t.description) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY t.transactionDate DESC")
    Page<Transaction> findWithFilters(
            @Param("userId") Long userId,
            @Param("type") TransactionType type,
            @Param("categoryId") Long categoryId,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("search") String search,
            Pageable pageable
    );
}
