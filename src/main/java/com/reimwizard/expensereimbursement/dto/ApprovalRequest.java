package com.reimwizard.expensereimbursement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ApprovalRequest {
    
    @NotNull(message = "Expense ID is required")
    private Long expenseId;
    
    @NotBlank(message = "Status is required")
    private String status;
    
    @Size(max = 500, message = "Comment must not exceed 500 characters")
    private String comment;
    
    // Constructors
    public ApprovalRequest() {}
    
    public ApprovalRequest(Long expenseId, String status, String comment) {
        this.expenseId = expenseId;
        this.status = status;
        this.comment = comment;
    }
    
    // Getters and Setters
    public Long getExpenseId() {
        return expenseId;
    }
    
    public void setExpenseId(Long expenseId) {
        this.expenseId = expenseId;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public String getComment() {
        return comment;
    }
    
    public void setComment(String comment) {
        this.comment = comment;
    }
}
