
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FileText, Loader2 } from 'lucide-react';

interface ProcessButtonProps {
  onClick: () => void;
  isProcessing: boolean;
  disabled: boolean;
}

export const ProcessButton = ({ onClick, isProcessing, disabled }: ProcessButtonProps) => {
  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <Button
            onClick={onClick}
            disabled={disabled || isProcessing}
            size="lg"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing & Translating...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-5 w-5" />
                Extract & Translate Text
              </>
            )}
          </Button>
          
          {isProcessing && (
            <div className="space-y-2">
              <Progress value={45} className="w-full" />
              <p className="text-sm text-gray-600">
                Extracting text and translating to selected language...
              </p>
            </div>
          )}
          
          {disabled && !isProcessing && (
            <p className="text-sm text-gray-500">
              Please upload a document to continue
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
