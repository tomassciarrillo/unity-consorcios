package com.unity.backend.service;

import com.unity.backend.model.Building;
import com.unity.backend.model.CommonArea;
import com.unity.backend.repository.BuildingRepository;
import com.unity.backend.repository.CommonAreaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@RequiredArgsConstructor
public class CommonAreaService {

    private final CommonAreaRepository commonAreaRepository;
    private final BuildingRepository buildingRepository;

    @Transactional
    public CommonArea addCommonAreaToBuilding ( Long buildingId , String name) {

        Building building = buildingRepository.findById(buildingId)
                .orElseThrow(() -> new RuntimeException("Building not found"));

        CommonArea commonArea = new CommonArea();
        commonArea.setName(name);
        commonArea.setBuilding(building);

        return  commonAreaRepository.save(commonArea);
    }

    @Transactional (readOnly = true)
    public List<CommonArea> getCommonAreasByBuilding(Long buildingId) {
        Building building =  buildingRepository.findById(buildingId)
                .orElseThrow(() -> new RuntimeException("Building not found"));

        return commonAreaRepository.findByBuilding(building);
    }

}
