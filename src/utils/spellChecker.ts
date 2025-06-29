import SpellChecker from 'spellchecker-js';

const spell = new SpellChecker();
spell.use('en'); // set language

export function checkWord(word: string): { correct: boolean; suggestions: string[] } {
  const correct = spell.check(word);
  const suggestions = correct ? [] : spell.suggest(word);
  return { correct, suggestions };
}

export function batchCheckWords(words: string[]): { correct: boolean; suggestions: string[] }[] {
  return words.map(word => checkWord(word));
} 