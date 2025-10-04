import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useExpenses } from '@/contexts/ExpenseContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Receipt, CheckCircle, XCircle, Clock, User, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const Approvals = () => {
  const { user, users } = useAuth();
  const { expenses, updateExpenseStatus } = useExpenses();
  interface Expense {
    id: string;
    description: string;
    date: string;
    employeeId: string;
    employeeName: string;
    category: string;
    status: string;
    amount: number;
    currency: string;
    amountInCompanyCurrency?: number;
    createdAt: string;
  }

  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [comment, setComment] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  // Get expenses that need approval based on user role and hierarchy
  const getPendingApprovals = () => {
    if (!user) return [];

    switch (user.role) {
      case 'admin':
        // Admins can approve all pending expenses
        return expenses.filter(expense => expense.status === 'pending');
      case 'manager': {
        // Managers can approve expenses from their subordinates
        const subordinateIds = users.filter(u => u.managerId === user.id).map(u => u.id);
        return expenses.filter(expense => 
          expense.status === 'pending' && 
          (subordinateIds.includes(expense.employeeId) || expense.employeeId === user.id)
        );
      }
      default:
        return [];
    }
  };

  const pendingExpenses = getPendingApprovals();

  const handleAction = () => {
    if (!selectedExpense || !user || !actionType) return;
    
    if (actionType === 'reject' && !comment.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    
    updateExpenseStatus(selectedExpense.id, actionType === 'approve' ? 'approved' : 'rejected', user.id, comment);
    toast.success(`Expense ${actionType === 'approve' ? 'approved' : 'rejected'} successfully`);
    setIsDialogOpen(false);
    setComment('');
    setSelectedExpense(null);
    setActionType(null);
  };

  const openExpenseDialog = (expense: Expense, action: 'approve' | 'reject') => {
    setSelectedExpense(expense);
    setActionType(action);
    setComment('');
    setIsDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">Pending Approvals</h1>
          <p className="text-muted-foreground mt-2">
            Review and approve expense claims
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Awaiting Review
              </CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingExpenses.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Amount
              </CardTitle>
              <Receipt className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${pendingExpenses.reduce((sum, exp) => sum + (exp.amountInCompanyCurrency || exp.amount), 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Approved Today
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {expenses.filter(e => e.status === 'approved').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                My Subordinates
              </CardTitle>
              <User className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {user?.role === 'manager' ? users.filter(u => u.managerId === user.id).length : 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Expenses - Table View */}
        <Card>
          <CardHeader>
            <CardTitle>Approvals to Review</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingExpenses.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No pending approvals</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Approval Subject</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Request Owner</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Category</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Request Status</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Total Amount (in company's currency)</th>
                      <th className="text-center py-3 px-4 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingExpenses.map((expense) => (
                      <tr 
                        key={expense.id} 
                        className="border-b hover:bg-accent/50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="font-medium">{expense.description}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(expense.date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-medium">{expense.employeeName}</div>
                          <div className="text-sm text-muted-foreground">
                            {users.find(u => u.id === expense.employeeId)?.email}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant="outline" className="capitalize">
                            {expense.category}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <Badge 
                            className={
                              expense.status === 'approved'
                                ? 'bg-success/10 text-success'
                                : expense.status === 'rejected'
                                ? 'bg-destructive/10 text-destructive'
                                : 'bg-warning/10 text-warning'
                            }
                          >
                            {expense.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-medium">
                            {expense.currency !== 'USD' ? (
                              <div>
                                <div>{expense.amount.toLocaleString()} {expense.currency}</div>
                                <div className="text-sm text-muted-foreground">
                                  = {expense.amountInCompanyCurrency?.toFixed(0) || expense.amount} USD
                                </div>
                              </div>
                            ) : (
                              <div>{expense.amount.toLocaleString()} USD</div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2 justify-center">
                            {expense.status === 'pending' ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-success border-success hover:bg-success hover:text-white"
                                  onClick={() => openExpenseDialog(expense, 'approve')}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-destructive border-destructive hover:bg-destructive hover:text-white"
                                  onClick={() => openExpenseDialog(expense, 'reject')}
                                >
                                  Reject
                                </Button>
                              </>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                {expense.status === 'approved' ? 'Approved' : 'Rejected'}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Approval Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {actionType === 'approve' ? 'Approve Expense' : 'Reject Expense'}
              </DialogTitle>
              <DialogDescription>
                {actionType === 'approve' 
                  ? 'Review and approve this expense claim'
                  : 'Review and reject this expense claim'
                }
              </DialogDescription>
            </DialogHeader>
            {selectedExpense && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Employee</p>
                    <p className="font-medium">{selectedExpense.employeeName}</p>
                    <p className="text-xs text-muted-foreground">
                      {users.find(u => u.id === selectedExpense.employeeId)?.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="font-medium text-xl">
                      ${selectedExpense.amount.toLocaleString()} {selectedExpense.currency}
                    </p>
                    {selectedExpense.amountInCompanyCurrency && selectedExpense.currency !== 'USD' && (
                      <p className="text-sm text-muted-foreground">
                        ≈ ${selectedExpense.amountInCompanyCurrency.toFixed(2)} USD
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Expense Date</p>
                    <p className="font-medium">
                      {new Date(selectedExpense.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <Badge>{selectedExpense.category}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Submitted</p>
                    <p className="font-medium">
                      {new Date(selectedExpense.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className="bg-warning/10 text-warning">Pending</Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Description</p>
                  <p>{selectedExpense.description}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {actionType === 'approve' ? 'Comment (optional)' : 'Reason for rejection (required)'}
                  </p>
                  <Textarea
                    placeholder={actionType === 'approve' ? 'Add your comments...' : 'Please provide a reason for rejection...'}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    required={actionType === 'reject'}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleAction} 
                    className={`flex-1 ${
                      actionType === 'approve' 
                        ? 'bg-success hover:bg-success/90' 
                        : 'bg-destructive hover:bg-destructive/90'
                    }`}
                  >
                    {actionType === 'approve' ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve Expense
                      </>
                    ) : (
                      <>
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject Expense
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => setIsDialogOpen(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Approvals;
