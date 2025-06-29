import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { extractTextFromDocument } from '@/utils/ocrService';
// @ts-ignore
import { diffWords } from 'diff';

function isTextOrCsv(file: File) {
  return (
    file.type === 'text/plain' ||
    file.type === 'text/csv' ||
    file.name.endsWith('.txt') ||
    file.name.endsWith('.csv')
  );
}

export const DocumentCompare = () => {
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [diffResult, setDiffResult] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileA = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileA(file);
      if (isTextOrCsv(file)) {
        const reader = new FileReader();
        reader.onload = (ev) => setTextA(ev.target?.result as string);
        reader.readAsText(file);
      } else {
        setTextA('');
      }
    }
  };
  const handleFileB = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileB(file);
      if (isTextOrCsv(file)) {
        const reader = new FileReader();
        reader.onload = (ev) => setTextB(ev.target?.result as string);
        reader.readAsText(file);
      } else {
        setTextB('');
      }
    }
  };

  const handleCompare = async () => {
    if (!fileA || !fileB) return;
    setLoading(true);
    try {
      let contentA = textA;
      let contentB = textB;
      // If not text/csv, extract using OCR
      if (!isTextOrCsv(fileA)) {
        const resultA = await extractTextFromDocument(fileA, ['en']);
        contentA = resultA.text;
      }
      if (!isTextOrCsv(fileB)) {
        const resultB = await extractTextFromDocument(fileB, ['en']);
        contentB = resultB.text;
      }
      setTextA(contentA);
      setTextB(contentB);
      const diff = diffWords(contentA, contentB);
      setDiffResult(diff);
    } catch (err) {
      setDiffResult([{ value: 'Error comparing documents', added: false, removed: false }]);
    }
    setLoading(false);
  };

  // --- Summary logic ---
  const addedWords = diffResult.filter((part) => part.added).map((part) => part.value.trim()).filter(Boolean);
  const removedWords = diffResult.filter((part) => part.removed).map((part) => part.value.trim()).filter(Boolean);

  return (
    <Card className="transition-all duration-200 hover:shadow-lg mt-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Compare Documents</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="block mb-2 font-medium">Document A</label>
            <input type="file" onChange={handleFileA} className="block w-full" />
            {fileA && <div className="text-xs text-gray-500 mt-1">{fileA.name}</div>}
          </div>
          <div className="flex-1">
            <label className="block mb-2 font-medium">Document B</label>
            <input type="file" onChange={handleFileB} className="block w-full" />
            {fileB && <div className="text-xs text-gray-500 mt-1">{fileB.name}</div>}
          </div>
        </div>
        <Button onClick={handleCompare} disabled={!fileA || !fileB || loading} className="mb-4">
          {loading ? 'Comparing...' : 'Compare'}
        </Button>
        {/* --- Summary Section --- */}
        {diffResult.length > 0 && (
          <div className="mb-4">
            <div className="mb-2 font-semibold">Summary of Differences:</div>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="text-green-700 font-medium">Added in B:</div>
                {addedWords.length > 0 ? (
                  <ul className="list-disc ml-5 text-green-700">
                    {addedWords.map((word, idx) => (
                      <li key={idx}>{word}</li>
                    ))}
                  </ul>
                ) : <div className="text-gray-400">No additions</div>}
              </div>
              <div className="flex-1">
                <div className="text-red-700 font-medium">Removed from A:</div>
                {removedWords.length > 0 ? (
                  <ul className="list-disc ml-5 text-red-700">
                    {removedWords.map((word, idx) => (
                      <li key={idx}>{word}</li>
                    ))}
                  </ul>
                ) : <div className="text-gray-400">No removals</div>}
              </div>
            </div>
          </div>
        )}
        {/* --- Diff Section --- */}
        <div className="mt-4 p-4 bg-gray-50 rounded border min-h-[80px] font-mono text-sm whitespace-pre-wrap">
          {diffResult.length > 0 ? diffResult.map((part, idx) => (
            <span
              key={idx}
              style={{
                backgroundColor: part.added || part.removed ? '#fef9c3' : '#f3f4f6',
                color: part.added ? '#065f46' : part.removed ? '#991b1b' : '#111827',
                textDecoration: part.removed ? 'line-through' : 'none',
                marginRight: '2px',
                borderRadius: '2px',
                padding: '1px 2px',
                display: 'inline-block',
              }}
            >
              {part.value}
            </span>
          )) : <span className="text-gray-400">No comparison yet.</span>}
        </div>
      </CardContent>
    </Card>
  );
}; 