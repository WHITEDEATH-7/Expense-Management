package com.reimwizard.expensereimbursement.service;

import com.reimwizard.expensereimbursement.entity.ApprovalRule;
import com.reimwizard.expensereimbursement.entity.User;
import com.reimwizard.expensereimbursement.repository.ApprovalRuleRepository;
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
public class ApprovalRuleService {
    
    @Autowired
    private ApprovalRuleRepository approvalRuleRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<ApprovalRule> getApprovalRulesByCompany(Long companyId) {
        UserPrincipal userPrincipal = getCurrentUserPrincipal();
        
        // Check if user belongs to the same company
        if (!userPrincipal.getCompanyId().equals(companyId)) {
            throw new RuntimeException("Access denied: You can only view approval rules from your company");
        }
        
        return approvalRuleRepository.findByCompanyIdOrderBySequence(companyId);
    }
    
    public ApprovalRule createApprovalRule(ApprovalRule approvalRule) {
        UserPrincipal userPrincipal = getCurrentUserPrincipal();
        
        // Check if user has admin role
        if (!userPrincipal.getRole().equals(User.Role.ADMIN)) {
            throw new RuntimeException("Access denied: Only admins can create approval rules");
        }
        
        // Validate approver if specified
        if (approvalRule.getApprover() != null) {
            User approver = userRepository.findById(approvalRule.getApprover().getId())
                    .orElseThrow(() -> new RuntimeException("Approver not found"));
            
            // Check if approver belongs to the same company
            if (!approver.getCompany().getId().equals(approvalRule.getCompany().getId())) {
                throw new RuntimeException("Approver must belong to the same company");
            }
            
            approvalRule.setApprover(approver);
        }
        
        return approvalRuleRepository.save(approvalRule);
    }
    
    public ApprovalRule updateApprovalRule(Long ruleId, ApprovalRule approvalRuleDetails) {
        UserPrincipal userPrincipal = getCurrentUserPrincipal();
        
        // Check if user has admin role
        if (!userPrincipal.getRole().equals(User.Role.ADMIN)) {
            throw new RuntimeException("Access denied: Only admins can update approval rules");
        }
        
        ApprovalRule approvalRule = approvalRuleRepository.findById(ruleId)
                .orElseThrow(() -> new RuntimeException("Approval rule not found"));
        
        // Check if user belongs to the same company
        if (!approvalRule.getCompany().getId().equals(userPrincipal.getCompanyId())) {
            throw new RuntimeException("Access denied: You can only update approval rules from your company");
        }
        
        // Update fields
        if (approvalRuleDetails.getRuleType() != null) {
            approvalRule.setRuleType(approvalRuleDetails.getRuleType());
        }
        
        if (approvalRuleDetails.getThreshold() != null) {
            approvalRule.setThreshold(approvalRuleDetails.getThreshold());
        }
        
        if (approvalRuleDetails.getApproverRole() != null) {
            approvalRule.setApproverRole(approvalRuleDetails.getApproverRole());
        }
        
        if (approvalRuleDetails.getApprover() != null) {
            User approver = userRepository.findById(approvalRuleDetails.getApprover().getId())
                    .orElseThrow(() -> new RuntimeException("Approver not found"));
            
            // Check if approver belongs to the same company
            if (!approver.getCompany().getId().equals(approvalRule.getCompany().getId())) {
                throw new RuntimeException("Approver must belong to the same company");
            }
            
            approvalRule.setApprover(approver);
        }
        
        if (approvalRuleDetails.getSequence() != null) {
            approvalRule.setSequence(approvalRuleDetails.getSequence());
        }
        
        return approvalRuleRepository.save(approvalRule);
    }
    
    public void deleteApprovalRule(Long ruleId) {
        UserPrincipal userPrincipal = getCurrentUserPrincipal();
        
        // Check if user has admin role
        if (!userPrincipal.getRole().equals(User.Role.ADMIN)) {
            throw new RuntimeException("Access denied: Only admins can delete approval rules");
        }
        
        ApprovalRule approvalRule = approvalRuleRepository.findById(ruleId)
                .orElseThrow(() -> new RuntimeException("Approval rule not found"));
        
        // Check if user belongs to the same company
        if (!approvalRule.getCompany().getId().equals(userPrincipal.getCompanyId())) {
            throw new RuntimeException("Access denied: You can only delete approval rules from your company");
        }
        
        approvalRuleRepository.delete(approvalRule);
    }
    
    public Optional<ApprovalRule> getApprovalRuleById(Long ruleId) {
        UserPrincipal userPrincipal = getCurrentUserPrincipal();
        
        return approvalRuleRepository.findById(ruleId)
                .filter(rule -> rule.getCompany().getId().equals(userPrincipal.getCompanyId()));
    }
    
    private UserPrincipal getCurrentUserPrincipal() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (UserPrincipal) authentication.getPrincipal();
    }
}
