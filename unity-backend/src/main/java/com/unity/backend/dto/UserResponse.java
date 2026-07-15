package com.unity.backend.dto;

import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String email;
    private String fullName;
    private String role;
    private String status;
    private String floor;
    private String apartmentNumber;
    private String buildingName;
}
