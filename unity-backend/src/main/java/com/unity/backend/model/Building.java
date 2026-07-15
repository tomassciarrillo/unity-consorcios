package com.unity.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "buildings")
@Data
public class Building {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String address;

    @Column(unique = true, nullable=false)
    private String accessCode;

    @OneToMany (mappedBy = "building" ,cascade = CascadeType.ALL, orphanRemoval= true)
    private List<Unit> units = new ArrayList<>();

    @OneToMany (mappedBy = "building" , cascade = CascadeType.ALL)
    private List <CommonArea> commonAreas = new ArrayList<>();



}
