package com.unity.backend.dto;


import lombok.Data;

@Data
public class TicketRequest {

    private Long userId;
    private String title;
    private String description;
}
