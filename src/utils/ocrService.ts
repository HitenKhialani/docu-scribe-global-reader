import { extractTextFromPDF } from './pdfExtractor';
import { translateText, getTranslationLanguageCode } from './translationService';
import { generateSummary } from './summaryService';
import { franc } from 'franc-min';

export interface OCRWord {
  text: string;
  confidence: number;
  bbox?: any;
  index: number;
}

export interface OCRResult {
  text: string;
  words: OCRWord[];
  originalText: string;
  summary: string;
  confidence: number;
  detectedLanguages: string[];
  translatedTo: string[];
}

// Language mapping for better text processing
const LANGUAGE_CONFIGS = {
  'en': { name: 'English', rtl: false },
  'hi': { name: 'Hindi', rtl: false },
  'fr': { name: 'French', rtl: false },
  'es': { name: 'Spanish', rtl: false },
  'de': { name: 'German', rtl: false },
  'zh': { name: 'Chinese', rtl: false },
  'ja': { name: 'Japanese', rtl: false },
  'ar': { name: 'Arabic', rtl: true }
};

// Simple text processing for different languages
const processTextForLanguage = (text: string, languages: string[]): string => {
  let processedText = text;
  
  // Basic text cleaning
  processedText = processedText.replace(/\s+/g, ' ').trim();
  
  // Handle RTL languages
  const hasRTLLanguage = languages.some(lang => 
    LANGUAGE_CONFIGS[lang as keyof typeof LANGUAGE_CONFIGS]?.rtl
  );
  
  if (hasRTLLanguage) {
    // Add RTL processing if needed
    processedText = processedText;
  }
  
  return processedText;
};

// Map franc language codes to your supported language codes
function mapFrancToSupportedLang(francCode: string): string {
  switch (francCode) {
    case 'eng': return 'en';
    case 'hin': return 'hi';
    case 'fra': return 'fr';
    case 'spa': return 'es';
    case 'deu': return 'de';
    case 'cmn': return 'zh';
    case 'jpn': return 'ja';
    case 'ara': return 'ar';
    default: return 'en'; // fallback
  }
}

export const extractTextFromDocument = async (
  file: File, 
  selectedLanguages: string[]
): Promise<OCRResult> => {
  try {
    let extractedText = '';
    let words: OCRWord[] = [];
    
    console.log('Extracting text from document...');
    
    if (file.type === 'application/pdf') {
      // Extract text from PDF
      extractedText = await extractTextFromPDF(file);
      // Split into words for UI, assign full confidence
      words = extractedText.split(/\s+/).map((w, idx) => ({ text: w, confidence: 100, index: idx }));
    } else if (file.type.startsWith('image/')) {
      // For images, use Tesseract.js
      const { createWorker } = await import('tesseract.js');
      const worker = await createWorker();
      const langString = 'eng';
      await worker.loadLanguage(langString);
      await worker.initialize(langString);
      const { data } = await worker.recognize(file);
      extractedText = data.text;
      // Per-word confidence
      words = data.words.map((w: any, idx: number) => ({
        text: w.text,
        confidence: w.confidence,
        bbox: w.bbox,
        index: idx,
      }));
      await worker.terminate();
    } else if (file.type === 'text/plain') {
      extractedText = await file.text();
      words = extractedText.split(/\s+/).map((w, idx) => ({ text: w, confidence: 100, index: idx }));
    } else if (file.type === 'text/csv') {
      const csvText = await file.text();
      const rows = csvText.split(/\r?\n/);
      extractedText = rows.map(row => row.split(',').join('\t')).join('\n');
      words = extractedText.split(/\s+/).map((w, idx) => ({ text: w, confidence: 100, index: idx }));
    }
    
    if (!extractedText.trim()) {
      throw new Error('No text could be extracted from the document');
    }

    console.log('Original extracted text:', extractedText);
    
    // Store original text
    const originalText = extractedText;
    
    // Process text based on selected languages
    let processedText = processTextForLanguage(extractedText, selectedLanguages);
    
    // Detect language of the processed text
    const primaryLanguage = selectedLanguages[0]; // Use first selected language as primary
    let translatedWords = words;
    const francCode = franc(processedText);
    const detectedLang = mapFrancToSupportedLang(francCode);
    // Always translate if detectedLang is 'und' (undefined) or different from primaryLanguage
    if (detectedLang === 'und' || primaryLanguage !== detectedLang) {
      console.log(`Detected language: ${detectedLang}. Translating to ${primaryLanguage}...`);
      const translationCode = getTranslationLanguageCode(primaryLanguage);
      const sourceCode = detectedLang === 'und' ? 'en' : getTranslationLanguageCode(detectedLang);
      processedText = await translateText(processedText, translationCode, sourceCode);
      console.log('Translated text:', processedText);
      // Always create words array for translated text
      translatedWords = processedText.split(/\s+/).map((w, idx) => ({ text: w, confidence: 100, index: idx }));
    }
    // Ensure words array is always non-empty and matches processedText
    if (!translatedWords || translatedWords.length === 0) {
      translatedWords = processedText.split(/\s+/).map((w, idx) => ({ text: w, confidence: 100, index: idx }));
    }
    
    // Generate summary in the target language
    console.log('Generating summary...');
    const summary = await generateSummary(processedText, primaryLanguage);
    console.log('Generated summary:', summary);
    
    return {
      text: processedText,
      words: translatedWords,
      originalText: originalText,
      summary: summary,
      confidence: 0.85, // Mock confidence for now
      detectedLanguages: ['en'], // Detected as English initially
      translatedTo: primaryLanguage !== 'en' ? [primaryLanguage] : []
    };
    
  } catch (error) {
    console.error('OCR processing error:', error);
    throw error;
  }
};
