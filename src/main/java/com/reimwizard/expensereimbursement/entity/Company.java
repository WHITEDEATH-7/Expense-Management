package com.reimwizard.expensereimbursement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "companies")
public class Company {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Company name is required")
    @Size(max = 100, message = "Company name must not exceed 100 characters")
    @Column(nullable = false)
    private String name;
    
    @NotBlank(message = "Country is required")
    @Size(max = 50, message = "Country must not exceed 50 characters")
    @Column(nullable = false)
    private String country;
    
    @NotBlank(message = "Currency is required")
    @Size(max = 3, message = "Currency must not exceed 3 characters")
    @Column(nullable = false)
    private String currency;
    
    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<User> users = new ArrayList<>();
    
    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Expense> expenses = new ArrayList<>();
    
    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ApprovalRule> approvalRules = new ArrayList<>();
    
    // Constructors
    public Company() {}
    
    public Company(String name, String country, String currency) {
        this.name = name;
        this.country = country;
        this.currency = currency;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getCountry() {
        return country;
    }
    
    public void setCountry(String country) {
        this.country = country;
    }
    
    public String getCurrency() {
        return currency;
    }
    
    public void setCurrency(String currency) {
        this.currency = currency;
    }
    
    public List<User> getUsers() {
        return users;
    }
    
    public void setUsers(List<User> users) {
        this.users = users;
    }
    
    public List<Expense> getExpenses() {
        return expenses;
    }
    
    public void setExpenses(List<Expense> expenses) {
        this.expenses = expenses;
    }
    
    public List<ApprovalRule> getApprovalRules() {
        return approvalRules;
    }
    
    public void setApprovalRules(List<ApprovalRule> approvalRules) {
        this.approvalRules = approvalRules;
    }
}
