package com.unity.backend.model;

import com.unity.backend.model.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table ( name ="unit_expenses")
@Data
public class UnitExpense {

    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable= false)
    private Double amount;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status= PaymentStatus.PENDING;

    @ManyToOne
    @JoinColumn(name="unit_id", nullable = false)
    private Unit unit;

    @ManyToOne
    @JoinColumn(name="expense_id", nullable = false)
    private Expense expense;

}
