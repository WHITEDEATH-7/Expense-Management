package com.reimwizard.expensereimbursement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "approval_rules")
public class ApprovalRule {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    @NotNull(message = "Company is required")
    private Company company;
    
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Rule type is required")
    @Column(nullable = false)
    private RuleType ruleType;
    
    @NotNull(message = "Threshold is required")
    @Column(nullable = false)
    private Integer threshold;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "approver_role")
    private User.Role approverRole;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approver_id")
    private User approver;
    
    @NotNull(message = "Sequence is required")
    @Column(nullable = false)
    private Integer sequence;
    
    // Constructors
    public ApprovalRule() {}
    
    public ApprovalRule(Company company, RuleType ruleType, Integer threshold, 
                       User.Role approverRole, User approver, Integer sequence) {
        this.company = company;
        this.ruleType = ruleType;
        this.threshold = threshold;
        this.approverRole = approverRole;
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
    
    public Company getCompany() {
        return company;
    }
    
    public void setCompany(Company company) {
        this.company = company;
    }
    
    public RuleType getRuleType() {
        return ruleType;
    }
    
    public void setRuleType(RuleType ruleType) {
        this.ruleType = ruleType;
    }
    
    public Integer getThreshold() {
        return threshold;
    }
    
    public void setThreshold(Integer threshold) {
        this.threshold = threshold;
    }
    
    public User.Role getApproverRole() {
        return approverRole;
    }
    
    public void setApproverRole(User.Role approverRole) {
        this.approverRole = approverRole;
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
    
    public enum RuleType {
        PERCENTAGE, SPECIFIC, HYBRID
    }
}
