package com.reimwizard.expensereimbursement.repository;

import com.reimwizard.expensereimbursement.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    
    Optional<Company> findByName(String name);
    
    boolean existsByName(String name);
}
