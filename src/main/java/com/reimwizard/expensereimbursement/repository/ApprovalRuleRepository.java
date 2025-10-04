package com.reimwizard.expensereimbursement.repository;

import com.reimwizard.expensereimbursement.entity.ApprovalRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApprovalRuleRepository extends JpaRepository<ApprovalRule, Long> {
    
    List<ApprovalRule> findByCompanyId(Long companyId);
    
    List<ApprovalRule> findByCompanyIdOrderBySequence(Long companyId);
    
    @Query("SELECT ar FROM ApprovalRule ar WHERE ar.company.id = :companyId AND ar.ruleType = :ruleType ORDER BY ar.sequence ASC")
    List<ApprovalRule> findByCompanyIdAndRuleTypeOrderBySequence(@Param("companyId") Long companyId, 
                                                               @Param("ruleType") ApprovalRule.RuleType ruleType);
    
    @Query("SELECT ar FROM ApprovalRule ar WHERE ar.company.id = :companyId AND ar.threshold <= :amount ORDER BY ar.threshold DESC, ar.sequence ASC")
    List<ApprovalRule> findApplicableRulesForAmount(@Param("companyId") Long companyId, @Param("amount") Double amount);
}
