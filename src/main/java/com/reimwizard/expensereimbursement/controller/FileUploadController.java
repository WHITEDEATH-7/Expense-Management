package com.reimwizard.expensereimbursement.controller;

import com.reimwizard.expensereimbursement.entity.Expense;
import com.reimwizard.expensereimbursement.entity.ExpenseReceipt;
import com.reimwizard.expensereimbursement.repository.ExpenseReceiptRepository;
import com.reimwizard.expensereimbursement.repository.ExpenseRepository;
import com.reimwizard.expensereimbursement.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/files")
public class FileUploadController {
    
    @Autowired
    private FileStorageService fileStorageService;
    
    @Autowired
    private ExpenseReceiptRepository expenseReceiptRepository;
    
    @Autowired
    private ExpenseRepository expenseRepository;
    
    @PostMapping("/upload")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file,
                                      @RequestParam("expenseId") Long expenseId) {
        try {
            // Check if expense exists and user has access
            Optional<Expense> expenseOpt = expenseRepository.findById(expenseId);
            if (expenseOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Error: Expense not found");
            }
            
            Expense expense = expenseOpt.get();
            
            // Store file
            String fileName = fileStorageService.storeFile(file);
            
            // Create receipt record
            ExpenseReceipt receipt = new ExpenseReceipt(expense, fileName);
            receipt = expenseReceiptRepository.save(receipt);
            
            return ResponseEntity.ok("File uploaded successfully: " + fileName);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/download/{fileName}")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName, HttpServletRequest request) {
        try {
            Resource resource = fileStorageService.loadFileAsResource(fileName);
            
            // Determine content type
            String contentType = null;
            try {
                contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
            } catch (IOException ex) {
                // Could not determine file type
            }
            
            // Fallback to default content type
            if (contentType == null) {
                contentType = "application/octet-stream";
            }
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/expense/{expenseId}")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<?> getReceiptsForExpense(@PathVariable Long expenseId) {
        try {
            List<ExpenseReceipt> receipts = expenseReceiptRepository.findByExpenseId(expenseId);
            return ResponseEntity.ok(receipts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{receiptId}")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteReceipt(@PathVariable Long receiptId) {
        try {
            Optional<ExpenseReceipt> receiptOpt = expenseReceiptRepository.findById(receiptId);
            if (receiptOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Error: Receipt not found");
            }
            
            ExpenseReceipt receipt = receiptOpt.get();
            
            // Delete file from storage
            fileStorageService.deleteFile(receipt.getReceiptUrl());
            
            // Delete receipt record
            expenseReceiptRepository.delete(receipt);
            
            return ResponseEntity.ok("Receipt deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
