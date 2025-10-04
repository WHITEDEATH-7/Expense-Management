import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Expense, Employee } from '@/types/expense';
import { format } from 'date-fns';

interface ExpenseTableProps {
  expenses: Expense[];
  employees: Employee[];
  className?: string;
}

const ExpenseTable: React.FC<ExpenseTableProps> = ({ expenses, employees, className = '' }) => {
  const getEmployeeColor = (employeeId: string): string => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee?.color || '#6B7280';
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Draft' },
      submitted: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Submitted' },
      waiting_approval: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Waiting Approval' },
      approved: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Approved' },
      rejected: { color: 'bg-gray-100 text-gray-800 border-gray-200', label: 'Rejected' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <Badge 
        variant="outline" 
        className={`${config.color} border rounded-full px-3 py-1 text-xs font-medium`}
      >
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (amount: number, currency: string = 'rs') => {
    return `${amount.toLocaleString()} ${currency}`;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Expense Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 md:px-4 font-medium text-gray-700 text-sm">Employee</th>
                <th className="text-left py-3 px-2 md:px-4 font-medium text-gray-700 text-sm">Description</th>
                <th className="text-left py-3 px-2 md:px-4 font-medium text-gray-700 text-sm">Date</th>
                <th className="text-left py-3 px-2 md:px-4 font-medium text-gray-700 text-sm">Category</th>
                <th className="text-left py-3 px-2 md:px-4 font-medium text-gray-700 text-sm">Paid By</th>
                <th className="text-left py-3 px-2 md:px-4 font-medium text-gray-700 text-sm hidden md:table-cell">Remarks</th>
                <th className="text-left py-3 px-2 md:px-4 font-medium text-gray-700 text-sm">Amount</th>
                <th className="text-left py-3 px-2 md:px-4 font-medium text-gray-700 text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense, index) => (
                <tr 
                  key={expense.id} 
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                  }`}
                >
                  <td className="py-4 px-2 md:px-4">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: getEmployeeColor(expense.employeeId) }}
                      />
                      <span className="font-medium text-gray-900 text-sm truncate">{expense.employeeName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-2 md:px-4 text-gray-700 text-sm truncate max-w-[200px]">{expense.description}</td>
                  <td className="py-4 px-2 md:px-4 text-gray-700 text-sm">{formatDate(expense.date)}</td>
                  <td className="py-4 px-2 md:px-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                      {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-2 md:px-4 text-gray-700 text-sm">{expense.paidBy}</td>
                  <td className="py-4 px-2 md:px-4 text-gray-700 text-sm hidden md:table-cell">{expense.remarks || 'None'}</td>
                  <td className="py-4 px-2 md:px-4 font-semibold text-gray-900 text-sm">
                    {formatCurrency(expense.amount, expense.currency)}
                  </td>
                  <td className="py-4 px-2 md:px-4">
                    {getStatusBadge(expense.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {expenses.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg font-medium">No expenses found</p>
              <p className="text-sm">Start by creating a new expense or uploading a receipt</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseTable;
