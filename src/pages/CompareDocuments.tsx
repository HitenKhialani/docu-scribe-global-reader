import { DocumentCompare } from '@/components/DocumentCompare';
import { Sidebar } from '@/components/Sidebar';

const CompareDocumentsPage = () => {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#6C4EE6] to-[#4B2996]">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center justify-center py-12">
        <div className="w-full max-w-2xl mx-auto">
          <div className="rounded-3xl bg-[#101F33] shadow-2xl p-8 border border-[#C3B6F7] w-full flex flex-col gap-6 items-center">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Compare Documents</h2>
            <DocumentCompare />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareDocumentsPage; 