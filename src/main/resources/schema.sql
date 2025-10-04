-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS expense_database;
USE expense_database;

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(50) NOT NULL,
    currency VARCHAR(3) NOT NULL
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role ENUM('ADMIN', 'MANAGER', 'EMPLOYEE') NOT NULL,
    company_id BIGINT NOT NULL,
    manager_id BIGINT NULL,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (manager_id) REFERENCES users(id)
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    company_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    original_currency VARCHAR(3) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES users(id),
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Create approval_rules table
CREATE TABLE IF NOT EXISTS approval_rules (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    rule_type ENUM('PERCENTAGE', 'SPECIFIC', 'HYBRID') NOT NULL,
    threshold INT NOT NULL,
    approver_role ENUM('MANAGER', 'FINANCE', 'DIRECTOR') NULL,
    approver_id BIGINT NULL,
    sequence INT NOT NULL,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (approver_id) REFERENCES users(id)
);

-- Create approvals table
CREATE TABLE IF NOT EXISTS approvals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    expense_id BIGINT NOT NULL,
    approver_id BIGINT NOT NULL,
    sequence INT NOT NULL,
    comment TEXT,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL,
    approved_at TIMESTAMP NULL,
    FOREIGN KEY (expense_id) REFERENCES expenses(id),
    FOREIGN KEY (approver_id) REFERENCES users(id)
);

-- Create expense_receipts table
CREATE TABLE IF NOT EXISTS expense_receipts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    expense_id BIGINT NOT NULL,
    receipt_url VARCHAR(255) NOT NULL,
    parsed_data_json TEXT,
    FOREIGN KEY (expense_id) REFERENCES expenses(id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_users_manager_id ON users(manager_id);
CREATE INDEX idx_expenses_employee_id ON expenses(employee_id);
CREATE INDEX idx_expenses_company_id ON expenses(company_id);
CREATE INDEX idx_expenses_status ON expenses(status);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_approvals_expense_id ON approvals(expense_id);
CREATE INDEX idx_approvals_approver_id ON approvals(approver_id);
CREATE INDEX idx_approvals_status ON approvals(status);
CREATE INDEX idx_approval_rules_company_id ON approval_rules(company_id);
CREATE INDEX idx_expense_receipts_expense_id ON expense_receipts(expense_id);
