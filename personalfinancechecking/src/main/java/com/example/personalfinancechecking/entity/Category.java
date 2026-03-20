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

    @Column(name = "type")
    private String type;

    @Column(name = "name")
    private String name; 

    @Column(name = "description", nullable = true)
    private String description;
  
}
