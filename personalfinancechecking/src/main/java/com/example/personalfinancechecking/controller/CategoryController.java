package com.example.personalfinancechecking.controller;

import com.example.personalfinancechecking.entity.ApiResponse;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.personalfinancechecking.service.CategoryService;
import com.example.personalfinancechecking.entity.Category;
import com.example.personalfinancechecking.entity.User;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("/api/v1/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ApiResponse getAllCategories() throws Exception {
        return categoryService.getAllCategories();
    }

    @PostMapping
    public ApiResponse addCategory(@RequestBody Category entity) throws Exception {
        return categoryService.addCategory(entity);
    }

    @GetMapping("/{id}")
    public ApiResponse getCategory(@PathVariable Long id) {
        return categoryService.getCategoryById(id);
    }

    @GetMapping("/user/{id}")
    public ApiResponse getCategoryByUserId(@PathVariable Long id) {
        return categoryService.getCategoryByUserId(id);
    }
    @PutMapping("/{id}")
    public ApiResponse updateCategory(@PathVariable Long id, @RequestBody  Category updatedCategory) throws Exception {
        return categoryService.updateCategory(id, updatedCategory);
    }

    @DeleteMapping("/{id}")
    public ApiResponse deleteCategory(@PathVariable Long id) {
        return categoryService.deleteCategory(id);
    }
}
