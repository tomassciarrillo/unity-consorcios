package com.unity.backend.controller;

import com.unity.backend.dto.AnnouncementRequest;
import com.unity.backend.dto.AnnouncementResponse;
import com.unity.backend.model.Announcement;
import com.unity.backend.service.AnnouncementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/announcements")
@RequiredArgsConstructor
public class AnnouncementController {

    private final AnnouncementService announcementService;

    @PostMapping
    public ResponseEntity<AnnouncementResponse> create (@RequestBody AnnouncementRequest request) {
        Announcement announcement = announcementService.createAnnouncement(request);

        AnnouncementResponse res = new AnnouncementResponse();
        res.setId(announcement.getId());
        res.setTitle(announcement.getTitle());
        res.setContent(announcement.getContent());
        res.setCreatedAt(announcement.getCreatedAt());

        return ResponseEntity.ok(res);
    }

    @GetMapping("/building/{buildingId}")
    public ResponseEntity<List<AnnouncementResponse>> getByBuildingId (@PathVariable Long buildingId) {
        List<Announcement> announcements = announcementService.getAnnouncementsByBuilding(buildingId);

        List<AnnouncementResponse> response = announcements.stream().map(a -> {
            AnnouncementResponse res = new AnnouncementResponse();
            res.setId(a.getId());
            res.setTitle(a.getTitle());
            res.setContent(a.getContent());
            res.setCreatedAt(a.getCreatedAt());
            return res;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

}
