import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Image } from 'lucide-react';
import React from 'react';

interface DocumentPreviewProps {
  file: File | null;
  previewUrl: string | null;
}

export const DocumentPreview = ({ file, previewUrl }: DocumentPreviewProps) => {
  if (!file) {
    return (
      <Card className="transition-all duration-200 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-gray-400" />
            <span>Document Preview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-2" />
              <p className="text-sm">No file selected</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  const isImage = file.type.startsWith('image/');
  const isPDF = file.type === 'application/pdf';
  const isText = file.type === 'text/plain' || file.name.endsWith('.txt');
  const isCSV = file.type === 'text/csv' || file.name.endsWith('.csv');

  const [textContent, setTextContent] = React.useState<string | null>(null);
  React.useEffect(() => {
    if ((isText || isCSV) && file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTextContent(e.target?.result as string);
      };
      reader.readAsText(file);
    } else {
      setTextContent(null);
    }
  }, [file]);

  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isImage ? (
              <Image className="h-5 w-5 text-green-600" />
            ) : (
              <FileText className="h-5 w-5 text-red-600" />
            )}
            <span>Document Preview</span>
          </div>
          <Badge variant={isImage ? "default" : "secondary"}>
            {isImage ? "Image" : "PDF"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* File Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Filename:</span>
              <p className="text-gray-600 truncate">{file.name}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Size:</span>
              <p className="text-gray-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          
          {/* Preview */}
          <div className="border rounded-lg overflow-hidden bg-gray-50">
            {previewUrl && isImage ? (
              <img
                src={previewUrl}
                alt="Document preview"
                className="w-full h-48 object-contain"
              />
            ) : isText || isCSV ? (
              textContent && textContent.length < 50000 ? (
                <pre className="w-full h-48 max-h-64 overflow-auto p-2 text-xs text-left bg-white text-gray-800 whitespace-pre-wrap">{textContent}</pre>
              ) : textContent && textContent.length >= 50000 ? (
                <div className="h-48 flex items-center justify-center text-gray-500 text-sm">File too large to preview</div>
              ) : (
                <div className="h-48 flex items-center justify-center text-gray-400 text-sm">Loading preview...</div>
              )
            ) : (
              <div className="h-48 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm">
                    {isPDF ? 'PDF Preview Not Available' : 'Preview Not Available'}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="text-xs text-gray-500 text-center">
            Ready for text extraction
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
