package com.reimwizard.expensereimbursement.service;

import com.reimwizard.expensereimbursement.entity.User;
import com.reimwizard.expensereimbursement.repository.UserRepository;
import com.reimwizard.expensereimbursement.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public List<User> getUsersByCompany(Long companyId) {
        UserPrincipal userPrincipal = getCurrentUserPrincipal();
        
        // Check if user belongs to the same company
        if (!userPrincipal.getCompanyId().equals(companyId)) {
            throw new RuntimeException("Access denied: You can only view users from your company");
        }
        
        return userRepository.findByCompanyId(companyId);
    }
    
    public List<User> getUsersByRole(Long companyId, User.Role role) {
        UserPrincipal userPrincipal = getCurrentUserPrincipal();
        
        // Check if user belongs to the same company
        if (!userPrincipal.getCompanyId().equals(companyId)) {
            throw new RuntimeException("Access denied: You can only view users from your company");
        }
        
        return userRepository.findByCompanyIdAndRole(companyId, role);
    }
    
    public List<User> getSubordinates(Long managerId) {
        UserPrincipal userPrincipal = getCurrentUserPrincipal();
        
        // Check if user is the manager or has admin role
        if (!userPrincipal.getId().equals(managerId) && 
            !userPrincipal.getRole().equals(User.Role.ADMIN)) {
            throw new RuntimeException("Access denied: You can only view your own subordinates");
        }
        
        return userRepository.findByManagerId(managerId);
    }
    
    public User createUser(User user) {
        UserPrincipal userPrincipal = getCurrentUserPrincipal();
        
        // Check if user has admin role
        if (!userPrincipal.getRole().equals(User.Role.ADMIN)) {
            throw new RuntimeException("Access denied: Only admins can create users");
        }
        
        // Check if username or email already exists
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Error: Username is already taken!");
        }
        
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }
        
        // Encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        return userRepository.save(user);
    }
    
    public User updateUser(Long userId, User userDetails) {
        UserPrincipal userPrincipal = getCurrentUserPrincipal();
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if user can update this user
        if (!user.getId().equals(userPrincipal.getId()) && 
            !userPrincipal.getRole().equals(User.Role.ADMIN) &&
            !isManagerOfUser(userPrincipal, user)) {
            throw new RuntimeException("Access denied: You cannot update this user");
        }
        
        // Update fields
        if (userDetails.getUsername() != null) {
            if (!userDetails.getUsername().equals(user.getUsername()) && 
                userRepository.existsByUsername(userDetails.getUsername())) {
                throw new RuntimeException("Error: Username is already taken!");
            }
            user.setUsername(userDetails.getUsername());
        }
        
        if (userDetails.getEmail() != null) {
            if (!userDetails.getEmail().equals(user.getEmail()) && 
                userRepository.existsByEmail(userDetails.getEmail())) {
                throw new RuntimeException("Error: Email is already in use!");
            }
            user.setEmail(userDetails.getEmail());
        }
        
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }
        
        if (userDetails.getRole() != null && userPrincipal.getRole().equals(User.Role.ADMIN)) {
            user.setRole(userDetails.getRole());
        }
        
        if (userDetails.getManager() != null && userPrincipal.getRole().equals(User.Role.ADMIN)) {
            user.setManager(userDetails.getManager());
        }
        
        return userRepository.save(user);
    }
    
    public void deleteUser(Long userId) {
        UserPrincipal userPrincipal = getCurrentUserPrincipal();
        
        // Check if user has admin role
        if (!userPrincipal.getRole().equals(User.Role.ADMIN)) {
            throw new RuntimeException("Access denied: Only admins can delete users");
        }
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if user is trying to delete themselves
        if (user.getId().equals(userPrincipal.getId())) {
            throw new RuntimeException("You cannot delete your own account");
        }
        
        userRepository.delete(user);
    }
    
    public Optional<User> getUserById(Long userId) {
        UserPrincipal userPrincipal = getCurrentUserPrincipal();
        
        return userRepository.findById(userId)
                .filter(user -> {
                    // Check if user can access this user
                    return user.getId().equals(userPrincipal.getId()) ||
                           user.getCompany().getId().equals(userPrincipal.getCompanyId()) ||
                           userPrincipal.getRole().equals(User.Role.ADMIN) ||
                           isManagerOfUser(userPrincipal, user);
                });
    }
    
    private boolean isManagerOfUser(UserPrincipal manager, User user) {
        return manager.getRole().equals(User.Role.MANAGER) && 
               user.getManager() != null && 
               user.getManager().getId().equals(manager.getId());
    }
    
    private UserPrincipal getCurrentUserPrincipal() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (UserPrincipal) authentication.getPrincipal();
    }
}
