package com.unity.backend.dto;

import lombok.Data;

@Data
public class AnnouncementRequest {
    private Long buildingId;
    private String title;
    private String content;

}
