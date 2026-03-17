package com.example.personalfinancechecking.dto;

import com.example.personalfinancechecking.entity.TransactionType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryDTO {
    private Long id;
    private String name;
    private String description;
    private TransactionType defaultType;
    private Long userId;
}
