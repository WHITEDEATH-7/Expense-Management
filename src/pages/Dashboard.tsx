import { useAuth } from '@/contexts/AuthContext';
import { useExpenses } from '@/contexts/ExpenseContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Receipt, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const { expenses, getExpensesByEmployee, getPendingApprovals } = useExpenses();
  const navigate = useNavigate();

  const userExpenses = user?.role === 'employee' ? getExpensesByEmployee(user.id) : expenses;
  const pendingApprovals = user?.role === 'manager' || user?.role === 'admin' 
    ? getPendingApprovals(user.id) 
    : [];

  const stats = {
    total: userExpenses.reduce((sum, exp) => sum + exp.amount, 0),
    pending: userExpenses.filter(e => e.status === 'pending').length,
    approved: userExpenses.filter(e => e.status === 'approved').length,
    rejected: userExpenses.filter(e => e.status === 'rejected').length,
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color,
    trend
  }: { 
    title: string; 
    value: string | number; 
    icon: any; 
    color: string;
    trend?: string;
  }) => (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && <p className="text-xs text-muted-foreground mt-1">{trend}</p>}
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-muted-foreground mt-2">
            Here's an overview of your expense management
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Expenses"
            value={`$${stats.total.toLocaleString()}`}
            icon={Receipt}
            color="bg-primary/10 text-primary"
            trend="+12% from last month"
          />
          <StatCard
            title="Pending"
            value={stats.pending}
            icon={Clock}
            color="bg-warning/10 text-warning"
            trend={`${pendingApprovals.length} awaiting your approval`}
          />
          <StatCard
            title="Approved"
            value={stats.approved}
            icon={CheckCircle}
            color="bg-success/10 text-success"
            trend="This month"
          />
          <StatCard
            title="Rejected"
            value={stats.rejected}
            icon={XCircle}
            color="bg-destructive/10 text-destructive"
            trend="Review and resubmit"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="transition-all hover:shadow-md cursor-pointer" onClick={() => navigate('/submit-expense')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                Submit New Expense
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create a new expense claim with receipt upload
              </p>
              <Button className="mt-4 w-full">Submit Expense</Button>
            </CardContent>
          </Card>

          {(user?.role === 'manager' || user?.role === 'admin') && (
            <Card className="transition-all hover:shadow-md cursor-pointer" onClick={() => navigate('/approvals')}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Review Approvals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {pendingApprovals.length} expenses awaiting your review
                </p>
                <Button className="mt-4 w-full" variant="secondary">
                  Review Now
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Expense Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View detailed analytics and trends
              </p>
              <Button className="mt-4 w-full" variant="outline">
                View Reports
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Expenses */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userExpenses.slice(0, 5).map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Receipt className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {expense.category} • {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      ${expense.amount} {expense.currency}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        expense.status === 'approved'
                          ? 'bg-success/10 text-success'
                          : expense.status === 'rejected'
                          ? 'bg-destructive/10 text-destructive'
                          : 'bg-warning/10 text-warning'
                      }`}
                    >
                      {expense.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
