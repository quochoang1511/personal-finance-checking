package com.example.personalfinancechecking.service;

import org.springframework.stereotype.Service;
import com.example.personalfinancechecking.entity.Category;
import com.example.personalfinancechecking.repository.CategoryRepository;
import com.example.personalfinancechecking.entity.APIResponse;
import java.util.List;
@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public APIResponse getAllCategories() throws Exception {
        try {
            List<Category> models = categoryRepository.findAll();
            return new APIResponse(true, "Lấy thông tin thành công", models);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    public APIResponse addCategory(Category category) throws Exception {
        try {
            // Validation
            if (category == null) {
                return new APIResponse(false, "Danh mục không được null", null);
            }
            if (category.getUserId() == null) {
                return new APIResponse(false, "UserId không được để trống", null);
            }
            if (category.getName() == null || category.getName().trim().isEmpty()) {
                return new APIResponse(false, "Tên danh mục không được để trống", null);
            }
            if (category.getType() == null || category.getType().trim().isEmpty()) {
                return new APIResponse(false, "Type không được để trống", null);
            }
            category.setCategoryId(null); // hoặc setId(null) tùy tên field thực tế
            // Save vào database
            var savedCategory = categoryRepository.save(category);
            return new APIResponse(true, "Thêm danh mục thành công", savedCategory);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    public APIResponse getCategoryById(Long id) {
        try {
            if (id == null || id <= 0) {
                return new APIResponse(false, "ID user không hợp lệ", null);
            }

            var category = categoryRepository.findById(id);
            if (category.isEmpty()) {
                return new APIResponse(false, "Không tìm thấy danh mục với ID: " + id, null);
            }

            return new APIResponse(true, "Lấy thông tin danh mục thành công", category.get());
        } catch (Exception e) {
            return new APIResponse(false, "Lỗi khi lấy danh mục: " + e.getMessage(), null);
        }
    }

    
    public APIResponse getCategoryByUserId(Long id) {
        try {
            if (id == null || id <= 0) {
                return new APIResponse(false, "ID danh mục không hợp lệ", null);
            }

            List<Category> category = categoryRepository.findByUserId(id);
            if (category.isEmpty()) {
                return new APIResponse(false, "Không tìm thấy danh mục với ID: " + id, null);
            }

            return new APIResponse(true, "Lấy thông tin danh mục thành công", category);
        } catch (Exception e) {
            return new APIResponse(false, "Lỗi khi lấy danh mục: " + e.getMessage(), null);
        }
    }

    public APIResponse updateCategory(Long id, Category updatedCategory) throws Exception {
        try {
            // Validation
            if (id == null || id <= 0) {
                return new APIResponse(false, "ID danh mục không hợp lệ", null);
            }
            if (updatedCategory == null) {
                return new APIResponse(false, "Dữ liệu danh mục không được null", null);
            }
            if (updatedCategory.getName() == null) {
                return new APIResponse(false, "Tên danh mục không được để trống", null);
            }
            if (updatedCategory.getType() == null || updatedCategory.getType().trim().isEmpty()) {
                return new APIResponse(false, "Type không được để trống", null);
            }
            // Tìm category cũ
            var optionalCategory = categoryRepository.findById(id);
            if (optionalCategory.isEmpty()) {
                return new APIResponse(false, "Không tìm thấy danh mục với ID: " + id, null);
            }

            Category existing = optionalCategory.get();
            // Kiểm tra quyền sở hữu (rất quan trọng)
            if (!existing.getUserId().equals(updatedCategory.getUserId())) {
                return new APIResponse(false, "Bạn không có quyền cập nhật danh mục này", null);
            }
            // Cập nhật các trường cho phép thay đổi
            existing.setName(updatedCategory.getName().trim());
            existing.setType(updatedCategory.getType());
            existing.setDescription(updatedCategory.getDescription());
            // Lưu lại
            var savedCategory = categoryRepository.save(existing);
            return new APIResponse(true, "Cập nhật danh mục thành công", savedCategory);
        } catch (Exception e) {
            throw new Exception("Lỗi khi cập nhật danh mục: " + e.getMessage());
        }
    }

    public APIResponse deleteCategory(Long id) {
        try {
            if (id == null || id <= 0) {
                return new APIResponse(false, "ID danh mục không hợp lệ", null);
            }

            var optionalCategory = categoryRepository.findById(id);
            if (optionalCategory.isEmpty()) {
                return new APIResponse(false, "Không tìm thấy danh mục với ID: " + id, null);
            }

            categoryRepository.deleteById(id);

            return new APIResponse(true, "Xóa danh mục thành công", null);
        } catch (Exception e) {
            return new APIResponse(false, "Lỗi khi xóa danh mục: " + e.getMessage(), null);
        }
    }

}
