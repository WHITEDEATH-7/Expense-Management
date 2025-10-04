package com.reimwizard.expensereimbursement.repository;

import com.reimwizard.expensereimbursement.entity.Expense;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    
    List<Expense> findByEmployeeId(Long employeeId);
    
    List<Expense> findByCompanyId(Long companyId);
    
    List<Expense> findByEmployeeIdAndStatus(Long employeeId, Expense.Status status);
    
    List<Expense> findByCompanyIdAndStatus(Long companyId, Expense.Status status);
    
    Page<Expense> findByEmployeeId(Long employeeId, Pageable pageable);
    
    Page<Expense> findByCompanyId(Long companyId, Pageable pageable);
    
    @Query("SELECT e FROM Expense e WHERE e.employee.id = :employeeId AND e.date BETWEEN :startDate AND :endDate")
    List<Expense> findByEmployeeIdAndDateRange(@Param("employeeId") Long employeeId, 
                                              @Param("startDate") LocalDate startDate, 
                                              @Param("endDate") LocalDate endDate);
    
    @Query("SELECT e FROM Expense e WHERE e.company.id = :companyId AND e.date BETWEEN :startDate AND :endDate")
    List<Expense> findByCompanyIdAndDateRange(@Param("companyId") Long companyId, 
                                             @Param("startDate") LocalDate startDate, 
                                             @Param("endDate") LocalDate endDate);
    
    @Query("SELECT e FROM Expense e JOIN e.approvals a WHERE a.approver.id = :approverId AND a.status = 'PENDING'")
    List<Expense> findPendingApprovalsForApprover(@Param("approverId") Long approverId);
    
    @Query("SELECT e FROM Expense e WHERE e.employee.manager.id = :managerId")
    List<Expense> findExpensesForManagerSubordinates(@Param("managerId") Long managerId);
}
