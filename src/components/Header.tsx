
import { Languages, FileText } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                DocuScan AI
              </h1>
              <p className="text-sm text-gray-600">
                Multilingual Document Scanner
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Languages className="h-4 w-4" />
            <span>Support for 50+ languages</span>
          </div>
        </div>
      </div>
    </header>
  );
};
