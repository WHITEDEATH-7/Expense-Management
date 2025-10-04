package com.reimwizard.expensereimbursement;

import com.reimwizard.expensereimbursement.config.JwtProperties;
import com.reimwizard.expensereimbursement.config.FileStorageProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties({
    JwtProperties.class,
    FileStorageProperties.class
})
public class ExpenseReimbursementApplication {
    public static void main(String[] args) {
        SpringApplication.run(ExpenseReimbursementApplication.class, args);
    }
}