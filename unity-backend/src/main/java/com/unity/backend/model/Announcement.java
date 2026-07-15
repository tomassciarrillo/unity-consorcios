package com.unity.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table (name= "announcements")
@Data
public class Announcement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1500)
    private String content;

    private LocalDateTime createdAt= LocalDateTime.now();

    @ManyToOne
    @JoinColumn( name = "building_id" , nullable = false)
    private Building building;
}
