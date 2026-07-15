package com.unity.backend.controller;

import com.unity.backend.dto.ExpenseRequest;
import com.unity.backend.dto.UnitExpenseResponse;
import com.unity.backend.model.Expense;
import com.unity.backend.model.UnitExpense;
import com.unity.backend.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    /*
    @PostMapping
    public ResponseEntity<String> createExpense ( @RequestBody ExpenseRequest request) {
        Expense expense = expenseService.distributeExpense(request);
        return ResponseEntity.ok("Expense registered successfully and distributed among in units.");
    }
     */

    @PostMapping("/building/{buildingId}/generate")
    public ResponseEntity<String> createExpense (
            @PathVariable Long buildingId,
            @RequestBody ExpenseRequest request
    ) {
        request.setBuildingId(buildingId);

        expenseService.distributeExpense(request);
        return ResponseEntity.ok("Expense registered successfully and distributed among in units.");
    }


    @GetMapping("/unit/{unitId}")
    public ResponseEntity<List<UnitExpenseResponse>> getByUnit(@PathVariable Long unitId) {
        List<UnitExpense> unitExpenses = expenseService.getExpenseByUnit(unitId);

        List<UnitExpenseResponse> response = unitExpenses.stream().map(ue -> {
            UnitExpenseResponse res = new UnitExpenseResponse();
            res.setId(ue.getId());
            res.setExpenseDescription(ue.getExpense().getDescription());
            res.setAmount(ue.getAmount());
            res.setStatus(ue.getStatus().name());
            res.setDate(ue.getExpense().getCreatedAt());
            res.setApartment(ue.getUnit().getFloor() + " " + ue.getUnit().getApartmentNumber());
            return res;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }


    @PutMapping("/pay/{unitExpenseId}")
    public ResponseEntity<String> pay(@PathVariable Long unitExpenseId) {
        expenseService.payExpense(unitExpenseId);
        return ResponseEntity.ok("Expense marked as PAID.");
    }


}
