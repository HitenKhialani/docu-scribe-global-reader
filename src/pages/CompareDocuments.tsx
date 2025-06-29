import { useState, useEffect } from 'react';
import { DocumentCompare } from '@/components/DocumentCompare';
import { Sidebar } from '@/components/Sidebar';

const CompareDocumentsPage = () => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    const handleStorage = () => {
      setDarkMode(localStorage.getItem('theme') === 'dark');
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-[#101F33]' : 'bg-[#FFF8E7]'} transition-colors duration-500`}>
      <Sidebar cardColor={darkMode ? '#23234a' : '#FFE0B2'} />
      <div className="flex-1 flex flex-col items-center justify-center py-12">
        <div className="w-full max-w-2xl mx-auto">
          <div className={`rounded-3xl ${darkMode ? 'bg-[#23234a]' : 'bg-[#FFE0B2]'} shadow-2xl p-8 border border-[#C3B6F7] w-full flex flex-col gap-6 items-center`}>
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-black'} mb-4 text-center`}>Compare Documents</h2>
            <DocumentCompare />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareDocumentsPage; 