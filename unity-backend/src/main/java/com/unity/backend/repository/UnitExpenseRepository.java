package com.unity.backend.repository;

import com.unity.backend.model.UnitExpense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UnitExpenseRepository extends JpaRepository<UnitExpense, Long> {
    List<UnitExpense> findByUnitId(Long unitId);
}