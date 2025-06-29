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
import { Sun, Moon } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { Stepper } from '@/components/Stepper';

const steps = [
  'Upload Document',
  'Language Selection',
  'Extract & Translate',
  'Summary',
];

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
  const [currentStep, setCurrentStep] = useState(0);

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
    setCurrentStep(1);
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
      setCurrentStep(3);
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

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };
  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };
  const handleStartOver = () => {
    setUploadedFile(null);
    setPreviewUrl(null);
    setExtractedText('');
    setOcrResult(null);
    setCorrectedText('');
    setCorrectedSummary('');
    setCurrentStep(0);
  };

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-[#101F33]' : 'bg-[#FFF8E7]'} transition-colors duration-500`}>
      <Sidebar cardColor={darkMode ? '#23234a' : '#FFE0B2'} />
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar with stepper and theme toggle */}
        <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-12 pt-4 md:pt-8 gap-4 md:gap-0">
          <Stepper currentStep={currentStep} />
          <div className="flex items-center gap-2 ml-0 md:ml-8">
            <span className="uppercase text-xs font-bold tracking-widest text-[#6C4EE6] dark:text-[#C3B6F7]">DARK MODE</span>
            <button
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
              onClick={() => setDarkMode((d) => !d)}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-[#6C4EE6]" />}
            </button>
          </div>
        </div>
        {/* Step content */}
        <main className="flex-1 flex flex-col items-center justify-center w-full px-2 py-4 md:py-8">
          <div className="w-full max-w-6xl mx-auto">
            {/* Step 1 & 2: Responsive layout */}
            {(currentStep === 0 || currentStep === 1) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Upload Document Card */}
                <div className={`rounded-3xl ${darkMode ? 'bg-[#23234a]' : 'bg-[#FFE0B2]'} shadow-2xl p-4 md:p-8 flex flex-col items-center border-2 border-dashed border-[#C3B6F7] min-h-[340px] w-full`}> 
                  <h2 className="text-2xl font-bold text-[#4B2996] dark:text-[#C3B6F7] mb-4">Upload Document</h2>
                  <FileUpload 
                    onFileUpload={handleFileUpload}
                    uploadedFile={uploadedFile}
                    onRemoveFile={handleStartOver}
                  />
                  {currentStep === 0 && (
                    <button className="mt-8 w-full md:w-auto px-8 py-2 rounded-xl bg-[#6C4EE6] text-white font-bold text-lg shadow hover:bg-[#4B2996] transition" onClick={handleNext} disabled={!uploadedFile}>Next</button>
                  )}
                </div>
                {/* Language Selection Card */}
                <div className={`rounded-3xl ${darkMode ? 'bg-[#23234a]' : 'bg-[#FFE0B2]'} shadow-2xl p-4 md:p-8 flex flex-col items-center min-h-[340px] w-full`}>
                  <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Language Selection</h2>
                  <LanguageSelector 
                    selectedLanguage={selectedLanguage}
                    onLanguageChange={setSelectedLanguage}
                  />
                  {currentStep === 1 && (
                    <div className="flex justify-end w-full mt-8">
                      <button className="w-full md:w-auto px-8 py-2 rounded-xl bg-[#6C4EE6] text-white font-bold text-lg shadow hover:bg-[#3a1d6e] transition" onClick={handleNext} disabled={!selectedLanguage}>Next</button>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* Step 3: Extract & Translate */}
            {currentStep === 2 && (
              <div className={`rounded-3xl ${darkMode ? 'bg-[#23234a]' : 'bg-[#FFE0B2]'} shadow-2xl p-4 md:p-8 border border-[#C3B6F7] w-full flex flex-col gap-6 items-center`}>
                <h2 className="text-2xl font-bold text-[#4B2996] dark:text-[#C3B6F7] mb-4">Extract & Translate</h2>
                <ProcessButton
                  onClick={handleProcessDocument}
                  isProcessing={isProcessing}
                  disabled={!uploadedFile}
                />
                <DocumentPreview file={uploadedFile} previewUrl={previewUrl} />
                <div className="flex flex-col md:flex-row justify-between w-full mt-8 gap-4 md:gap-0">
                  <button className="w-full md:w-auto px-8 py-2 rounded-xl bg-[#C3B6F7] text-[#4B2996] font-bold text-lg shadow hover:bg-[#6C4EE6] hover:text-white transition" onClick={handlePrev}>Previous</button>
                  <button className="w-full md:w-auto px-8 py-2 rounded-xl bg-[#6C4EE6] text-white font-bold text-lg shadow hover:bg-[#3a1d6e] transition" onClick={handleNext} disabled={isProcessing || !ocrResult}>Next</button>
                </div>
              </div>
            )}
            {/* Step 4: Summary */}
            {currentStep === 3 && (
              <div className={`rounded-3xl ${darkMode ? 'bg-[#23234a]' : 'bg-[#FFE0B2]'} shadow-2xl p-4 md:p-8 border border-[#C3B6F7] w-full flex flex-col gap-6 items-center`}>
                <h2 className="text-2xl font-bold text-[#4B2996] dark:text-[#C3B6F7] mb-4">Summary</h2>
                <TextOutput 
                  extractedText={ocrResult?.text || ''}
                  summary={correctedSummary}
                  isProcessing={isProcessing}
                  words={ocrResult?.words}
                  onTextChange={setCorrectedText}
                  selectedLanguage={selectedLanguage}
                />
                {correctedText && (
                  <ExportOptions 
                    extractedText={correctedText}
                    fileName={uploadedFile?.name || 'document'}
                  />
                )}
                <div className="flex flex-col md:flex-row justify-between w-full mt-8 gap-4 md:gap-0">
                  <button className="w-full md:w-auto px-8 py-2 rounded-xl bg-[#C3B6F7] text-[#4B2996] font-bold text-lg shadow hover:bg-[#6C4EE6] hover:text-white transition" onClick={handlePrev}>Previous</button>
                  <button className="w-full md:w-auto px-8 py-2 rounded-xl bg-[#6C4EE6] text-white font-bold text-lg shadow hover:bg-[#3a1d6e] transition" onClick={handleStartOver}>Start Over</button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
