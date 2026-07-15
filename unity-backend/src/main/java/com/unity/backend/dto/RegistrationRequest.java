package com.unity.backend.dto;

import lombok.Data;

@Data
public class RegistrationRequest {

    private String email;
    private String password;
    private String fullName;
    private String accessCode;
    private String floor;
    private String apartmentNumber;
}
