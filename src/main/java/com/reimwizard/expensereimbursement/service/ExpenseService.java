package com.reimwizard.expensereimbursement.service;

import com.reimwizard.expensereimbursement.dto.ExpenseRequest;
import com.reimwizard.expensereimbursement.entity.Expense;
import com.reimwizard.expensereimbursement.entity.User;
import com.reimwizard.expensereimbursement.repository.ExpenseRepository;
import com.reimwizard.expensereimbursement.repository.UserRepository;
import com.reimwizard.expensereimbursement.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ExpenseService {
    
    @Autowired
    private ExpenseRepository expenseRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ApprovalService approvalService;
    
    public Expense createExpense(ExpenseRequest expenseRequest) {
        UserPrincipal userPrincipal = getCurrentUserPrincipal();
        User employee = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Expense expense = new Expense(employee, employee.getCompany(), 
                                   expenseRequest.getAmount(), 
                                   expenseRequest.getOriginalCurrency(),
                                   expenseRequest.getCategory(), 
                                   expenseRequest.getDescription(), 
                                   expenseRequest.getDate());
        
        expense = expenseRepository.save(expense);
        
        // Create approval workflow
        approvalService.createApprovalWorkflow(expense);
        
        return expense;
    }
    
    public List<Expense> getExpensesByEmployee(Long employeeId) {
        UserPrincipal userPrincipal = getCurrentUserPrincipal();
        
        // Check if user is accessing their own expenses or has admin/manager role
        if (!userPrincipal.getId().equals(employeeId) && 
            !isAdminOrManager(userPrincipal)) {
            throw new RuntimeException("Access denied: You can only view your own expenses");
        }
        
        return expenseRepository.findByEmployeeId(employeeId);
    }
    
    public List<Expense> getExpensesByCompany(Long companyId) {
        UserPrincipal userPrincipal = getCurrentUserPrincipal();
        
        // Check if user belongs to the same company
        if (!userPrincipal.getCompanyId().equals(companyId)) {
            throw new RuntimeException("Access denied: You can only view expenses from your company");
        }
        
        return expenseRepository.findByCompanyId(companyId);
    }
    
    public Page<Expense> getExpensesByEmployee(Long employeeId, Pageable pageable) {
        UserPrincipal userPrincipal = getCurrentUserPrincipal();
        
        // Check if user is accessing their own expenses or has admin/manager role
        if (!userPrincipal.getId().equals(employeeId) && 
            !isAdminOrManager(userPrincipal)) {
            throw new RuntimeException("Access denied: You can only view your own expenses");
        }
        
        return expenseRepository.findByEmployeeId(employeeId, pageable);
    }
    
    public Page<Expense> getExpensesByCompany(Long companyId, Pageable pageable) {
        UserPrincipal userPrincipal = getCurrentUserPrincipal();
        
        // Check if user belongs to the same company
        if (!userPrincipal.getCompanyId().equals(companyId)) {
            throw new RuntimeException("Access denied: You can only view expenses from your company");
        }
        
        return expenseRepository.findByCompanyId(companyId, pageable);
    }
    
    public List<Expense> getExpensesByDateRange(Long employeeId, LocalDate startDate, LocalDate endDate) {
        UserPrincipal userPrincipal = getCurrentUserPrincipal();
        
        // Check if user is accessing their own expenses or has admin/manager role
        if (!userPrincipal.getId().equals(employeeId) && 
            !isAdminOrManager(userPrincipal)) {
            throw new RuntimeException("Access denied: You can only view your own expenses");
        }
        
        return expenseRepository.findByEmployeeIdAndDateRange(employeeId, startDate, endDate);
    }
    
    public Optional<Expense> getExpenseById(Long expenseId) {
        UserPrincipal userPrincipal = getCurrentUserPrincipal();
        
        return expenseRepository.findById(expenseId)
                .filter(expense -> {
                    // Check if user can access this expense
                    return expense.getEmployee().getId().equals(userPrincipal.getId()) ||
                           expense.getCompany().getId().equals(userPrincipal.getCompanyId()) ||
                           isAdminOrManager(userPrincipal);
                });
    }
    
    public List<Expense> getPendingApprovalsForApprover(Long approverId) {
        UserPrincipal userPrincipal = getCurrentUserPrincipal();
        
        // Check if user is the approver or has admin role
        if (!userPrincipal.getId().equals(approverId) && 
            !userPrincipal.getRole().equals(User.Role.ADMIN)) {
            throw new RuntimeException("Access denied: You can only view your own pending approvals");
        }
        
        return expenseRepository.findPendingApprovalsForApprover(approverId);
    }
    
    public List<Expense> getExpensesForManagerSubordinates(Long managerId) {
        UserPrincipal userPrincipal = getCurrentUserPrincipal();
        
        // Check if user is the manager or has admin role
        if (!userPrincipal.getId().equals(managerId) && 
            !userPrincipal.getRole().equals(User.Role.ADMIN)) {
            throw new RuntimeException("Access denied: You can only view expenses for your subordinates");
        }
        
        return expenseRepository.findExpensesForManagerSubordinates(managerId);
    }
    
    private UserPrincipal getCurrentUserPrincipal() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (UserPrincipal) authentication.getPrincipal();
    }
    
    private boolean isAdminOrManager(UserPrincipal userPrincipal) {
        return userPrincipal.getRole().equals(User.Role.ADMIN) || 
               userPrincipal.getRole().equals(User.Role.MANAGER);
    }
}
