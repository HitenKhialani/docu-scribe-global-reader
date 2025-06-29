// Translation service that calls backend API

const API_URL = import.meta.env.VITE_API_URL || '';

export const translateText = async (text: string, targetLanguage: string, sourceLanguage?: string): Promise<string> => {
  try {
    if (!text.trim()) {
      return text; // No translation needed for empty text
    }

    // Split text into chunks to avoid API limits
    const chunks = text.match(/.{1,500}/g) || [text];
    const translatedChunks = [];

    const srcLang = sourceLanguage || 'auto';

    for (const chunk of chunks) {
      try {
        const response = await fetch(`${API_URL}/api/translate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: chunk, targetLanguage, sourceLanguage: srcLang }),
        });
        if (response.ok) {
          const data = await response.json();
          translatedChunks.push(data.translatedText);
        } else {
          translatedChunks.push(chunk); // Fallback to original if translation fails
        }
      } catch (error) {
        console.warn('Translation chunk failed, using original:', error);
        translatedChunks.push(chunk); // Fallback to original if translation fails
      }
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return translatedChunks.join(' ');
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text if translation fails
  }
};

// Language code mapping for translation API
export const getTranslationLanguageCode = (languageCode: string): string => {
  const languageMap: { [key: string]: string } = {
    'en': 'en',
    'hi': 'hi',
    'fr': 'fr',
    'es': 'es',
    'de': 'de',
    'zh': 'zh',
    'ja': 'ja',
    'ar': 'ar'
  };
  
  return languageMap[languageCode] || 'en';
};
