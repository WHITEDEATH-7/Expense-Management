package com.reimwizard.expensereimbursement.controller;

import com.reimwizard.expensereimbursement.dto.ApprovalRequest;
import com.reimwizard.expensereimbursement.entity.Approval;
import com.reimwizard.expensereimbursement.service.ApprovalService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/approvals")
public class ApprovalController {
    
    @Autowired
    private ApprovalService approvalService;
    
    @PostMapping("/process")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<?> processApproval(@Valid @RequestBody ApprovalRequest approvalRequest) {
        try {
            Approval approval = approvalService.processApproval(approvalRequest);
            return ResponseEntity.ok(approval);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/approver/{approverId}/pending")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<?> getPendingApprovalsForApprover(@PathVariable Long approverId) {
        try {
            List<Approval> approvals = approvalService.getPendingApprovalsForApprover(approverId);
            return ResponseEntity.ok(approvals);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/expense/{expenseId}")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<?> getApprovalsForExpense(@PathVariable Long expenseId) {
        try {
            List<Approval> approvals = approvalService.getApprovalsForExpense(expenseId);
            return ResponseEntity.ok(approvals);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
