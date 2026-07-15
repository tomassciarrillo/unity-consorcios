package com.unity.backend.repository;

import com.unity.backend.model.CommonArea;
import com.unity.backend.model.Building;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommonAreaRepository extends JpaRepository<CommonArea, Long> {
    List<CommonArea> findByBuilding(Building building);
}

