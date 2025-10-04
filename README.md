# Expense Reimbursement System

A comprehensive, enterprise-grade Spring Boot backend application for managing expense reimbursements with JWT authentication, multi-level approval workflows, and secure file upload capabilities.

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Security](#-security)
- [Testing](#-testing)
- [Production Deployment](#-production-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Core Functionality
- **🔐 Authentication & Authorization**: Secure JWT-based authentication with role-based access control (RBAC)
- **👥 User Management**: Complete CRUD operations for users with three distinct roles: ADMIN, MANAGER, EMPLOYEE
- **💰 Expense Management**: Submit, track, and manage expense claims with comprehensive status tracking
- **✅ Multi-Level Approval Workflow**: Configurable approval chains with automatic routing
- **📎 File Upload System**: Secure receipt upload and storage with retrieval capabilities
- **🏢 Multi-Company Support**: Manage multiple companies with isolated data and custom settings
- **🔄 RESTful API Design**: Well-structured REST endpoints with standardized error handling

### Technical Features
- JWT token-based stateless authentication
- BCrypt password encryption
- Automatic database schema management
- CORS support for frontend integration
- Comprehensive error handling and validation
- Transaction management with Spring Data JPA

---

## 🛠 Technology Stack

| Category | Technology |
|----------|-----------|
| **Language** | Java 17 |
| **Framework** | Spring Boot 3.2.0 |
| **Security** | Spring Security + JWT |
| **ORM** | Spring Data JPA |
| **Database** | MySQL 8.0 |
| **Build Tool** | Maven 3.6+ |
| **Password Encryption** | BCrypt |

---

## 🏗 Architecture

### Database Schema

The system uses six main entities:

1. **Company**: Stores company information (name, country, currency)
2. **User**: User accounts with roles and company associations
3. **Expense**: Expense records with status and financial details
4. **Approval**: Individual approval workflow entries
5. **ApprovalRule**: Configurable approval rules per company
6. **ExpenseReceipt**: File attachments for expense receipts

### Entity Relationships
```
Company (1) ----< (N) User
Company (1) ----< (N) ApprovalRule
User (1) ----< (N) Expense
Expense (1) ----< (N) Approval
Expense (1) ----< (N) ExpenseReceipt
User (1) ----< (N) Approval (as approver)
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Java Development Kit (JDK)**: Version 17 or higher
- **MySQL Database**: Version 8.0 or higher
- **Maven**: Version 3.6 or higher
- **IDE** (Optional): IntelliJ IDEA, Eclipse, or VS Code with Java extensions

---

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/WHITEDEATH-7/Expense-Management.git
cd Expense-Management
```

### 2. Database Setup

Create a new MySQL database:
```sql
CREATE DATABASE expense_database;
-- Demo credentials used in this project (for local development)
-- Username: Spencer
-- Password: mysql
CREATE USER 'expense_user'@'localhost' IDENTIFIED BY 'mysql';
GRANT ALL PRIVILEGES ON expense_database.* TO 'expense_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Configure Application Properties

The application now supports environment-based configuration with sensible defaults for local development. By default the project uses the demo credentials:

- DB username: Spencer
- DB password: mysql

You can override these values using environment variables (recommended for production). Example `src/main/resources/application.yml` uses placeholders and will read:

- `DB_URL` (default: jdbc:mysql://localhost:3306/expense_reimbursement...)
- `DB_USERNAME` (default: root)
- `DB_PASSWORD` (default: mysql)
- `JWT_SECRET` (default: a local dev secret)
- `FILE_UPLOAD_DIR` (default: ./uploads/receipts)

For the frontend, a `.env` file is provided with Vite variables. See `.env` in the project root for `VITE_API_BASE_URL`, `VITE_DEMO_USERNAME`, and `VITE_DEMO_PASSWORD`.

### 4. Install Dependencies
```bash
mvn clean install
```

---

## ⚙️ Configuration

### JWT Configuration

The JWT secret key should be a strong, random string. Generate one using:
```bash
openssl rand -base64 32
```

### File Upload Configuration

By default, files are stored in `./uploads/receipts`. To change this:
```yaml
file:
  upload-dir: /path/to/your/upload/directory
```

Ensure the directory exists and has proper write permissions.

---

## 🏃 Running the Application

### Development Mode
```bash
mvn spring-boot:run
```

### Production Mode
```bash
mvn clean package
java -jar target/expense-reimbursement-system-1.0.0.jar
```

The application will start on **http://localhost:8080**

---

## 📚 API Documentation

### Authentication Endpoints

#### Register New User & Company
```http
POST /api/auth/signup
Content-Type: application/json

{
  "username": "john.doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "fullName": "John Doe",
  "role": "EMPLOYEE",
  "companyName": "Acme Corp",
  "country": "USA",
  "currency": "USD"
}
```

#### Login
```http
POST /api/auth/signin
Content-Type: application/json

{
  "username": "john.doe",
  "password": "securePassword123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "username": "john.doe",
  "role": "EMPLOYEE"
}
```

### User Management Endpoints

| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|---------------|
| GET | `/api/users/company/{companyId}` | Get all users in a company | ADMIN, MANAGER |
| GET | `/api/users/company/{companyId}/role/{role}` | Get users by role | ADMIN, MANAGER |
| GET | `/api/users/manager/{managerId}/subordinates` | Get manager's subordinates | MANAGER |
| GET | `/api/users/{userId}` | Get user by ID | ALL |
| POST | `/api/users` | Create new user | ADMIN |
| PUT | `/api/users/{userId}` | Update user | ADMIN, SELF |
| DELETE | `/api/users/{userId}` | Delete user | ADMIN |

### Expense Management Endpoints

| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|---------------|
| POST | `/api/expenses` | Create new expense | EMPLOYEE, MANAGER |
| GET | `/api/expenses/employee/{employeeId}` | Get expenses by employee | EMPLOYEE, MANAGER |
| GET | `/api/expenses/company/{companyId}` | Get all company expenses | ADMIN, MANAGER |
| GET | `/api/expenses/{expenseId}` | Get expense details | ALL |
| GET | `/api/expenses/approver/{approverId}/pending` | Get pending approvals | MANAGER, ADMIN |

### Approval Endpoints

| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|---------------|
| POST | `/api/approvals/process` | Approve/reject expense | MANAGER, ADMIN |
| GET | `/api/approvals/approver/{approverId}/pending` | Get pending approvals | MANAGER, ADMIN |
| GET | `/api/approvals/expense/{expenseId}` | Get approval history | ALL |

### Approval Rules Endpoints

| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|---------------|
| GET | `/api/approval-rules/company/{companyId}` | Get company approval rules | ADMIN |
| POST | `/api/approval-rules` | Create approval rule | ADMIN |
| PUT | `/api/approval-rules/{ruleId}` | Update approval rule | ADMIN |
| DELETE | `/api/approval-rules/{ruleId}` | Delete approval rule | ADMIN |

### File Upload Endpoints

| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|---------------|
| POST | `/api/files/upload` | Upload receipt file | EMPLOYEE, MANAGER |
| GET | `/api/files/download/{fileName}` | Download file | ALL |
| GET | `/api/files/expense/{expenseId}` | Get expense receipts | ALL |
| DELETE | `/api/files/{receiptId}` | Delete receipt | EMPLOYEE, ADMIN |

### API Response Format

#### Success Response
```json
{
  "data": {
    "id": 1,
    "amount": 150.00,
    "status": "PENDING"
  },
  "message": "Success"
}
```

#### Error Response
```json
{
  "error": "Invalid credentials",
  "status": 401,
  "timestamp": "2025-10-04T10:30:00"
}
```

---

## 🔒 Security

### Authentication Flow
1. User submits credentials to `/api/auth/signin`
2. System validates credentials against database
3. JWT token is generated and returned
4. Client includes token in Authorization header: `Bearer {token}`
5. Each request is validated using JWT filter

### Security Features
- **Password Encryption**: BCrypt with salt rounds
- **JWT Tokens**: Stateless authentication with configurable expiration
- **Role-Based Access Control**: Method-level security with `@PreAuthorize`
- **CORS Configuration**: Configurable cross-origin resource sharing
- **SQL Injection Protection**: Parameterized queries via JPA

### Security Headers
All API responses include security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

---

## 🧪 Testing

### Test Credentials

Pre-configured test accounts:

| Role | Username | Password | Company |
|------|----------|----------|---------|
| Admin | `admin1` | `password123` | TechCorp |
| Manager | `manager1` | `password123` | TechCorp |
| Employee | `employee1` | `password123` | TechCorp |

### Running Tests

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=UserServiceTest

# Run with coverage
mvn test jacoco:report
```

### Manual Testing with cURL

```bash
# Login
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"username":"employee1","password":"password123"}'

# Create Expense (replace {TOKEN} with actual token)
curl -X POST http://localhost:8080/api/expenses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {TOKEN}" \
  -d '{
    "amount": 150.00,
    "category": "TRAVEL",
    "description": "Client meeting taxi",
    "expenseDate": "2025-10-04"
  }'
```

---

## 🌐 Production Deployment

### Pre-Production Checklist

- [ ] Change JWT secret to a strong, random value
- [ ] Update CORS configuration to allow only trusted origins
- [ ] Configure production database with connection pooling
- [ ] Set up HTTPS/TLS certificates
- [ ] Implement rate limiting
- [ ] Configure logging levels (INFO or WARN)
- [ ] Set up database backups
- [ ] Implement monitoring and alerting
- [ ] Use environment variables for sensitive data
- [ ] Set up cloud storage for file uploads (AWS S3, Azure Blob)

### Environment Variables

```bash
export DB_URL=jdbc:mysql://prod-db:3306/expense_database
export DB_USERNAME=Spencer
export DB_PASSWORD=mysql
export JWT_SECRET=C1E67BF842C9AE41916D57FB7CFCC
export FILE_UPLOAD_DIR=/var/app/uploads
```



---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the project's coding standards and includes appropriate tests.

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📧 Contact

For questions or support, please contact:
- **Email**: support@expensesystem.com
- **Issues**: [GitHub Issues](https://github.com/WHITEDEATH-7/Expense-Management/issues)

---

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- All contributors who have helped improve this project
- Open source community for inspiration and support

---

**Made with ❤️ using Spring Boot**
