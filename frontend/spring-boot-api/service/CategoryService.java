package com.example.personalfinancechecking.service;

import com.example.personalfinancechecking.dto.CategoryDTO;
import com.example.personalfinancechecking.dto.CreateCategoryRequest;
import com.example.personalfinancechecking.entity.*;
import com.example.personalfinancechecking.repository.CategoryRepository;
import com.example.personalfinancechecking.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public CategoryService(CategoryRepository categoryRepository, UserRepository userRepository) {
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    // Convert Entity to DTO
    private CategoryDTO toDTO(Category category) {
        return CategoryDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .defaultType(category.getDefaultType())
                .userId(category.getUser().getId())
                .build();
    }

    // Lay tat ca category cua user
    public ApiResponse getAllCategories(Long userId) {
        List<Category> categories = categoryRepository.findByUserId(userId);
        List<CategoryDTO> dtos = categories.stream().map(this::toDTO).collect(Collectors.toList());
        return new ApiResponse(true, "Categories retrieved successfully", dtos);
    }

    // Lay category theo loai (INCOME/EXPENSE)
    public ApiResponse getCategoriesByType(Long userId, TransactionType type) {
        List<Category> categories = categoryRepository.findByUserIdAndDefaultType(userId, type);
        List<CategoryDTO> dtos = categories.stream().map(this::toDTO).collect(Collectors.toList());
        return new ApiResponse(true, "Categories retrieved successfully", dtos);
    }

    // Lay chi tiet category
    public ApiResponse getCategoryById(Long userId, Long categoryId) {
        Category category = categoryRepository.findById(categoryId).orElse(null);
        
        if (category == null) {
            return new ApiResponse(false, "Category not found", null);
        }
        
        if (!category.getUser().getId().equals(userId)) {
            return new ApiResponse(false, "Unauthorized access", null);
        }
        
        return new ApiResponse(true, "Category found", toDTO(category));
    }

    // Tao category moi
    public ApiResponse createCategory(Long userId, CreateCategoryRequest request) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return new ApiResponse(false, "User not found", null);
        }

        // Kiem tra ten category da ton tai chua
        boolean exists = categoryRepository.existsByUserIdAndName(userId, request.getName());
        if (exists) {
            return new ApiResponse(false, "Category name already exists", null);
        }

        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .defaultType(request.getDefaultType())
                .user(user)
                .build();

        Category saved = categoryRepository.save(category);
        return new ApiResponse(true, "Category created successfully", toDTO(saved));
    }

    // Cap nhat category
    public ApiResponse updateCategory(Long userId, Long categoryId, CreateCategoryRequest request) {
        Category category = categoryRepository.findById(categoryId).orElse(null);
        
        if (category == null) {
            return new ApiResponse(false, "Category not found", null);
        }
        
        if (!category.getUser().getId().equals(userId)) {
            return new ApiResponse(false, "Unauthorized access", null);
        }

        // Kiem tra ten moi da ton tai chua (tru chinh no)
        boolean exists = categoryRepository.existsByUserIdAndNameAndIdNot(userId, request.getName(), categoryId);
        if (exists) {
            return new ApiResponse(false, "Category name already exists", null);
        }

        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setDefaultType(request.getDefaultType());

        Category updated = categoryRepository.save(category);
        return new ApiResponse(true, "Category updated successfully", toDTO(updated));
    }

    // Xoa category
    public ApiResponse deleteCategory(Long userId, Long categoryId) {
        Category category = categoryRepository.findById(categoryId).orElse(null);
        
        if (category == null) {
            return new ApiResponse(false, "Category not found", null);
        }
        
        if (!category.getUser().getId().equals(userId)) {
            return new ApiResponse(false, "Unauthorized access", null);
        }

        categoryRepository.delete(category);
        return new ApiResponse(true, "Category deleted successfully", null);
    }
}
