package com.example.personalfinancechecking.controller;

import com.example.personalfinancechecking.dto.CreateCategoryRequest;
import com.example.personalfinancechecking.entity.ApiResponse;
import com.example.personalfinancechecking.entity.TransactionType;
import com.example.personalfinancechecking.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    // GET /api/categories - Lay tat ca danh muc
    @GetMapping
    public ResponseEntity<ApiResponse> getCategories(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam(required = false) TransactionType type) {
        ApiResponse response;
        if (type != null) {
            response = categoryService.getCategoriesByType(userId, type);
        } else {
            response = categoryService.getAllCategories(userId);
        }
        return ResponseEntity.ok(response);
    }

    // GET /api/categories/{id} - Lay chi tiet danh muc
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getCategory(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id) {
        ApiResponse response = categoryService.getCategoryById(userId, id);
        return ResponseEntity.ok(response);
    }

    // POST /api/categories - Tao danh muc moi
    @PostMapping
    public ResponseEntity<ApiResponse> createCategory(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody CreateCategoryRequest request) {
        ApiResponse response = categoryService.createCategory(userId, request);
        return ResponseEntity.ok(response);
    }

    // PUT /api/categories/{id} - Cap nhat danh muc
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateCategory(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id,
            @Valid @RequestBody CreateCategoryRequest request) {
        ApiResponse response = categoryService.updateCategory(userId, id, request);
        return ResponseEntity.ok(response);
    }

    // DELETE /api/categories/{id} - Xoa danh muc
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteCategory(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long id) {
        ApiResponse response = categoryService.deleteCategory(userId, id);
        return ResponseEntity.ok(response);
    }
}
