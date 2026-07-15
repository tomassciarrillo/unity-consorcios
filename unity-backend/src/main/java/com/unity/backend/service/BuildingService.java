/*
package com.unity.backend.service;

import com.unity.backend.model.Building;
import com.unity.backend.model.Unit;
import com.unity.backend.repository.BuildingRepository;
import com.unity.backend.repository.UnitRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;



@Service
@RequiredArgsConstructor
public class BuildingService {

    private final BuildingRepository buildingRepository;
    private final UnitRepository unitRepository;

    @Transactional
    public Building createBuildingWithUnits( String name, String address, int floors, String[] labelsPerFloors) {

        Building building = new Building();
        building.setName(name);
        building.setAddress(address);
        building.setAccessCode(UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        Building savedBuilding = buildingRepository.save(building);

        for (int i=1 ; i<=floors; i++) {
            for  (String label : labelsPerFloors) {
                Unit unit = new Unit();
                unit.setFloor(String.valueOf(i));
                unit.setApartmentNumber(label);
                unit.setBuilding(savedBuilding);

                unitRepository.save(unit);
            }
        }

        return savedBuilding;
    }

}
*/

package com.unity.backend.service;

import com.unity.backend.model.Building;
import com.unity.backend.model.CommonArea;
import com.unity.backend.model.Unit;
import com.unity.backend.repository.BuildingRepository;
import com.unity.backend.repository.CommonAreaRepository;
import com.unity.backend.repository.UnitRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BuildingService {

    private final BuildingRepository buildingRepository;
    private final UnitRepository unitRepository;
    private final CommonAreaRepository commonAreaRepository;

    @Transactional
    public Building createBuildingWithUnits(String name, String address, int floors, String[] labelsPerFloors) {

        Building building = new Building();
        building.setName(name);
        building.setAddress(address);
        building.setAccessCode(UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        Building savedBuilding = buildingRepository.save(building);

        // Creamos automáticamente el SUM para el nuevo edificio
        CommonArea sum = new CommonArea();
        sum.setName("SUM");
        sum.setBuilding(savedBuilding);
        commonAreaRepository.save(sum);

        // Creamos automáticamente la Parrilla para el nuevo edificio
        CommonArea parrilla = new CommonArea();
        parrilla.setName("Parrilla");
        parrilla.setBuilding(savedBuilding);
        commonAreaRepository.save(parrilla);

        for (int i = 1; i <= floors; i++) {
            for (String label : labelsPerFloors) {
                Unit unit = new Unit();
                unit.setFloor(String.valueOf(i));
                unit.setApartmentNumber(label);
                unit.setBuilding(savedBuilding);

                unitRepository.save(unit);
            }
        }

        return savedBuilding;
    }
}