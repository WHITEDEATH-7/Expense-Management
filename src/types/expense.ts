// Enhanced expense types for the new dashboard
export type ExpenseStatus = 'draft' | 'submitted' | 'waiting_approval' | 'approved' | 'rejected';
export type ExpenseCategory = 'food' | 'travel' | 'office' | 'accommodation' | 'entertainment' | 'other';

export interface Approval {
  approverId: string;
  approverName: string;
  approverRole: string;
  status: 'pending' | 'approved' | 'rejected';
  comment?: string;
  timestamp?: string;
}

export interface Expense {
  id: string;
  employeeId: string;
  employeeName: string;
  amount: number;
  currency: string;
  amountInCompanyCurrency?: number;
  exchangeRate?: number;
  category: ExpenseCategory;
  description: string;
  date: string;
  receiptUrl?: string;
  status: ExpenseStatus;
  approvals: Approval[];
  paidBy: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StatusPipeline {
  toSubmit: number;
  waiting: number;
  approved: number;
}

export interface OCRData {
  amount: number;
  date: string;
  merchant: string;
  category: ExpenseCategory;
  lineItems?: string[];
  confidence: number;
}

export interface ExpenseFormData {
  description: string;
  amount: number;
  currency: string;
  category: ExpenseCategory;
  date: string;
  paidBy: string;
  remarks?: string;
  receiptFile?: File;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: 'employee' | 'manager' | 'admin';
  managerId?: string;
  color?: string; // For colored labels
}
