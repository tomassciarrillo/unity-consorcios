package com.unity.backend.controller;

import com.unity.backend.dto.BuildingCreationRequest;
import com.unity.backend.model.Building;
import com.unity.backend.service.BuildingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/buildings")
@RequiredArgsConstructor
public class BuildingController {

    private final BuildingService buildingService;

    @PostMapping
    public ResponseEntity<Building> createBuilding(@RequestBody BuildingCreationRequest request){

        Building newBuilding = buildingService.createBuildingWithUnits(
                request.getName(),
                request.getAddress(),
                request.getFloors(),
                request.getLabelsPerFloor()
        );
        return ResponseEntity.ok(newBuilding);
    }

}
