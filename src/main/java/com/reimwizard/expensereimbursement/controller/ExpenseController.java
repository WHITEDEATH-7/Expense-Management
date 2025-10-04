package com.reimwizard.expensereimbursement.controller;

import com.reimwizard.expensereimbursement.dto.ExpenseRequest;
import com.reimwizard.expensereimbursement.entity.Expense;
import com.reimwizard.expensereimbursement.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {
    
    @Autowired
    private ExpenseService expenseService;
    
    @PostMapping
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<?> createExpense(@Valid @RequestBody ExpenseRequest expenseRequest) {
        try {
            Expense expense = expenseService.createExpense(expenseRequest);
            return ResponseEntity.ok(expense);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/employee/{employeeId}")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<?> getExpensesByEmployee(@PathVariable Long employeeId) {
        try {
            List<Expense> expenses = expenseService.getExpensesByEmployee(employeeId);
            return ResponseEntity.ok(expenses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/employee/{employeeId}/paged")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<?> getExpensesByEmployeePaged(@PathVariable Long employeeId, Pageable pageable) {
        try {
            Page<Expense> expenses = expenseService.getExpensesByEmployee(employeeId, pageable);
            return ResponseEntity.ok(expenses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<?> getExpensesByCompany(@PathVariable Long companyId) {
        try {
            List<Expense> expenses = expenseService.getExpensesByCompany(companyId);
            return ResponseEntity.ok(expenses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/company/{companyId}/paged")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<?> getExpensesByCompanyPaged(@PathVariable Long companyId, Pageable pageable) {
        try {
            Page<Expense> expenses = expenseService.getExpensesByCompany(companyId, pageable);
            return ResponseEntity.ok(expenses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/employee/{employeeId}/daterange")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<?> getExpensesByDateRange(
            @PathVariable Long employeeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            List<Expense> expenses = expenseService.getExpensesByDateRange(employeeId, startDate, endDate);
            return ResponseEntity.ok(expenses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/{expenseId}")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<?> getExpenseById(@PathVariable Long expenseId) {
        try {
            Optional<Expense> expense = expenseService.getExpenseById(expenseId);
            if (expense.isPresent()) {
                return ResponseEntity.ok(expense.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/approver/{approverId}/pending")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<?> getPendingApprovalsForApprover(@PathVariable Long approverId) {
        try {
            List<Expense> expenses = expenseService.getPendingApprovalsForApprover(approverId);
            return ResponseEntity.ok(expenses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/manager/{managerId}/subordinates")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<?> getExpensesForManagerSubordinates(@PathVariable Long managerId) {
        try {
            List<Expense> expenses = expenseService.getExpensesForManagerSubordinates(managerId);
            return ResponseEntity.ok(expenses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
