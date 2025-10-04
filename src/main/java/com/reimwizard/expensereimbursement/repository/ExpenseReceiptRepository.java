package com.reimwizard.expensereimbursement.repository;

import com.reimwizard.expensereimbursement.entity.ExpenseReceipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseReceiptRepository extends JpaRepository<ExpenseReceipt, Long> {
    
    List<ExpenseReceipt> findByExpenseId(Long expenseId);
    
    void deleteByExpenseId(Long expenseId);
}
