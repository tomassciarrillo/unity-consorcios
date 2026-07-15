package com.unity.backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class UnitExpenseResponse {
    private Long id;
    private String expenseDescription;
    private Double amount;
    private String status;
    private LocalDate date;
    private String apartment;
}