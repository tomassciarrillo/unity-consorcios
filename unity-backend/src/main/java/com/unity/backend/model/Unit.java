package com.unity.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

import com.unity.backend.model.User;

@Entity
@Table(name= "units")
@Data
public class Unit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String floor;
    private String apartmentNumber;

    @ManyToOne (fetch = FetchType.LAZY)
    @JoinColumn(name= "building_id", nullable = false)
    private Building building;

    @OneToMany(mappedBy = "unit")
    private List<User> residents = new ArrayList<>();
}
