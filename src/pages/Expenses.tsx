import { useState, useContext } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useExpenses } from '@/contexts/ExpenseContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Receipt, Calendar, DollarSign, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthContext } from '@/contexts/AuthContext';

type AuthUser = {
  id: string;
  role: 'employee' | 'manager' | 'admin';
  managerId?: string; // Added for manager relationship
  // add other user properties as needed
};

type AuthContextType = {
  user: AuthUser | null;
  users: AuthUser[];
};

function useAuth(): AuthContextType {
  const context = useContext(AuthContext) as AuthContextType | undefined;
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return {
    user: context.user,
    users: context.users,
  };
}

const Expenses = () => {
  const { user, users } = useAuth();
  const { expenses, getExpensesByEmployee } = useExpenses();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Get expenses based on user role
  const getUserExpenses = () => {
    if (!user) return [];
    switch (user.role) {
      case 'employee':
        return getExpensesByEmployee(user.id);
      case 'manager': {
        // Managers see expenses from their subordinates
        const subordinateIds: string[] = users
          .filter((u: AuthUser) => u.managerId === user.id)
          .map((u: AuthUser) => u.id);
        return expenses.filter(
          exp =>
            exp.employeeId === user.id ||
            subordinateIds.includes(exp.employeeId)
        );
      }
      case 'admin':
        // Admins see all expenses
        return expenses;
      default:
        return [];
    }
  };

  const userExpenses = getUserExpenses();

  const filteredExpenses = userExpenses.filter(expense => {
    const matchesSearch =
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || expense.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalAmount = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-success/10 text-success">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-destructive/10 text-destructive">Rejected</Badge>;
      default:
        return <Badge className="bg-warning/10 text-warning">Pending</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      travel: 'bg-primary/10 text-primary',
      meals: 'bg-warning/10 text-warning',
      office: 'bg-accent/50 text-accent-foreground',
      accommodation: 'bg-success/10 text-success',
      other: 'bg-muted text-muted-foreground',
    };
    return <Badge className={colors[category]}>{category}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">All Expenses</h1>
          <p className="text-muted-foreground mt-2">
            View and manage all company expenses
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalAmount.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
              <Receipt className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userExpenses.filter(e => e.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
              <Receipt className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userExpenses.filter(e => e.status === 'approved').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
              <Receipt className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userExpenses.filter(e => e.status === 'rejected').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="meals">Meals</SelectItem>
                    <SelectItem value="office">Office</SelectItem>
                    <SelectItem value="accommodation">Accommodation</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredExpenses.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No expenses found matching your filters
                </div>
              ) : (
                filteredExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors gap-4"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Receipt className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="font-medium truncate">{expense.description}</p>
                          {getStatusBadge(expense.status)}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(expense.date).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span>{expense.employeeName}</span>
                          <span>•</span>
                          {getCategoryBadge(expense.category)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xl font-bold">
                          ${expense.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">{expense.currency}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Expenses;
