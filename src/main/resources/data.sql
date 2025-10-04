-- Sample data for testing (optional)
-- This file will be executed after schema.sql

-- Insert sample companies
INSERT IGNORE INTO companies (id, name, country, currency) VALUES 
(1, 'Acme Corporation', 'United States', 'USD'),
(2, 'Tech Solutions Ltd', 'United Kingdom', 'GBP'),
(3, 'Global Industries', 'Canada', 'CAD');

-- Insert sample users (passwords are 'password123' encoded with BCrypt)
INSERT IGNORE INTO users (id, username, password, email, role, company_id, manager_id) VALUES 
(1, 'admin1', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'admin1@acme.com', 'ADMIN', 1, NULL),
(2, 'manager1', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'manager1@acme.com', 'MANAGER', 1, 1),
(3, 'employee1', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'employee1@acme.com', 'EMPLOYEE', 1, 2),
(4, 'employee2', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'employee2@acme.com', 'EMPLOYEE', 1, 2);

-- Insert sample approval rules
INSERT IGNORE INTO approval_rules (id, company_id, rule_type, threshold, approver_role, approver_id, sequence) VALUES 
(1, 1, 'PERCENTAGE', 100, 'MANAGER', NULL, 1),
(2, 1, 'PERCENTAGE', 500, 'MANAGER', NULL, 2),
(3, 1, 'SPECIFIC', 1000, NULL, 1, 3);

-- Insert sample expenses
INSERT IGNORE INTO expenses (id, employee_id, company_id, amount, original_currency, category, description, date, status, created_at) VALUES 
(1, 3, 1, 50.00, 'USD', 'Meals', 'Business lunch with client', '2024-01-15', 'PENDING', '2024-01-15 10:30:00'),
(2, 3, 1, 200.00, 'USD', 'Travel', 'Flight to conference', '2024-01-20', 'APPROVED', '2024-01-20 14:15:00'),
(3, 4, 1, 75.00, 'USD', 'Office Supplies', 'Printer paper and pens', '2024-01-22', 'PENDING', '2024-01-22 09:45:00');
