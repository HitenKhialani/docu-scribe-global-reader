import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, X, FileText, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  uploadedFile: File | null;
  onRemoveFile?: () => void;
}

export const FileUpload = ({ onFileUpload, uploadedFile, onRemoveFile }: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp',
      'application/pdf',
      'text/plain', // .txt
      'text/csv'    // .csv
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image (JPEG, PNG, GIF, BMP, WebP), PDF, TXT, or CSV file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    onFileUpload(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (typeof onRemoveFile === 'function') {
      onRemoveFile();
    }
    toast({
      title: "File removed",
      description: "Upload a new file to continue",
    });
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload Document
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Support for images (JPEG, PNG, GIF, BMP, WebP), PDF, TXT, and CSV files up to 10MB
            </p>
          </div>

          {!uploadedFile ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                isDragOver
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleButtonClick}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                {isDragOver ? 'Drop your file here' : 'Drop your file here or click to browse'}
              </p>
              <p className="text-sm text-gray-500">
                Images: JPEG, PNG, GIF, BMP, WebP | Documents: PDF, TXT, CSV
              </p>
              
              <Button 
                className="mt-4"
                onClick={(e) => {
                  e.stopPropagation();
                  handleButtonClick();
                }}
              >
                <Upload className="mr-2 h-4 w-4" />
                Choose File
              </Button>
            </div>
          ) : (
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {uploadedFile.type.startsWith('image/') ? (
                    <Image className="h-8 w-8 text-green-600" />
                  ) : uploadedFile.type === 'application/pdf' ? (
                    <FileText className="h-8 w-8 text-red-600" />
                  ) : uploadedFile.type === 'text/plain' ? (
                    <FileText className="h-8 w-8 text-blue-600" />
                  ) : uploadedFile.type === 'text/csv' ? (
                    <FileText className="h-8 w-8 text-yellow-600" />
                  ) : (
                    <FileText className="h-8 w-8 text-gray-400" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900 truncate max-w-xs">
                      {uploadedFile.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={
                    uploadedFile.type.startsWith('image/') ? "default" :
                    uploadedFile.type === 'application/pdf' ? "secondary" :
                    uploadedFile.type === 'text/plain' ? "outline" :
                    uploadedFile.type === 'text/csv' ? "outline" :
                    "secondary"
                  }>
                    {uploadedFile.type.startsWith('image/') ? 'Image' :
                      uploadedFile.type === 'application/pdf' ? 'PDF' :
                      uploadedFile.type === 'text/plain' ? 'Text' :
                      uploadedFile.type === 'text/csv' ? 'CSV' :
                      'File'}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/bmp,image/webp,application/pdf,text/plain,text/csv"
            onChange={handleFileInputChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};
