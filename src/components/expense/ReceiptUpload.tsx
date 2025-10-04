import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Camera, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { OCRData, ExpenseFormData, ExpenseCategory } from '@/types/expense';

interface ReceiptUploadProps {
  onOCRComplete: (data: ExpenseFormData) => void;
  onClose: () => void;
  isOpen: boolean;
}

const ReceiptUpload: React.FC<ReceiptUploadProps> = ({ onOCRComplete, onClose, isOpen }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [ocrData, setOcrData] = useState<OCRData | null>(null);
  const [formData, setFormData] = useState<ExpenseFormData>({
    description: '',
    amount: 0,
    currency: 'rs',
    category: 'other',
    date: new Date().toISOString().split('T')[0],
    paidBy: '',
    remarks: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Mock OCR processing function
  const processOCR = async (file: File): Promise<OCRData> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock OCR data based on file name or content
    const mockData: OCRData = {
      amount: Math.floor(Math.random() * 10000) + 1000,
      date: new Date().toISOString().split('T')[0],
      merchant: file.name.includes('restaurant') ? 'Restaurant ABC' : 
                file.name.includes('hotel') ? 'Hotel XYZ' : 
                file.name.includes('taxi') ? 'Taxi Service' : 'Merchant Name',
      category: file.name.includes('restaurant') ? 'food' : 
                file.name.includes('hotel') ? 'accommodation' : 
                file.name.includes('taxi') ? 'travel' : 'other',
      lineItems: ['Item 1', 'Item 2', 'Item 3'],
      confidence: 0.85 + Math.random() * 0.15,
    };
    
    return mockData;
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    
    setUploadedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setIsProcessing(true);
    setErrors({});
    
    try {
      const ocrResult = await processOCR(file);
      setOcrData(ocrResult);
      
      // Auto-populate form with OCR data
      setFormData({
        description: ocrResult.merchant,
        amount: ocrResult.amount,
        currency: 'rs',
        category: ocrResult.category,
        date: ocrResult.date,
        paidBy: '',
        remarks: '',
        receiptFile: file,
      });
    } catch (error) {
      setErrors({ ocr: 'Failed to process receipt. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleInputChange = (field: keyof ExpenseFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.amount <= 0) newErrors.amount = 'Amount must be greater than 0';
    if (!formData.paidBy.trim()) newErrors.paidBy = 'Paid by is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onOCRComplete(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setUploadedFile(null);
    setPreviewUrl(null);
    setOcrData(null);
    setFormData({
      description: '',
      amount: 0,
      currency: 'rs',
      category: 'other',
      date: new Date().toISOString().split('T')[0],
      paidBy: '',
      remarks: '',
    });
    setErrors({});
    onClose();
  };

  const categories: { value: ExpenseCategory; label: string }[] = [
    { value: 'food', label: 'Food' },
    { value: 'travel', label: 'Travel' },
    { value: 'office', label: 'Office' },
    { value: 'accommodation', label: 'Accommodation' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Upload Receipt</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Upload Section */}
          {!uploadedFile ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
                  <CardContent className="p-6 text-center">
                    <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Upload File</h3>
                    <p className="text-sm text-gray-600 mb-4">Upload a receipt image or PDF</p>
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="w-full"
                    >
                      Choose File
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
                  <CardContent className="p-6 text-center">
                    <Camera className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Take Photo</h3>
                    <p className="text-sm text-gray-600 mb-4">Capture receipt with camera</p>
                    <Button 
                      onClick={() => cameraInputRef.current?.click()}
                      variant="outline"
                      className="w-full"
                    >
                      Open Camera
                    </Button>
                    <input
                      ref={cameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleCameraCapture}
                      className="hidden"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Processing Status */}
              {isProcessing && (
                <div className="flex items-center justify-center p-8 bg-blue-50 rounded-lg">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-2" />
                    <p className="text-blue-600 font-medium">Processing receipt...</p>
                    <p className="text-sm text-blue-500">Extracting data with OCR</p>
                  </div>
                </div>
              )}

              {/* OCR Results */}
              {ocrData && !isProcessing && (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-green-800 mb-2">OCR Data Extracted</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Amount:</span> {ocrData.amount} rs
                          </div>
                          <div>
                            <span className="font-medium">Date:</span> {ocrData.date}
                          </div>
                          <div>
                            <span className="font-medium">Merchant:</span> {ocrData.merchant}
                          </div>
                          <div>
                            <span className="font-medium">Category:</span> {ocrData.category}
                          </div>
                          <div>
                            <span className="font-medium">Confidence:</span> {Math.round(ocrData.confidence * 100)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Error Display */}
              {errors.ocr && (
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-800">OCR Processing Failed</h4>
                        <p className="text-sm text-red-600">{errors.ocr}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Preview */}
              {previewUrl && (
                <div className="space-y-2">
                  <Label>Receipt Preview</Label>
                  <div className="relative">
                    <img 
                      src={previewUrl} 
                      alt="Receipt preview" 
                      className="max-h-64 w-full object-contain border rounded-lg"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setUploadedFile(null);
                        setPreviewUrl(null);
                        setOcrData(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter expense description"
                    className={errors.description ? 'border-red-500' : ''}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">{errors.description}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                    placeholder="Enter amount"
                    className={errors.amount ? 'border-red-500' : ''}
                  />
                  {errors.amount && (
                    <p className="text-sm text-red-500">{errors.amount}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange('category', value as ExpenseCategory)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paidBy">Paid By *</Label>
                  <Input
                    id="paidBy"
                    value={formData.paidBy}
                    onChange={(e) => handleInputChange('paidBy', e.target.value)}
                    placeholder="Who paid for this expense"
                    className={errors.paidBy ? 'border-red-500' : ''}
                  />
                  {errors.paidBy && (
                    <p className="text-sm text-red-500">{errors.paidBy}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => handleInputChange('currency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rs">INR (₹)</SelectItem>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  value={formData.remarks}
                  onChange={(e) => handleInputChange('remarks', e.target.value)}
                  placeholder="Additional notes or remarks"
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            {uploadedFile && (
              <Button onClick={handleSubmit} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  'Create Expense'
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptUpload;
