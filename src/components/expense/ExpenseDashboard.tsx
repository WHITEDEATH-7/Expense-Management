import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useExpenses } from '@/contexts/ExpenseContext';
import StatusPipeline from './StatusPipeline';
import ActionButtons from './ActionButtons';
import ExpenseTable from './ExpenseTable';
import ReceiptUpload from './ReceiptUpload';
import { Expense, Employee, StatusPipeline as StatusPipelineType, ExpenseFormData } from '@/types/expense';
import { toast } from '@/hooks/use-toast';

const ExpenseDashboard: React.FC = () => {
  const { user } = useAuth();
  const { expenses, addExpense } = useExpenses();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [statusPipeline, setStatusPipeline] = useState<StatusPipelineType>({
    toSubmit: 0,
    waiting: 0,
    approved: 0,
  });

  // Mock employee data with colors for labels
  const mockEmployees: Employee[] = [
    { id: 'user-1', name: 'Fancy Stingray', email: 'fancy@company.com', role: 'employee', color: '#FF6B6B' },
    { id: 'user-2', name: 'ZeroDayZens', email: 'zero@company.com', role: 'employee', color: '#4ECDC4' },
    { id: 'user-3', name: 'Sarah Johnson', email: 'sarah@company.com', role: 'employee', color: '#45B7D1' },
    { id: 'user-4', name: 'Mike Chen', email: 'mike@company.com', role: 'employee', color: '#96CEB4' },
    { id: 'user-5', name: 'Lisa Rodriguez', email: 'lisa@company.com', role: 'employee', color: '#FFEAA7' },
    { id: 'user-6', name: 'John Admin', email: 'john@company.com', role: 'admin', color: '#DDA0DD' },
  ];

  // Sample expense data matching the wireframe
  const sampleExpenses: Expense[] = [
    {
      id: 'exp-1',
      employeeId: 'user-3',
      employeeName: 'Sarah',
      amount: 5000,
      currency: 'rs',
      category: 'food',
      description: 'Restaurant bill',
      date: '2025-10-04',
      status: 'draft',
      paidBy: 'Sarah',
      remarks: 'None',
      approvals: [],
      createdAt: '2025-01-16T10:00:00Z',
      updatedAt: '2025-01-16T10:00:00Z',
    },
    {
      id: 'exp-2',
      employeeId: 'user-1',
      employeeName: 'Fancy Stingray',
      amount: 15000,
      currency: 'rs',
      category: 'travel',
      description: 'Flight tickets to Mumbai',
      date: '2025-01-15',
      status: 'submitted',
      paidBy: 'Fancy Stingray',
      remarks: 'Business trip',
      approvals: [
        {
          approverId: 'mgr-1',
          approverName: 'Manager',
          approverRole: 'Manager',
          status: 'pending',
        },
      ],
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-01-15T10:00:00Z',
    },
    {
      id: 'exp-3',
      employeeId: 'user-2',
      employeeName: 'ZeroDayZens',
      amount: 2500,
      currency: 'rs',
      category: 'office',
      description: 'Office supplies',
      date: '2025-01-14',
      status: 'waiting_approval',
      paidBy: 'ZeroDayZens',
      remarks: 'Stationery items',
      approvals: [
        {
          approverId: 'mgr-1',
          approverName: 'Manager',
          approverRole: 'Manager',
          status: 'pending',
        },
      ],
      createdAt: '2025-01-14T10:00:00Z',
      updatedAt: '2025-01-14T10:00:00Z',
    },
    {
      id: 'exp-4',
      employeeId: 'user-4',
      employeeName: 'Mike Chen',
      amount: 8000,
      currency: 'rs',
      category: 'accommodation',
      description: 'Hotel booking',
      date: '2025-01-13',
      status: 'approved',
      paidBy: 'Mike Chen',
      remarks: 'Client meeting',
      approvals: [
        {
          approverId: 'mgr-1',
          approverName: 'Manager',
          approverRole: 'Manager',
          status: 'approved',
          comment: 'Approved - valid business expense',
          timestamp: '2025-01-13T14:30:00Z',
        },
      ],
      createdAt: '2025-01-13T10:00:00Z',
      updatedAt: '2025-01-13T14:30:00Z',
    },
  ];

  useEffect(() => {
    setEmployees(mockEmployees);
    
    // Combine sample data with existing expenses
    const allExpenses = [...sampleExpenses, ...expenses];
    setFilteredExpenses(allExpenses);
    
    // Calculate status pipeline totals
    const totals = allExpenses.reduce(
      (acc, expense) => {
        switch (expense.status) {
          case 'draft':
            acc.toSubmit += expense.amount;
            break;
          case 'submitted':
          case 'waiting_approval':
            acc.waiting += expense.amount;
            break;
          case 'approved':
            acc.approved += expense.amount;
            break;
        }
        return acc;
      },
      { toSubmit: 0, waiting: 0, approved: 0 }
    );
    
    setStatusPipeline(totals);
  }, [expenses]);

  const handleUpload = () => {
    setIsUploadOpen(true);
  };

  const handleNew = () => {
    // Navigate to new expense form or open inline form
    toast({
      title: "New Expense",
      description: "Create a new expense manually",
    });
  };

  const handleOCRComplete = async (formData: ExpenseFormData) => {
    try {
      // Create expense from OCR data
      const newExpense = {
        employeeId: user?.id || 'current-user',
        employeeName: user?.name || 'Current User',
        amount: formData.amount,
        currency: formData.currency,
        category: formData.category,
        description: formData.description,
        date: formData.date,
        paidBy: formData.paidBy,
        remarks: formData.remarks,
        receiptUrl: formData.receiptFile ? URL.createObjectURL(formData.receiptFile) : undefined,
      };

      await addExpense(newExpense);
      
      toast({
        title: "Expense Created",
        description: "Your expense has been created successfully from the receipt.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create expense. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUploadClose = () => {
    setIsUploadOpen(false);
  };

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Expense Management</h1>
          <p className="text-gray-600 mt-1">Manage and track your expense reimbursements</p>
        </div>
        <ActionButtons onUpload={handleUpload} onNew={handleNew} />
      </div>

      {/* Status Pipeline */}
      <StatusPipeline totals={statusPipeline} />

      {/* Expense Table */}
      <ExpenseTable expenses={filteredExpenses} employees={employees} />

      {/* Receipt Upload Modal */}
      <ReceiptUpload
        isOpen={isUploadOpen}
        onClose={handleUploadClose}
        onOCRComplete={handleOCRComplete}
      />
    </div>
  );
};

export default ExpenseDashboard;
