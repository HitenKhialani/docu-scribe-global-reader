import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, CheckCircle, FileText, Loader2, BookOpen, Pencil } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { OCRWord } from '@/utils/ocrService';
import { getAISuggestion } from '@/utils/aiSuggestions';
import { isWordCorrect, getSuggestions } from '@/utils/simpleSpellCheck';
import { useNavigate } from 'react-router-dom';

interface TextOutputProps {
  extractedText: string;
  summary?: string;
  isProcessing: boolean;
  words?: OCRWord[];
  onTextChange?: (correctedText: string) => void;
  selectedLanguage: string;
}

export const TextOutput = ({ extractedText, summary, isProcessing, words, onTextChange, selectedLanguage }: TextOutputProps) => {
  const [copied, setCopied] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editedWords, setEditedWords] = useState<string[]>(
    words && Array.isArray(words) && words.length > 0 && words[0]?.text !== undefined
      ? words.map(w => w.text)
      : extractedText.split(/\s+/)
  );
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showSuggestionsIdx, setShowSuggestionsIdx] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFlaggedWordClick = (word: OCRWord, idx: number) => {
    setEditingIdx(idx);
    setAiSuggestion(null);
    if (!isWordCorrect(editedWords[idx])) {
      setShowSuggestionsIdx(idx);
      setSuggestions(getSuggestions(editedWords[idx]));
    } else {
      setShowSuggestionsIdx(null);
      setSuggestions([]);
    }
  };

  const handleWordEditChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const newWords = [...editedWords];
    newWords[idx] = e.target.value;
    setEditedWords(newWords);
  };

  const handleWordEditBlur = () => {
    setEditingIdx(null);
  };

  const handleWordEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setEditingIdx(null);
    }
  };

  const handleSuggestionClick = (suggestion: string, idx: number) => {
    setEditedWords(words => words.map((w, i) => i === idx ? suggestion : w));
    setEditingIdx(null);
    setShowSuggestionsIdx(null);
    setSuggestions([]);
  };

  const handleCopy = async (text: string, isSummary = false) => {
    try {
      await navigator.clipboard.writeText(text);
      if (isSummary) {
        setCopiedSummary(true);
        setTimeout(() => setCopiedSummary(false), 2000);
      } else {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
      
      toast({
        title: `${isSummary ? 'Summary' : 'Text'} copied`,
        description: `${isSummary ? 'Document summary' : 'Extracted text'} has been copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy text to clipboard",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (words && Array.isArray(words) && words.length > 0 && words[0]?.text !== undefined) {
      setEditedWords(words.map(w => w.text));
    } else if (extractedText) {
      setEditedWords(extractedText.split(/\s+/));
    }
  }, [words, extractedText]);

  // Notify parent of corrected text changes
  useEffect(() => {
    if (onTextChange) {
      onTextChange(editedWords.join(' '));
    }
  }, [editedWords, onTextChange]);

  return (
    <div className="space-y-6">
      {/* Extracted Text Card */}
      <Card className="h-full transition-all duration-200 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-indigo-600" />
              <span>Extracted Text</span>
            </div>
            {extractedText && (
              <Button
                onClick={() => handleCopy(extractedText)}
                variant="outline"
                size="sm"
                className="ml-2"
              >
                {copied ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isProcessing ? (
            <div className="flex items-center justify-center h-64 space-y-4">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Extracting text from document...</p>
                <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
              </div>
            </div>
          ) : extractedText ? (
            <div className="space-y-4">
              {Array.isArray(words) ? (
                <div className="min-h-[250px] max-h-[400px] font-mono text-sm bg-white dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 overflow-auto whitespace-pre-wrap" style={{ wordBreak: 'break-word' }}>
                  {words.map((word, idx) => (
                    editingIdx === idx ? (
                      <span key={idx} style={{ display: 'inline-block', position: 'relative' }}>
                        <input
                          type="text"
                          value={editedWords[idx]}
                          spellCheck={true}
                          autoFocus
                          onChange={e => handleWordEditChange(e, idx)}
                          onBlur={handleWordEditBlur}
                          onKeyDown={handleWordEditKeyDown}
                          className="inline-block w-auto px-1 mx-0.5 border-2 border-blue-500 bg-yellow-50 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
                          style={{ minWidth: '2ch' }}
                        />
                        {/* Suggestions dropdown for misspelled words */}
                        {showSuggestionsIdx === idx && suggestions.length > 0 && (
                          <div className="absolute z-10 bg-white border border-gray-300 rounded shadow p-2 mt-1 left-0">
                            <div className="text-xs text-gray-700 mb-1">Suggestions:</div>
                            {suggestions.map((s, i) => (
                              <div
                                key={i}
                                className="cursor-pointer hover:bg-blue-100 px-2 py-1 rounded"
                                onMouseDown={e => { e.preventDefault(); handleSuggestionClick(s, idx); }}
                              >{s}</div>
                            ))}
                          </div>
                        )}
                      </span>
                    ) : (
                      <span
                        key={idx}
                        className={
                          (!isWordCorrect(editedWords[idx]) ? 'underline underline-offset-2 decoration-red-500 ' : '') +
                          'cursor-pointer px-1 rounded transition-colors duration-100 group relative'
                        }
                        title={!isWordCorrect(editedWords[idx]) ? `Misspelled: click to correct` : 'Click to edit'}
                        onClick={() => handleFlaggedWordClick(word, idx)}
                      >
                        {editedWords[idx] + ' '}
                      </span>
                    )
                  ))}
                </div>
              ) : (
                <div className="min-h-[250px] max-h-[400px] font-mono text-sm bg-white dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 overflow-auto whitespace-pre-wrap" style={{ wordBreak: 'break-word' }}>
                  {extractedText}
                </div>
              )}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{extractedText.length} characters</span>
                <span>{extractedText.split(/\s+/).filter(word => word.length > 0).length} words</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No text extracted yet</p>
                <p className="text-sm mt-2">Upload a document and click "Extract Text" to begin</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Card */}
      {summary && (
        <Card className="transition-all duration-200 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-green-600" />
                <span>Document Summary</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => navigate('/mindmap', { state: { summary, selectedLanguage } })}
                  variant="outline"
                  size="sm"
                  className="ml-2"
                >
                  Generate Mindmap
                </Button>
                <Button
                  onClick={() => handleCopy(summary, true)}
                  variant="outline"
                  size="sm"
                  className="ml-2"
                >
                  {copiedSummary ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <ul className="list-disc ml-6 text-gray-800 leading-relaxed">
                  {summary.split(/(?<=[.!?])\s+/).map((point, idx) => (
                    point.trim() && <li key={idx}>{point.trim()}</li>
                  ))}
                </ul>
              </div>
              <div className="text-sm text-gray-500">
                <span>Summary length: {summary.length} characters</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
