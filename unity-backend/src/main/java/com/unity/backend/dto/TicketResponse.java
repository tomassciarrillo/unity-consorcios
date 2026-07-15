package com.unity.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TicketResponse {

    private Long id;
    private String title;
    private String description;
    private String status;
    private LocalDateTime createdAt;
    private String userName;
    private String apartment;
    private String buildingName;
}
