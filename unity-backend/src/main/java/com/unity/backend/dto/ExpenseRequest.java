package com.unity.backend.dto;

import lombok.Data;

@Data
public class ExpenseRequest {
    private Long buildingId;
    private String description;
    private Double totalAmount;
}