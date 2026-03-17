package com.example.personalfinancechecking.dto;

import com.example.personalfinancechecking.entity.TransactionType;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateCategoryRequest {

    @NotBlank(message = "Category name is required")
    private String name;

    private String description;

    private TransactionType defaultType;
}
