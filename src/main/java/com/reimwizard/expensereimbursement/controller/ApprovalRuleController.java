package com.reimwizard.expensereimbursement.controller;

import com.reimwizard.expensereimbursement.entity.ApprovalRule;
import com.reimwizard.expensereimbursement.service.ApprovalRuleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/approval-rules")
public class ApprovalRuleController {
    
    @Autowired
    private ApprovalRuleService approvalRuleService;
    
    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<?> getApprovalRulesByCompany(@PathVariable Long companyId) {
        try {
            List<ApprovalRule> rules = approvalRuleService.getApprovalRulesByCompany(companyId);
            return ResponseEntity.ok(rules);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createApprovalRule(@Valid @RequestBody ApprovalRule approvalRule) {
        try {
            ApprovalRule createdRule = approvalRuleService.createApprovalRule(approvalRule);
            return ResponseEntity.ok(createdRule);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @PutMapping("/{ruleId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateApprovalRule(@PathVariable Long ruleId, @Valid @RequestBody ApprovalRule approvalRuleDetails) {
        try {
            ApprovalRule updatedRule = approvalRuleService.updateApprovalRule(ruleId, approvalRuleDetails);
            return ResponseEntity.ok(updatedRule);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{ruleId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteApprovalRule(@PathVariable Long ruleId) {
        try {
            approvalRuleService.deleteApprovalRule(ruleId);
            return ResponseEntity.ok("Approval rule deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/{ruleId}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<?> getApprovalRuleById(@PathVariable Long ruleId) {
        try {
            Optional<ApprovalRule> rule = approvalRuleService.getApprovalRuleById(ruleId);
            if (rule.isPresent()) {
                return ResponseEntity.ok(rule.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
