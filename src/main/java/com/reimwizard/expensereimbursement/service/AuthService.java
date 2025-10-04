package com.reimwizard.expensereimbursement.service;

import com.reimwizard.expensereimbursement.dto.JwtResponse;
import com.reimwizard.expensereimbursement.dto.LoginRequest;
import com.reimwizard.expensereimbursement.dto.SignupRequest;
import com.reimwizard.expensereimbursement.entity.Company;
import com.reimwizard.expensereimbursement.entity.User;
import com.reimwizard.expensereimbursement.repository.CompanyRepository;
import com.reimwizard.expensereimbursement.repository.UserRepository;
import com.reimwizard.expensereimbursement.security.JwtUtils;
import com.reimwizard.expensereimbursement.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CompanyRepository companyRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        return new JwtResponse(jwt, userPrincipal.getId(), userPrincipal.getUsername(), 
                             userPrincipal.getEmail(), userPrincipal.getRole(), 
                             getCompanyName(userPrincipal.getCompanyId()));
    }
    
    public JwtResponse registerUser(SignupRequest signupRequest) {
        // Check if username or email already exists
        if (userRepository.existsByUsername(signupRequest.getUsername())) {
            throw new RuntimeException("Error: Username is already taken!");
        }
        
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }
        
        // Create company
        Company company = new Company(signupRequest.getCompanyName(), 
                                    signupRequest.getCountry(), 
                                    signupRequest.getCurrency());
        company = companyRepository.save(company);
        
        // Create user with ADMIN role
        User user = new User(signupRequest.getUsername(),
                           passwordEncoder.encode(signupRequest.getPassword()),
                           signupRequest.getEmail(),
                           User.Role.ADMIN,
                           company);
        
        user = userRepository.save(user);
        
        // Authenticate the user immediately
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(signupRequest.getUsername(), signupRequest.getPassword()));
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        return new JwtResponse(jwt, userPrincipal.getId(), userPrincipal.getUsername(), 
                             userPrincipal.getEmail(), userPrincipal.getRole(), 
                             getCompanyName(userPrincipal.getCompanyId()));
    }
    
    private String getCompanyName(Long companyId) {
        return companyRepository.findById(companyId)
                .map(Company::getName)
                .orElse("Unknown Company");
    }
}
