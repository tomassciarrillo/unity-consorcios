package com.unity.backend.dto;

import lombok.Data;

@Data
public class CommonAreaResponse {
    private Long id;
    private String name;
    private Long buildingId;
}