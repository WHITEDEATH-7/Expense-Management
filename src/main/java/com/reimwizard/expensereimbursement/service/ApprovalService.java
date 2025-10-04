package com.reimwizard.expensereimbursement.service;

import com.reimwizard.expensereimbursement.dto.ApprovalRequest;
import com.reimwizard.expensereimbursement.entity.Approval;
import com.reimwizard.expensereimbursement.entity.ApprovalRule;
import com.reimwizard.expensereimbursement.entity.Expense;
import com.reimwizard.expensereimbursement.entity.User;
import com.reimwizard.expensereimbursement.repository.ApprovalRepository;
import com.reimwizard.expensereimbursement.repository.ApprovalRuleRepository;
import com.reimwizard.expensereimbursement.repository.ExpenseRepository;
import com.reimwizard.expensereimbursement.repository.UserRepository;
import com.reimwizard.expensereimbursement.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ApprovalService {
    
    @Autowired
    private ApprovalRepository approvalRepository;
    
    @Autowired
    private ApprovalRuleRepository approvalRuleRepository;
    
    @Autowired
    private ExpenseRepository expenseRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public void createApprovalWorkflow(Expense expense) {
        List<ApprovalRule> rules = approvalRuleRepository.findApplicableRulesForAmount(
                expense.getCompany().getId(), expense.getAmount());
        
        if (rules.isEmpty()) {
            // No approval rules, auto-approve
            expense.setStatus(Expense.Status.APPROVED);
            expenseRepository.save(expense);
            return;
        }
        
        // Create approval entries based on rules
        for (ApprovalRule rule : rules) {
            User approver = determineApprover(rule, expense);
            if (approver != null) {
                Approval approval = new Approval(expense, approver, rule.getSequence());
                approvalRepository.save(approval);
            }
        }
    }
    
    public Approval processApproval(ApprovalRequest approvalRequest) {
        UserPrincipal userPrincipal = getCurrentUserPrincipal();
        
        Expense expense = expenseRepository.findById(approvalRequest.getExpenseId())
                .orElseThrow(() -> new RuntimeException("Expense not found"));
        
        // Find the approval for this user and expense
        Optional<Approval> approvalOpt = approvalRepository.findByExpenseIdAndSequence(
                approvalRequest.getExpenseId(), getCurrentApprovalSequence(expense));
        
        if (approvalOpt.isEmpty()) {
            throw new RuntimeException("No pending approval found for this expense");
        }
        
        Approval approval = approvalOpt.get();
        
        // Check if the current user is the approver
        if (!approval.getApprover().getId().equals(userPrincipal.getId())) {
            throw new RuntimeException("You are not authorized to approve this expense");
        }
        
        // Update approval status
        approval.setStatus(Approval.Status.valueOf(approvalRequest.getStatus()));
        approval.setComment(approvalRequest.getComment());
        
        approval = approvalRepository.save(approval);
        
        // Update expense status based on approval
        updateExpenseStatus(expense);
        
        return approval;
    }
    
    public List<Approval> getPendingApprovalsForApprover(Long approverId) {
        UserPrincipal userPrincipal = getCurrentUserPrincipal();
        
        // Check if user is the approver or has admin role
        if (!userPrincipal.getId().equals(approverId) && 
            !userPrincipal.getRole().equals(User.Role.ADMIN)) {
            throw new RuntimeException("Access denied: You can only view your own pending approvals");
        }
        
        return approvalRepository.findPendingApprovalsForApproverOrderByCreatedAt(approverId);
    }
    
    public List<Approval> getApprovalsForExpense(Long expenseId) {
        UserPrincipal userPrincipal = getCurrentUserPrincipal();
        
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
        
        // Check if user can access this expense
        if (!expense.getEmployee().getId().equals(userPrincipal.getId()) &&
            !expense.getCompany().getId().equals(userPrincipal.getCompanyId()) &&
            !userPrincipal.getRole().equals(User.Role.ADMIN)) {
            throw new RuntimeException("Access denied: You cannot view approvals for this expense");
        }
        
        return approvalRepository.findByExpenseIdOrderBySequence(expenseId);
    }
    
    private User determineApprover(ApprovalRule rule, Expense expense) {
        if (rule.getApprover() != null) {
            return rule.getApprover();
        }
        
        if (rule.getApproverRole() != null) {
            List<User> users = userRepository.findByCompanyIdAndRoleExcludingId(
                    expense.getCompany().getId(), rule.getApproverRole(), expense.getEmployee().getId());
            
            if (!users.isEmpty()) {
                // For now, return the first user with the required role
                // In a more complex system, you might want to implement load balancing
                return users.get(0);
            }
        }
        
        return null;
    }
    
    private Integer getCurrentApprovalSequence(Expense expense) {
        List<Approval> pendingApprovals = approvalRepository.findPendingApprovalsForExpense(expense.getId());
        if (pendingApprovals.isEmpty()) {
            return null;
        }
        return pendingApprovals.get(0).getSequence();
    }
    
    private void updateExpenseStatus(Expense expense) {
        List<Approval> approvals = approvalRepository.findByExpenseIdOrderBySequence(expense.getId());
        
        // Check if any approval was rejected
        boolean hasRejection = approvals.stream()
                .anyMatch(approval -> approval.getStatus() == Approval.Status.REJECTED);
        
        if (hasRejection) {
            expense.setStatus(Expense.Status.REJECTED);
        } else {
            // Check if all approvals are approved
            boolean allApproved = approvals.stream()
                    .allMatch(approval -> approval.getStatus() == Approval.Status.APPROVED);
            
            if (allApproved) {
                expense.setStatus(Expense.Status.APPROVED);
            }
        }
        
        expenseRepository.save(expense);
    }
    
    private UserPrincipal getCurrentUserPrincipal() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (UserPrincipal) authentication.getPrincipal();
    }
}
