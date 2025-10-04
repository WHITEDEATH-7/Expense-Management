import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Settings as SettingsIcon, Workflow, Percent, User, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface ApprovalRule {
  id: string;
  type: 'percentage' | 'specific' | 'hybrid';
  threshold?: number;
  approver?: string;
  description: string;
}

const Settings = () => {
  const [approvalLevels, setApprovalLevels] = useState([
    { id: '1', level: 1, role: 'Manager', autoApprove: false },
    { id: '2', level: 2, role: 'Finance', autoApprove: false },
    { id: '3', level: 3, role: 'Director', autoApprove: false },
  ]);

  const [rules, setRules] = useState<ApprovalRule[]>([
    {
      id: '1',
      type: 'percentage',
      threshold: 60,
      description: '60% approval required to pass',
    },
    {
      id: '2',
      type: 'specific',
      approver: 'CFO',
      description: 'CFO can auto-approve any expense',
    },
  ]);

  const [newLevel, setNewLevel] = useState({
    role: '',
    autoApprove: false,
  });

  const addApprovalLevel = () => {
    if (!newLevel.role) {
      toast.error('Please enter a role');
      return;
    }

    const newApprovalLevel = {
      id: `${Date.now()}`,
      level: approvalLevels.length + 1,
      role: newLevel.role,
      autoApprove: newLevel.autoApprove,
    };

    setApprovalLevels([...approvalLevels, newApprovalLevel]);
    setNewLevel({ role: '', autoApprove: false });
    toast.success('Approval level added');
  };

  const removeApprovalLevel = (id: string) => {
    setApprovalLevels(approvalLevels.filter(level => level.id !== id));
    toast.success('Approval level removed');
  };

  const saveSettings = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Configure approval workflows and system preferences
          </p>
        </div>

        {/* Approval Workflow Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Workflow className="h-5 w-5" />
              Multi-Level Approval Workflow
            </CardTitle>
            <CardDescription>
              Define the sequence of approvers for expense claims
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Levels */}
            <div className="space-y-3">
              <Label>Approval Sequence</Label>
              <div className="space-y-2">
                {approvalLevels.map((level, index) => (
                  <div
                    key={level.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      <Badge className="bg-primary/10 text-primary">
                        Level {level.level}
                      </Badge>
                      <div>
                        <p className="font-medium">{level.role}</p>
                        {level.autoApprove && (
                          <p className="text-xs text-muted-foreground">Auto-approve enabled</p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeApprovalLevel(level.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Add New Level */}
            <div className="border-t pt-4">
              <Label className="mb-3 block">Add New Approval Level</Label>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="Role (e.g., Senior Manager)"
                  value={newLevel.role}
                  onChange={(e) => setNewLevel({ ...newLevel, role: e.target.value })}
                  className="flex-1"
                />
                <div className="flex items-center gap-2">
                  <Switch
                    checked={newLevel.autoApprove}
                    onCheckedChange={(checked) =>
                      setNewLevel({ ...newLevel, autoApprove: checked })
                    }
                  />
                  <Label className="text-sm">Auto-approve</Label>
                </div>
                <Button onClick={addApprovalLevel}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Level
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Approval Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="h-5 w-5" />
              Conditional Approval Rules
            </CardTitle>
            <CardDescription>
              Set up rules for automated approval decisions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex items-center gap-4">
                  {rule.type === 'percentage' ? (
                    <Percent className="h-5 w-5 text-primary" />
                  ) : (
                    <User className="h-5 w-5 text-primary" />
                  )}
                  <div>
                    <Badge className="mb-1 text-xs">{rule.type}</Badge>
                    <p className="text-sm">{rule.description}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <div className="border-t pt-4">
              <Label className="mb-3 block">Add New Rule</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Rule type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage Rule</SelectItem>
                    <SelectItem value="specific">Specific Approver</SelectItem>
                    <SelectItem value="hybrid">Hybrid Rule</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Threshold / Approver" />
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rule
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Currency Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Currency & Conversion
            </CardTitle>
            <CardDescription>
              Configure default currency and conversion settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company Base Currency</Label>
                <Select defaultValue="USD">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Auto-convert to base currency</Label>
                <div className="flex items-center gap-2 h-10">
                  <Switch defaultChecked />
                  <span className="text-sm text-muted-foreground">Enabled</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={saveSettings} size="lg">
            Save All Settings
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
