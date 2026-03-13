package com.example.personalfinancechecking.repository;

import com.example.personalfinancechecking.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Category CreateCategory(Category category, Long userId);
    List<Category> findByUserId(Long userId);
    List<Category> getCateByCateId(Long categoryId);
}
