package com.unity.backend.repository;

import com.unity.backend.model.Unit;
import com.unity.backend.model.Building;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UnitRepository extends JpaRepository<Unit, Long> {


    Optional<Unit> findByFloorAndApartmentNumberAndBuilding(String floor, String apartmentNumber, Building building);
}