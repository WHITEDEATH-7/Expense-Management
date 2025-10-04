package com.reimwizard.expensereimbursement.repository;

import com.reimwizard.expensereimbursement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    List<User> findByCompanyId(Long companyId);
    
    List<User> findByCompanyIdAndRole(Long companyId, User.Role role);
    
    List<User> findByManagerId(Long managerId);
    
    @Query("SELECT u FROM User u WHERE u.company.id = :companyId AND u.role = :role AND u.id != :excludeId")
    List<User> findByCompanyIdAndRoleExcludingId(@Param("companyId") Long companyId, 
                                                @Param("role") User.Role role, 
                                                @Param("excludeId") Long excludeId);
}
