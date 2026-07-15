package com.unity.backend.model;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name="expenses")
@Data
public class Expense {

    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private Double totalAmount;

    private LocalDate createdAt = LocalDate.now();

    @ManyToOne
    @JoinColumn (name= "building_id" , nullable = false)
    private Building building;
}
