import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Plus } from 'lucide-react';

interface ActionButtonsProps {
  onUpload: () => void;
  onNew: () => void;
  className?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onUpload, onNew, className = '' }) => {
  return (
    <div className={`flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 ${className}`}>
      <Button
        onClick={onUpload}
        variant="outline"
        className="flex items-center justify-center space-x-2 border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 w-full sm:w-auto"
      >
        <Upload className="h-4 w-4" />
        <span>Upload</span>
      </Button>
      
      <Button
        onClick={onNew}
        className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
      >
        <Plus className="h-4 w-4" />
        <span>New</span>
      </Button>
    </div>
  );
};

export default ActionButtons;
