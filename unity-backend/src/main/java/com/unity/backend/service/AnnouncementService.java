package com.unity.backend.service;

import com.unity.backend.dto.AnnouncementRequest;
import com.unity.backend.model.Announcement;
import com.unity.backend.model.Building;
import com.unity.backend.repository.AnnouncementRepository;
import com.unity.backend.repository.BuildingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@RequiredArgsConstructor
public class AnnouncementService {

    private final  AnnouncementRepository announcementRepository;
    private final BuildingRepository buildingRepository;

    @Transactional
    public Announcement createAnnouncement(AnnouncementRequest request) {

        Building building = buildingRepository.findById(request.getBuildingId())
                .orElseThrow(() -> new RuntimeException("Building not found"));

        Announcement announcement = new Announcement();
        announcement.setTitle(request.getTitle());
        announcement.setContent(request.getContent());
        announcement.setBuilding(building);

        return  announcementRepository.save(announcement);
    }

    @Transactional(readOnly = true)
    public List<Announcement> getAnnouncementsByBuilding(Long buildingId) {
        return announcementRepository.findByBuildingIdOrderByCreatedAtDesc(buildingId);
    }

}
