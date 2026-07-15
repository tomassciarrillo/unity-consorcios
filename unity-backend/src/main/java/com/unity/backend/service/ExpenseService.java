package com.unity.backend.service;


import com.unity.backend.dto.ExpenseRequest;
import com.unity.backend.model.*;
import com.unity.backend.model.enums.PaymentStatus;
import com.unity.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UnitExpenseRepository unitExpenseRepository;
    private final BuildingRepository buildingRepository;

    @Transactional
    public Expense distributeExpense ( ExpenseRequest request) {
        Building building = buildingRepository.findById(request.getBuildingId())
                .orElseThrow(()-> new RuntimeException("Building not found."));

        List<Unit> units = building.getUnits();
        if (units.isEmpty()){
            throw new  RuntimeException("This building has no units to distribute expenses.");
        }

        Expense expense = new Expense();
        expense.setDescription(request.getDescription());
        expense.setTotalAmount(request.getTotalAmount());
        expense.setBuilding(building);
        Expense savedExpense = expenseRepository.save(expense);


        Double amountPerUnit = request.getTotalAmount() / units.size();

        for (Unit unit : units) {
            UnitExpense unitExpense = new UnitExpense();
            unitExpense.setAmount(amountPerUnit);
            unitExpense.setUnit(unit);
            unitExpense.setStatus(PaymentStatus.PENDING);
            unitExpense.setExpense(savedExpense);

            unitExpenseRepository.save(unitExpense);
        }

        return savedExpense;
    }

    @Transactional ( readOnly = true)
    public List<UnitExpense> getExpenseByUnit ( Long unitId ) {
        return  unitExpenseRepository.findByUnitId( unitId );
    }

    @Transactional
    public UnitExpense payExpense (Long unitExpenseId) {
        UnitExpense unitExpense = unitExpenseRepository.findById(unitExpenseId)
                .orElseThrow(()-> new RuntimeException("Expense record not found."));

        unitExpense.setStatus(PaymentStatus.PAID);
        return unitExpenseRepository.save(unitExpense);
    }

}
