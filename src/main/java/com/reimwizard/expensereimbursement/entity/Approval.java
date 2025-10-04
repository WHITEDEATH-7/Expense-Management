package com.reimwizard.expensereimbursement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

@Entity
@Table(name = "approvals")
public class Approval {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "expense_id", nullable = false)
    @NotNull(message = "Expense is required")
    private Expense expense;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approver_id", nullable = false)
    @NotNull(message = "Approver is required")
    private User approver;
    
    @NotNull(message = "Sequence is required")
    @Column(nullable = false)
    private Integer sequence;
    
    @Size(max = 500, message = "Comment must not exceed 500 characters")
    @Column(columnDefinition = "TEXT")
    private String comment;
    
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Status is required")
    @Column(nullable = false)
    private Status status;
    
    private LocalDateTime approvedAt;
    
    // Constructors
    public Approval() {
        this.status = Status.PENDING;
    }
    
    public Approval(Expense expense, User approver, Integer sequence) {
        this();
        this.expense = expense;
        this.approver = approver;
        this.sequence = sequence;
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
    
    public User getApprover() {
        return approver;
    }
    
    public void setApprover(User approver) {
        this.approver = approver;
    }
    
    public Integer getSequence() {
        return sequence;
    }
    
    public void setSequence(Integer sequence) {
        this.sequence = sequence;
    }
    
    public String getComment() {
        return comment;
    }
    
    public void setComment(String comment) {
        this.comment = comment;
    }
    
    public Status getStatus() {
        return status;
    }
    
    public void setStatus(Status status) {
        this.status = status;
        if (status != Status.PENDING) {
            this.approvedAt = LocalDateTime.now();
        }
    }
    
    public LocalDateTime getApprovedAt() {
        return approvedAt;
    }
    
    public void setApprovedAt(LocalDateTime approvedAt) {
        this.approvedAt = approvedAt;
    }
    
    public enum Status {
        PENDING, APPROVED, REJECTED
    }
}
