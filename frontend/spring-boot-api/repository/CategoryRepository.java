package com.example.personalfinancechecking.repository;

import com.example.personalfinancechecking.entity.Category;
import com.example.personalfinancechecking.entity.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    // Tim tat ca category cua user
    List<Category> findByUserId(Long userId);

    // Tim category theo user va loai
    List<Category> findByUserIdAndDefaultType(Long userId, TransactionType defaultType);

    // Kiem tra ten category da ton tai chua
    boolean existsByUserIdAndName(Long userId, String name);

    // Kiem tra ten category da ton tai chua (tru 1 category)
    boolean existsByUserIdAndNameAndIdNot(Long userId, String name, Long id);
}
