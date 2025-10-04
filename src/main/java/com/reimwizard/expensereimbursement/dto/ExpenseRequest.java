package com.reimwizard.expensereimbursement.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class ExpenseRequest {
    
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private Double amount;
    
    @NotBlank(message = "Original currency is required")
    @Size(max = 3, message = "Original currency must not exceed 3 characters")
    private String originalCurrency;
    
    @NotBlank(message = "Category is required")
    @Size(max = 50, message = "Category must not exceed 50 characters")
    private String category;
    
    @NotBlank(message = "Description is required")
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;
    
    @NotNull(message = "Date is required")
    private LocalDate date;
    
    // Constructors
    public ExpenseRequest() {}
    
    public ExpenseRequest(Double amount, String originalCurrency, String category, String description, LocalDate date) {
        this.amount = amount;
        this.originalCurrency = originalCurrency;
        this.category = category;
        this.description = description;
        this.date = date;
    }
    
    // Getters and Setters
    public Double getAmount() {
        return amount;
    }
    
    public void setAmount(Double amount) {
        this.amount = amount;
    }
    
    public String getOriginalCurrency() {
        return originalCurrency;
    }
    
    public void setOriginalCurrency(String originalCurrency) {
        this.originalCurrency = originalCurrency;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public LocalDate getDate() {
        return date;
    }
    
    public void setDate(LocalDate date) {
        this.date = date;
    }
}
