import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ExpenseDashboard from '@/components/expense/ExpenseDashboard';

const ExpenseDemo = () => {
  return (
    <DashboardLayout>
      <ExpenseDashboard />
    </DashboardLayout>
  );
};

export default ExpenseDemo;
