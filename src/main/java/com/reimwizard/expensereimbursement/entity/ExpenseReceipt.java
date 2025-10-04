package com.reimwizard.expensereimbursement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "expense_receipts")
public class ExpenseReceipt {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "expense_id", nullable = false)
    @NotNull(message = "Expense is required")
    private Expense expense;
    
    @NotBlank(message = "Receipt URL is required")
    @Column(nullable = false)
    private String receiptUrl;
    
    @Column(columnDefinition = "TEXT")
    private String parsedDataJson;
    
    // Constructors
    public ExpenseReceipt() {}
    
    public ExpenseReceipt(Expense expense, String receiptUrl) {
        this.expense = expense;
        this.receiptUrl = receiptUrl;
    }
    
    public ExpenseReceipt(Expense expense, String receiptUrl, String parsedDataJson) {
        this.expense = expense;
        this.receiptUrl = receiptUrl;
        this.parsedDataJson = parsedDataJson;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Expense getExpense() {
        return expense;
    }
    
    public void setExpense(Expense expense) {
        this.expense = expense;
    }
    
    public String getReceiptUrl() {
        return receiptUrl;
    }
    
    public void setReceiptUrl(String receiptUrl) {
        this.receiptUrl = receiptUrl;
    }
    
    public String getParsedDataJson() {
        return parsedDataJson;
    }
    
    public void setParsedDataJson(String parsedDataJson) {
        this.parsedDataJson = parsedDataJson;
    }
}
