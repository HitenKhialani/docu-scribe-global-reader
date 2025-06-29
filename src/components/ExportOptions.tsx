
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportOptionsProps {
  extractedText: string;
  fileName: string;
}

export const ExportOptions = ({ extractedText, fileName }: ExportOptionsProps) => {
  const { toast } = useToast();

  const downloadAsText = () => {
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName.replace(/\.[^/.]+$/, '')}_extracted.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Text file is being downloaded",
    });
  };

  const downloadAsPDF = () => {
    // Simple PDF generation using browser print functionality
    // In a real implementation, you might use libraries like jsPDF
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Extracted Text - ${fileName}</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
              h1 { color: #333; border-bottom: 2px solid #4F46E5; padding-bottom: 10px; }
              .content { white-space: pre-wrap; font-size: 14px; }
            </style>
          </head>
          <body>
            <h1>Extracted Text from ${fileName}</h1>
            <div class="content">${extractedText}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
    
    toast({
      title: "PDF export initiated",
      description: "Print dialog opened for PDF export",
    });
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileDown className="h-5 w-5 text-green-600" />
          <span>Export Options</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Button
            onClick={downloadAsText}
            variant="outline"
            className="w-full justify-start"
          >
            <FileText className="mr-2 h-4 w-4" />
            Download as TXT
          </Button>
          
          <Button
            onClick={downloadAsPDF}
            variant="outline"
            className="w-full justify-start"
          >
            <FileDown className="mr-2 h-4 w-4" />
            Export as PDF
          </Button>
          
          <div className="text-xs text-gray-500 mt-3 p-2 bg-gray-50 rounded">
            <strong>Note:</strong> TXT export preserves the raw text. PDF export opens a print dialog for better formatting control.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
