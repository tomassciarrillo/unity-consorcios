package com.unity.backend.repository;


import com.unity.backend.model.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    List<Announcement> findByBuildingIdOrderByCreatedAtDesc(Long buildingId);
}