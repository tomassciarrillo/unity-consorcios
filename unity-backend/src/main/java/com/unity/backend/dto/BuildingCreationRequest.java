package com.unity.backend.dto;

import lombok.Data;

@Data
public class BuildingCreationRequest {
    private String name;
    private String address;
    private int floors;
    private String[] labelsPerFloor;
}
