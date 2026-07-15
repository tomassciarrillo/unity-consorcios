package com.unity.backend.controller;

import com.unity.backend.dto.CommonAreaResponse;
import com.unity.backend.model.CommonArea;
import com.unity.backend.service.CommonAreaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/common-areas")
@RequiredArgsConstructor
public class CommonAreaController {

    private final CommonAreaService commonAreaService;

    @PostMapping
    public ResponseEntity<CommonAreaResponse> create(
            @RequestParam Long buildingId,
            @RequestParam String name) {

        CommonArea area = commonAreaService.addCommonAreaToBuilding(buildingId, name);

        CommonAreaResponse response = new CommonAreaResponse();
        response.setId(area.getId());
        response.setName(area.getName());
        response.setBuildingId(area.getBuilding().getId());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/building/{buildingId}")
    public ResponseEntity<List<CommonAreaResponse>> getByBuilding(@PathVariable Long buildingId) {
        List<CommonArea> areas = commonAreaService.getCommonAreasByBuilding(buildingId);

        List<CommonAreaResponse> dtoList = areas.stream().map(area -> {
            CommonAreaResponse res = new CommonAreaResponse();
            res.setId(area.getId());
            res.setName(area.getName());
            res.setBuildingId(area.getBuilding().getId());
            return res;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(dtoList);
    }
}