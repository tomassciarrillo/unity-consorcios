package com.unity.backend.dto;


import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AnnouncementResponse {

    private Long id;
    private String title;
    private String content;
    private LocalDateTime createdAt;

}
