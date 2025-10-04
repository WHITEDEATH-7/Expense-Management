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
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

// Mock data
const mockExpenses: Expense[] = [
  {
    id: 'exp-1',
    employeeId: '1',
    employeeName: 'John Doe',
    amount: 1200,
    currency: 'USD',
    amountInCompanyCurrency: 1200,
    category: 'travel',
    description: 'Flight to New York for client meeting',
    date: '2025-01-15',
    status: 'pending',
    approvals: [
      {
        approverId: 'mgr-1',
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
    employeeId: '2',
    employeeName: 'Jane Smith',
    amount: 85,
    currency: 'USD',
    amountInCompanyCurrency: 85,
    category: 'meals',
    description: 'Team lunch with clients',
    date: '2025-01-14',
    status: 'approved',
    approvals: [
      {
        approverId: 'mgr-1',
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
];

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);

  const addExpense = (expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'approvals'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}`,
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
