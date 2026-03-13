package com.example.personalfinancechecking.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;    
import lombok.*;


@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {
@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

   @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull(message = "User is required for category")
    private User user;

    @NotBlank(message = "Category name is required")
    @Column(unique = true, nullable = false)
    private String name;  // ví dụ: "Ăn uống", "Lương", "Giải trí"

    private String description;

    @Enumerated(EnumType.STRING)
    private TransactionType defaultType;
}
