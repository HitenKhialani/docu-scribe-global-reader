
import { translateText, getTranslationLanguageCode } from './translationService';

export const generateSummary = async (text: string, targetLanguage: string): Promise<string> => {
  try {
    // Simple extractive summarization - take key sentences
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    
    if (sentences.length === 0) {
      return targetLanguage !== 'en' 
        ? await translateText('No content available for summarization.', getTranslationLanguageCode(targetLanguage))
        : 'No content available for summarization.';
    }
    
    // Take first few sentences and some middle content for basic summary
    let summary = '';
    const maxSentences = Math.min(5, Math.ceil(sentences.length / 3));
    
    // Get key sentences (first, middle, and important ones)
    const keySentences = [];
    keySentences.push(sentences[0]); // First sentence
    
    if (sentences.length > 2) {
      const middleIndex = Math.floor(sentences.length / 2);
      keySentences.push(sentences[middleIndex]); // Middle sentence
    }
    
    if (sentences.length > 4) {
      keySentences.push(sentences[sentences.length - 1]); // Last sentence
    }
    
    // Add additional sentences if needed
    const remainingSlots = maxSentences - keySentences.length;
    for (let i = 1; i < sentences.length - 1 && keySentences.length < maxSentences; i++) {
      if (!keySentences.includes(sentences[i]) && sentences[i].length > 50) {
        keySentences.push(sentences[i]);
      }
    }
    
    summary = keySentences.join('. ').trim() + '.';
    
    // Translate summary if needed
    if (targetLanguage !== 'en') {
      summary = await translateText(summary, getTranslationLanguageCode(targetLanguage));
    }
    
    return summary;
    
  } catch (error) {
    console.error('Summary generation error:', error);
    const fallback = 'Unable to generate summary at this time.';
    return targetLanguage !== 'en' 
      ? await translateText(fallback, getTranslationLanguageCode(targetLanguage))
      : fallback;
  }
};
