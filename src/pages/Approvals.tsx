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
  const { user } = useAuth();
  const { expenses, updateExpenseStatus } = useExpenses();
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [comment, setComment] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const pendingExpenses = expenses.filter(expense =>
    expense.approvals.some(
      approval => approval.approverId === user?.id && approval.status === 'pending'
    )
  );

  const handleApprove = () => {
    if (!selectedExpense || !user) return;
    updateExpenseStatus(selectedExpense.id, 'approved', user.id, comment);
    toast.success('Expense approved successfully');
    setIsDialogOpen(false);
    setComment('');
    setSelectedExpense(null);
  };

  const handleReject = () => {
    if (!selectedExpense || !user) return;
    if (!comment.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    updateExpenseStatus(selectedExpense.id, 'rejected', user.id, comment);
    toast.success('Expense rejected');
    setIsDialogOpen(false);
    setComment('');
    setSelectedExpense(null);
  };

  const openExpenseDialog = (expense: any) => {
    setSelectedExpense(expense);
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
        <div className="grid gap-4 md:grid-cols-3">
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
                ${pendingExpenses.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString()}
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
        </div>

        {/* Pending Expenses */}
        <Card>
          <CardHeader>
            <CardTitle>Expenses Awaiting Your Approval</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingExpenses.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No pending approvals</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => openExpenseDialog(expense)}
                  >
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <Receipt className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-medium">{expense.description}</p>
                            <Badge className="bg-warning/10 text-warning">Pending</Badge>
                          </div>
                          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {expense.employeeName}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(expense.date).toLocaleDateString()}
                            </span>
                            <Badge className="text-xs">{expense.category}</Badge>
                          </div>
                          
                          {/* Approval Progress */}
                          <div className="mt-3 flex items-center gap-2">
                            {expense.approvals.map((approval: any, idx: number) => (
                              <div key={idx} className="flex items-center gap-2">
                                {idx > 0 && <div className="w-4 h-px bg-border" />}
                                <div
                                  className={`p-1.5 rounded-full ${
                                    approval.status === 'approved'
                                      ? 'bg-success/10 text-success'
                                      : approval.status === 'rejected'
                                      ? 'bg-destructive/10 text-destructive'
                                      : 'bg-warning/10 text-warning'
                                  }`}
                                >
                                  {approval.status === 'approved' ? (
                                    <CheckCircle className="h-3 w-3" />
                                  ) : approval.status === 'rejected' ? (
                                    <XCircle className="h-3 w-3" />
                                  ) : (
                                    <Clock className="h-3 w-3" />
                                  )}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {approval.approverRole}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">
                          ${expense.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">{expense.currency}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Approval Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Review Expense</DialogTitle>
              <DialogDescription>
                Review the details and approve or reject this expense claim
              </DialogDescription>
            </DialogHeader>
            {selectedExpense && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Employee</p>
                    <p className="font-medium">{selectedExpense.employeeName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="font-medium text-xl">
                      ${selectedExpense.amount} {selectedExpense.currency}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">
                      {new Date(selectedExpense.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <Badge>{selectedExpense.category}</Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Description</p>
                  <p>{selectedExpense.description}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Comment (optional)</p>
                  <Textarea
                    placeholder="Add your comments..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleApprove} className="flex-1">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                  <Button
                    onClick={handleReject}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
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
