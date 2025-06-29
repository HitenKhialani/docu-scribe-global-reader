import englishWords from 'an-array-of-english-words';
import didYouMean from 'didyoumean';

const wordSet = new Set(englishWords);

didYouMean.returnWinningObject = false;



export function isWordCorrect(word: string | undefined | null): boolean {
  if (!word || typeof word !== 'string') return true; // treat empty/undefined as correct
  const clean = word.replace(/[^a-zA-Z']/g, '').toLowerCase();
  return wordSet.has(clean) || clean === '';
}

export function getSuggestions(word: string, max = 5): string[] {
  if (!word || typeof word !== 'string') return [];
  const clean = word.replace(/[^a-zA-Z']/g, '').toLowerCase();
  // didYouMean returns the closest match; for more, use a custom approach
  const suggestion = didYouMean(clean, englishWords);
  return suggestion ? [suggestion] : [];
} 