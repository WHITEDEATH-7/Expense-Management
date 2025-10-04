package com.reimwizard.expensereimbursement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "expenses")
public class Expense {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    @NotNull(message = "Employee is required")
    private User employee;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    @NotNull(message = "Company is required")
    private Company company;
    
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    @Column(nullable = false)
    private Double amount;
    
    @NotBlank(message = "Original currency is required")
    @Size(max = 3, message = "Original currency must not exceed 3 characters")
    @Column(nullable = false)
    private String originalCurrency;
    
    @NotBlank(message = "Category is required")
    @Size(max = 50, message = "Category must not exceed 50 characters")
    @Column(nullable = false)
    private String category;
    
    @NotBlank(message = "Description is required")
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;
    
    @NotNull(message = "Date is required")
    @Column(nullable = false)
    private LocalDate date;
    
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Status is required")
    @Column(nullable = false)
    private Status status;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "expense", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Approval> approvals = new ArrayList<>();
    
    @OneToMany(mappedBy = "expense", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ExpenseReceipt> receipts = new ArrayList<>();
    
    // Constructors
    public Expense() {
        this.createdAt = LocalDateTime.now();
        this.status = Status.PENDING;
    }
    
    public Expense(User employee, Company company, Double amount, String originalCurrency, 
                   String category, String description, LocalDate date) {
        this();
        this.employee = employee;
        this.company = company;
        this.amount = amount;
        this.originalCurrency = originalCurrency;
        this.category = category;
        this.description = description;
        this.date = date;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getEmployee() {
        return employee;
    }
    
    public void setEmployee(User employee) {
        this.employee = employee;
    }
    
    public Company getCompany() {
        return company;
    }
    
    public void setCompany(Company company) {
        this.company = company;
    }
    
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
    
    public Status getStatus() {
        return status;
    }
    
    public void setStatus(Status status) {
        this.status = status;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public List<Approval> getApprovals() {
        return approvals;
    }
    
    public void setApprovals(List<Approval> approvals) {
        this.approvals = approvals;
    }
    
    public List<ExpenseReceipt> getReceipts() {
        return receipts;
    }
    
    public void setReceipts(List<ExpenseReceipt> receipts) {
        this.receipts = receipts;
    }
    
    public enum Status {
        PENDING, APPROVED, REJECTED
    }
}
