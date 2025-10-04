# Expense Dashboard Component

A comprehensive React expense management interface built with TypeScript, featuring OCR receipt processing, status pipeline tracking, and responsive design.

## Features

### 🎯 Core Functionality
- **Status Pipeline**: Visual progression tracking (To Submit → Waiting Approval → Approved)
- **OCR Receipt Upload**: Automatic data extraction from receipt images
- **Expense Table**: Comprehensive expense management with all required columns
- **Responsive Design**: Mobile-first approach with adaptive layouts

### 📊 Status Pipeline
- **To Submit**: Draft expenses awaiting submission (5467 rs)
- **Waiting Approval**: Submitted expenses in approval workflow (33674 rs)  
- **Approved**: Finally approved expenses (500 rs)
- Real-time totals calculation
- Color-coded status indicators

### 🔍 OCR Integration
- **File Upload**: Support for image files and PDFs
- **Camera Capture**: Direct photo capture for receipts
- **Auto-Population**: Extracts amount, date, merchant, and category
- **Manual Editing**: Allows corrections after OCR processing
- **Confidence Scoring**: Shows OCR accuracy percentage

### 📋 Expense Table
- **Employee Column**: Color-coded employee labels
- **Description**: Expense details and merchant names
- **Date**: Formatted date display
- **Category**: Food, Travel, Office, Accommodation, Entertainment, Other
- **Paid By**: Who paid for the expense
- **Remarks**: Additional notes (hidden on mobile)
- **Amount**: Currency-formatted amounts
- **Status**: Color-coded status badges

### 🎨 Design Features
- **Dark Theme**: Modern dark theme with rounded corners
- **Status Badges**: Red (Draft), Green (Submitted), Blue (Approved)
- **Hover Effects**: Interactive table rows and buttons
- **Mobile Responsive**: Optimized for all screen sizes
- **Loading States**: Smooth transitions and loading indicators

## Component Structure

```
src/components/expense/
├── ExpenseDashboard.tsx      # Main dashboard component
├── StatusPipeline.tsx        # Status progression display
├── ActionButtons.tsx         # Upload and New buttons
├── ExpenseTable.tsx          # Data table with all columns
└── ReceiptUpload.tsx         # OCR upload modal

src/types/
└── expense.ts                # TypeScript interfaces
```

## Usage

### Basic Implementation
```tsx
import ExpenseDashboard from '@/components/expense/ExpenseDashboard';

function App() {
  return <ExpenseDashboard />;
}
```

### With Dashboard Layout
```tsx
import DashboardLayout from '@/components/layout/DashboardLayout';
import ExpenseDashboard from '@/components/expense/ExpenseDashboard';

function DashboardPage() {
  return (
    <DashboardLayout>
      <ExpenseDashboard />
    </DashboardLayout>
  );
}
```

### Tab Integration
```tsx
const [activeTab, setActiveTab] = useState<'overview' | 'expenses'>('overview');

return (
  <div>
    {activeTab === 'expenses' ? <ExpenseDashboard /> : <OverviewContent />}
  </div>
);
```

## Data Types

### Expense Interface
```typescript
interface Expense {
  id: string;
  employeeId: string;
  employeeName: string;
  amount: number;
  currency: string;
  category: ExpenseCategory;
  description: string;
  date: string;
  status: ExpenseStatus;
  paidBy: string;
  remarks?: string;
  receiptUrl?: string;
  approvals: Approval[];
  createdAt: string;
  updatedAt: string;
}
```

### Status Types
```typescript
type ExpenseStatus = 'draft' | 'submitted' | 'waiting_approval' | 'approved' | 'rejected';
type ExpenseCategory = 'food' | 'travel' | 'office' | 'accommodation' | 'entertainment' | 'other';
```

## OCR Processing

### Supported Features
- **Amount Extraction**: Automatic currency detection and parsing
- **Date Recognition**: Multiple date format support
- **Merchant Detection**: Business name extraction
- **Category Classification**: Smart categorization based on merchant type
- **Line Items**: Individual expense item extraction
- **Confidence Scoring**: OCR accuracy percentage

### Mock Implementation
The current implementation includes a mock OCR service that simulates:
- 2-second processing delay
- 85-100% confidence scores
- Realistic data extraction based on file names
- Error handling for failed processing

## Responsive Design

### Breakpoints
- **Mobile**: < 768px (stacked layout, hidden columns)
- **Tablet**: 768px - 1024px (hybrid layout)
- **Desktop**: > 1024px (full layout)

### Mobile Optimizations
- Stacked action buttons
- Hidden remarks column
- Truncated text with tooltips
- Touch-friendly interface
- Optimized table scrolling

## Integration Points

### Context Integration
- **AuthContext**: User authentication and role management
- **ExpenseContext**: Expense data management and CRUD operations
- **Toast Notifications**: User feedback and error handling

### Backend Integration
- RESTful API endpoints for expense management
- File upload endpoints for receipt processing
- Real-time status updates
- Currency conversion services

## Customization

### Styling
- Tailwind CSS classes for easy customization
- CSS custom properties for theme colors
- Responsive utility classes
- Component-specific styling overrides

### Data Sources
- Configurable employee data
- Customizable expense categories
- Flexible status workflows
- Pluggable OCR services

## Dependencies

### Core Dependencies
- React 18+
- TypeScript 4.9+
- Tailwind CSS 3.0+
- Radix UI components
- Lucide React icons

### Additional Packages
- date-fns (date formatting)
- class-variance-authority (styling variants)
- @radix-ui/react-* (UI primitives)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Lazy loading for large datasets
- Virtual scrolling for extensive tables
- Optimized re-renders with React.memo
- Efficient state management
- Minimal bundle size impact

## Accessibility

- ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus management

## Future Enhancements

- Real OCR API integration
- Advanced filtering and sorting
- Export functionality (PDF, Excel)
- Bulk operations
- Advanced analytics
- Real-time collaboration
- Mobile app integration

## Demo

Visit `/expense-demo` to see the full expense dashboard in action with sample data and interactive features.

Demo credentials for the frontend (useful for local dev/testing):

- Username: Spencer
- Password: mysql

The frontend reads `VITE_API_BASE_URL`, `VITE_DEMO_USERNAME`, and `VITE_DEMO_PASSWORD` from the `.env` file in the project root when running with Vite.
