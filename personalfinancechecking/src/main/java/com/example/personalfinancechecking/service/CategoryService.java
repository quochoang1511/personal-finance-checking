package com.example.personalfinancechecking.service;

import org.springframework.stereotype.Service;
import com.example.personalfinancechecking.entity.Category;
import com.example.personalfinancechecking.repository.CategoryRepository;
import java.util.List;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public Category CreateCategory(Category category, Long userId) {
        return categoryRepository.CreateCategory(category, userId);
    }

    public List<Category> getCategoriesByUserId(Long userId) {
        return categoryRepository.findByUserId(userId);
    }

    public List<Category> GetCategoriesByCateId(Long cate_id) {
        return categoryRepository.getCateByCateId(cate_id);
    }

    public void deleteCategory(Long categoryId) {
        categoryRepository.deleteById(categoryId);
    }

}
