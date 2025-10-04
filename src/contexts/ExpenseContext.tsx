import React, { createContext, useContext, useState } from 'react';

export type ExpenseStatus = 'pending' | 'approved' | 'rejected';
export type ExpenseCategory = 'travel' | 'meals' | 'office' | 'accommodation' | 'other';

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
  createdAt: string;
  updatedAt: string;
}

interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'approvals'>) => void;
  updateExpenseStatus: (id: string, status: ExpenseStatus, approverId: string, comment?: string) => void;
  getExpensesByEmployee: (employeeId: string) => Expense[];
  getPendingApprovals: (approverId: string) => Expense[];
  convertCurrency: (amount: number, fromCurrency: string, toCurrency: string) => Promise<number>;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

// Mock data
const mockExpenses: Expense[] = [
  {
    id: 'exp-1',
    employeeId: 'user-1',
    employeeName: 'John Admin',
    amount: 1200,
    currency: 'USD',
    amountInCompanyCurrency: 1200,
    category: 'travel',
    description: 'Flight to New York for client meeting',
    date: '2025-01-15',
    status: 'pending',
    approvals: [
      {
        approverId: 'user-2',
        approverName: 'Sarah Manager',
        approverRole: 'Manager',
        status: 'pending',
      },
    ],
    createdAt: '2025-01-16T10:00:00Z',
    updatedAt: '2025-01-16T10:00:00Z',
  },
  {
    id: 'exp-2',
    employeeId: 'user-3',
    employeeName: 'Mike Employee',
    amount: 85,
    currency: 'USD',
    amountInCompanyCurrency: 85,
    category: 'meals',
    description: 'Team lunch with clients',
    date: '2025-01-14',
    status: 'approved',
    approvals: [
      {
        approverId: 'user-2',
        approverName: 'Sarah Manager',
        approverRole: 'Manager',
        status: 'approved',
        comment: 'Approved - valid business expense',
        timestamp: '2025-01-15T14:30:00Z',
      },
    ],
    createdAt: '2025-01-14T18:00:00Z',
    updatedAt: '2025-01-15T14:30:00Z',
  },
  {
    id: 'exp-3',
    employeeId: 'user-4',
    employeeName: 'Lisa Employee',
    amount: 150,
    currency: 'EUR',
    amountInCompanyCurrency: 177,
    exchangeRate: 1.18,
    category: 'office',
    description: 'Office supplies from European supplier',
    date: '2025-01-13',
    status: 'pending',
    approvals: [
      {
        approverId: 'user-2',
        approverName: 'Sarah Manager',
        approverRole: 'Manager',
        status: 'pending',
      },
    ],
    createdAt: '2025-01-13T16:00:00Z',
    updatedAt: '2025-01-13T16:00:00Z',
  },
  {
    id: 'exp-4',
    employeeId: 'user-3',
    employeeName: 'Mike Employee',
    amount: 2500,
    currency: 'INR',
    amountInCompanyCurrency: 30,
    exchangeRate: 0.012,
    category: 'travel',
    description: 'Local transportation for client visits',
    date: '2025-01-12',
    status: 'approved',
    approvals: [
      {
        approverId: 'user-2',
        approverName: 'Sarah Manager',
        approverRole: 'Manager',
        status: 'approved',
        comment: 'Approved - valid business travel expense',
        timestamp: '2025-01-12T14:30:00Z',
      },
    ],
    createdAt: '2025-01-12T10:00:00Z',
    updatedAt: '2025-01-12T14:30:00Z',
  },
  {
    id: 'exp-5',
    employeeId: 'user-4',
    employeeName: 'Lisa Employee',
    amount: 75,
    currency: 'GBP',
    amountInCompanyCurrency: 103,
    exchangeRate: 1.37,
    category: 'meals',
    description: 'Client dinner meeting',
    date: '2025-01-11',
    status: 'rejected',
    approvals: [
      {
        approverId: 'user-2',
        approverName: 'Sarah Manager',
        approverRole: 'Manager',
        status: 'rejected',
        comment: 'Rejected - exceeds meal allowance limit',
        timestamp: '2025-01-11T16:45:00Z',
      },
    ],
    createdAt: '2025-01-11T12:00:00Z',
    updatedAt: '2025-01-11T16:45:00Z',
  },
];

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

  // Mock currency conversion rates
  const getExchangeRate = (fromCurrency: string, toCurrency: string): number => {
    const rates: Record<string, Record<string, number>> = {
      'USD': { 'EUR': 0.85, 'GBP': 0.73, 'INR': 83.0, 'JPY': 110.0, 'CAD': 1.25, 'AUD': 1.35 },
      'EUR': { 'USD': 1.18, 'GBP': 0.86, 'INR': 97.5, 'JPY': 129.0, 'CAD': 1.47, 'AUD': 1.59 },
      'GBP': { 'USD': 1.37, 'EUR': 1.16, 'INR': 113.5, 'JPY': 150.0, 'CAD': 1.71, 'AUD': 1.85 },
      'INR': { 'USD': 0.012, 'EUR': 0.010, 'GBP': 0.009, 'JPY': 1.33, 'CAD': 0.015, 'AUD': 0.016 },
      'JPY': { 'USD': 0.009, 'EUR': 0.008, 'GBP': 0.007, 'INR': 0.75, 'CAD': 0.011, 'AUD': 0.012 },
      'CAD': { 'USD': 0.80, 'EUR': 0.68, 'GBP': 0.58, 'INR': 66.4, 'JPY': 88.0, 'AUD': 1.08 },
      'AUD': { 'USD': 0.74, 'EUR': 0.63, 'GBP': 0.54, 'INR': 61.5, 'JPY': 81.5, 'CAD': 0.93 },
    };
    
    if (fromCurrency === toCurrency) return 1;
    return rates[fromCurrency]?.[toCurrency] || 1;
  };

  const convertCurrency = async (amount: number, fromCurrency: string, toCurrency: string): Promise<number> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const rate = getExchangeRate(fromCurrency, toCurrency);
    return amount * rate;
  };

  const addExpense = async (expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'approvals'>) => {
    // Convert to company currency if different
    let amountInCompanyCurrency = expenseData.amount;
    let exchangeRate = 1;
    
    if (expenseData.currency !== 'USD') { // Assuming USD is company currency for now
      amountInCompanyCurrency = await convertCurrency(expenseData.amount, expenseData.currency, 'USD');
      exchangeRate = getExchangeRate(expenseData.currency, 'USD');
    }

    const newExpense: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}`,
      amountInCompanyCurrency,
      exchangeRate,
      status: 'pending',
      approvals: [
        {
          approverId: 'mgr-1',
          approverName: 'Manager',
          approverRole: 'Manager',
          status: 'pending',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setExpenses([newExpense, ...expenses]);
  };

  const updateExpenseStatus = (id: string, status: ExpenseStatus, approverId: string, comment?: string) => {
    setExpenses(expenses.map(expense => {
      if (expense.id === id) {
        const updatedApprovals = expense.approvals.map(approval => {
          if (approval.approverId === approverId) {
            return {
              ...approval,
              status,
              comment,
              timestamp: new Date().toISOString(),
            };
          }
          return approval;
        });

        return {
          ...expense,
          status,
          approvals: updatedApprovals,
          updatedAt: new Date().toISOString(),
        };
      }
      return expense;
    }));
  };

  const getExpensesByEmployee = (employeeId: string) => {
    return expenses.filter(expense => expense.employeeId === employeeId);
  };

  const getPendingApprovals = (approverId: string) => {
    return expenses.filter(expense => 
      expense.approvals.some(approval => 
        approval.approverId === approverId && approval.status === 'pending'
      )
    );
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        addExpense,
        updateExpenseStatus,
        getExpensesByEmployee,
        getPendingApprovals,
        convertCurrency,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};
