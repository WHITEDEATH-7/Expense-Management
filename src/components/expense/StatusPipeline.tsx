import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { StatusPipeline as StatusPipelineType } from '@/types/expense';
import { ArrowRight, Clock, CheckCircle, FileText } from 'lucide-react';

interface StatusPipelineProps {
  totals: StatusPipelineType;
  className?: string;
}

const StatusPipeline: React.FC<StatusPipelineProps> = ({ totals, className = '' }) => {
  const statusItems = [
    {
      label: 'To submit',
      amount: totals.toSubmit,
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
    {
      label: 'Waiting approval',
      amount: totals.waiting,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      label: 'Approved',
      amount: totals.approved,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
  ];

  return (
    <Card className={`${className}`}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {statusItems.map((item, index) => (
            <React.Fragment key={item.label}>
              <div className={`flex items-center space-x-3 p-4 rounded-lg border-2 ${item.bgColor} ${item.borderColor} flex-1 w-full md:w-auto`}>
                <div className={`p-2 rounded-full ${item.bgColor}`}>
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{item.label}</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900">
                    {item.amount.toLocaleString()} rs
                  </p>
                </div>
              </div>
              {index < statusItems.length - 1 && (
                <div className="flex items-center justify-center px-2 hidden md:flex">
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusPipeline;
