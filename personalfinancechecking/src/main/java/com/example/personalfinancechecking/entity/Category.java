package com.example.personalfinancechecking.entity;

import jakarta.persistence.*;
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
    private Long categoryId;

    private Long userId;

    @Column(name = "type", columnDefinition = "NVARCHAR(50)")
    private String type;

    @Column(name = "name", columnDefinition = "NVARCHAR(255)")
    private String name; 

    @Column(name = "description", columnDefinition = "NVARCHAR(1000)")
    private String description;
  
}
