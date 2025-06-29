import { useState, useEffect } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { LanguageSelector } from '@/components/LanguageSelector';
import { DocumentPreview } from '@/components/DocumentPreview';
import { TextOutput } from '@/components/TextOutput';
import { ExportOptions } from '@/components/ExportOptions';
import { ProcessButton } from '@/components/ProcessButton';
import { DocumentCompare } from '@/components/DocumentCompare';
import { useToast } from '@/hooks/use-toast';
import { extractTextFromDocument, OCRResult } from '@/utils/ocrService';
import { generateSummary } from '@/utils/summaryService';
import { Sun, Moon, Loader2 } from 'lucide-react';

const Index = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [extractedText, setExtractedText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [correctedText, setCorrectedText] = useState<string>('');
  const [correctedSummary, setCorrectedSummary] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const doSummary = async () => {
      if (correctedText && selectedLanguage) {
        const summary = await generateSummary(correctedText, selectedLanguage);
        setCorrectedSummary(summary);
      } else {
        setCorrectedSummary('');
      }
    };
    doSummary();
  }, [correctedText, selectedLanguage]);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
    setExtractedText('');
    setOcrResult(null);
    toast({
      title: 'File uploaded successfully',
      description: `${file.name} is ready for processing`,
    });
  };

  const handleProcessDocument = async () => {
    if (!uploadedFile) {
      toast({
        title: 'No file selected',
        description: 'Please upload a document first',
        variant: 'destructive',
      });
      return;
    }
    setIsProcessing(true);
    try {
      const result = await extractTextFromDocument(uploadedFile, [selectedLanguage]);
      setExtractedText(result.text);
      setOcrResult(result);
      const translationInfo = result.translatedTo.length > 0 
        ? ` and translated to ${result.translatedTo.join(', ')}`
        : '';
      toast({
        title: 'Text extraction completed',
        description: `Extracted ${result.text.length} characters with ${(result.confidence * 100).toFixed(1)}% confidence${translationInfo}`,
      });
    } catch (error) {
      toast({
        title: 'Processing failed',
        description: error instanceof Error ? error.message : 'There was an error processing your document',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2e2257] via-[#4b2996] to-[#6d28d9] flex flex-col">
      {/* Header */}
      <header className="w-full py-4 px-6 flex items-center justify-between bg-black/40 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-indigo-200 tracking-tight">DocuScan AI</span>
          <span className="text-xs text-indigo-100/80 ml-2">Multilingual Document Scanner</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-indigo-100/80 hidden sm:inline">🌐 Support for 50+ languages</span>
          <button
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            onClick={() => setDarkMode((d) => !d)}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-indigo-400" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start w-full px-2 py-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-indigo-100 mb-2 tracking-tight">Multilingual OCR</h1>
        <h2 className="text-xl md:text-2xl font-semibold text-center text-indigo-200 mb-6">Made Simple</h2>
        <p className="text-center text-indigo-100/80 max-w-2xl mb-8">Extract text from documents in multiple languages simultaneously. Get instant translations with perfect layout preservation.</p>

        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Left Column */}
          <div className="flex flex-col gap-8 items-stretch">
            {/* Upload Card */}
            <div className="rounded-2xl bg-black/80 shadow-xl p-4 md:p-8 flex flex-col items-center border border-white/10 w-full h-full">
              <FileUpload 
                onFileUpload={handleFileUpload}
                uploadedFile={uploadedFile}
                onRemoveFile={() => {
                  setUploadedFile(null);
                  setPreviewUrl(null);
                  setExtractedText('');
                  setOcrResult(null);
                }}
              />
            </div>
            {/* Language Selection Card */}
            <div className="rounded-2xl bg-black/80 shadow-xl p-4 md:p-8 border border-white/10 w-full h-full">
              <LanguageSelector 
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
              />
            </div>
            {/* Process Button */}
            <div className="flex justify-center">
              <ProcessButton
                onClick={handleProcessDocument}
                isProcessing={isProcessing}
                disabled={!uploadedFile}
              />
            </div>
            {/* File Preview Card */}
            <div className="rounded-2xl bg-black/80 shadow-xl p-4 md:p-8 flex flex-col items-center border border-white/10 w-full h-full">
              <DocumentPreview file={uploadedFile} previewUrl={previewUrl} />
            </div>
          </div>
          {/* Right Column */}
          <div className="flex flex-col gap-8 items-stretch">
            {/* Extracted Text Card */}
            <div className="rounded-2xl bg-black/80 shadow-xl p-4 md:p-8 border border-white/10 w-full h-full">
              <TextOutput 
                extractedText={ocrResult?.text || ''}
                summary={correctedSummary}
                isProcessing={isProcessing}
                words={ocrResult?.words}
                onTextChange={setCorrectedText}
                selectedLanguage={selectedLanguage}
              />
            </div>
            {/* Export Options Card */}
            {correctedText && (
              <div className="rounded-2xl bg-black/80 shadow-xl p-4 md:p-8 border border-white/10 w-full h-full">
                <ExportOptions 
                  extractedText={correctedText}
                  fileName={uploadedFile?.name || 'document'}
                />
              </div>
            )}
          </div>
        </div>

        {/* Compare Documents Card */}
        <div className="rounded-2xl bg-black/80 shadow-xl p-6 md:p-12 my-8 border border-white/10 w-full max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-indigo-100 mb-4 text-center">Compare Documents</h3>
          <DocumentCompare />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-black/60 text-indigo-100/80 py-8 px-4 mt-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <div className="font-bold text-indigo-200 text-lg mb-1">DocuScan AI</div>
            <div className="text-xs">Professional multilingual document scanning powered by AI. Extract and translate text with precision and elegance.</div>
          </div>
          <div className="flex-1 text-center">
            <div className="font-semibold mb-1">Features</div>
            <ul className="text-xs space-y-1">
              <li>Multi-language OCR</li>
              <li>Real-time translation</li>
              <li>Layout preservation</li>
              <li>Multiple export formats</li>
            </ul>
          </div>
          <div className="flex-1 text-center md:text-right">
            <div className="font-semibold mb-1">Connect</div>
            <div className="flex justify-center md:justify-end gap-3">
              <a href="#" className="hover:text-indigo-400 transition">Twitter</a>
              <a href="#" className="hover:text-indigo-400 transition">GitHub</a>
              <a href="#" className="hover:text-indigo-400 transition">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
