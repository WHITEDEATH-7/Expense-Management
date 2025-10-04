package com.reimwizard.expensereimbursement.repository;

import com.reimwizard.expensereimbursement.entity.Approval;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApprovalRepository extends JpaRepository<Approval, Long> {
    
    List<Approval> findByExpenseId(Long expenseId);
    
    List<Approval> findByApproverId(Long approverId);
    
    List<Approval> findByApproverIdAndStatus(Long approverId, Approval.Status status);
    
    @Query("SELECT a FROM Approval a WHERE a.expense.id = :expenseId ORDER BY a.sequence ASC")
    List<Approval> findByExpenseIdOrderBySequence(@Param("expenseId") Long expenseId);
    
    @Query("SELECT a FROM Approval a WHERE a.expense.id = :expenseId AND a.status = 'PENDING' ORDER BY a.sequence ASC")
    List<Approval> findPendingApprovalsForExpense(@Param("expenseId") Long expenseId);
    
    @Query("SELECT a FROM Approval a WHERE a.expense.id = :expenseId AND a.sequence = :sequence")
    Optional<Approval> findByExpenseIdAndSequence(@Param("expenseId") Long expenseId, @Param("sequence") Integer sequence);
    
    @Query("SELECT a FROM Approval a WHERE a.approver.id = :approverId AND a.status = 'PENDING' ORDER BY a.expense.createdAt ASC")
    List<Approval> findPendingApprovalsForApproverOrderByCreatedAt(@Param("approverId") Long approverId);
}
