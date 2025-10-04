package com.reimwizard.expensereimbursement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Username is required")
    @Size(max = 50, message = "Username must not exceed 50 characters")
    @Column(unique = true, nullable = false)
    private String username;
    
    @NotBlank(message = "Password is required")
    @Column(nullable = false)
    private String password;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    @Column(unique = true, nullable = false)
    private String email;
    
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Role is required")
    @Column(nullable = false)
    private Role role;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id")
    private User manager;
    
    @OneToMany(mappedBy = "manager", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<User> subordinates = new ArrayList<>();
    
    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Expense> expenses = new ArrayList<>();
    
    @OneToMany(mappedBy = "approver", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Approval> approvals = new ArrayList<>();
    
    // Constructors
    public User() {}
    
    public User(String username, String password, String email, Role role, Company company) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
        this.company = company;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public Role getRole() {
        return role;
    }
    
    public void setRole(Role role) {
        this.role = role;
    }
    
    public Company getCompany() {
        return company;
    }
    
    public void setCompany(Company company) {
        this.company = company;
    }
    
    public User getManager() {
        return manager;
    }
    
    public void setManager(User manager) {
        this.manager = manager;
    }
    
    public List<User> getSubordinates() {
        return subordinates;
    }
    
    public void setSubordinates(List<User> subordinates) {
        this.subordinates = subordinates;
    }
    
    public List<Expense> getExpenses() {
        return expenses;
    }
    
    public void setExpenses(List<Expense> expenses) {
        this.expenses = expenses;
    }
    
    public List<Approval> getApprovals() {
        return approvals;
    }
    
    public void setApprovals(List<Approval> approvals) {
        this.approvals = approvals;
    }
    
    public enum Role {
        ADMIN, MANAGER, EMPLOYEE
    }
}
