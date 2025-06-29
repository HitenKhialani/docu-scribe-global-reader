// openai-suggestion-server.js (ESM version)
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleTranslator } from '@translate-tools/core/translators/GoogleTranslator/index.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/api/ai-suggestion', async (req, res) => {
  const { context, word } = req.body;
  const prompt = `
You are a spelling correction assistant.
Given the sentence: "${context}", and the word: "${word}", if the word is misspelled or incorrect, respond with the correct word.
If the word is correct, respond with the same word.
Respond with only the corrected word, nothing else.

Example:
Sentence: "Helo thi is ruturaj", Word: "Helo" → "Hello"
Sentence: "Helo thi is ruturaj", Word: "thi" → "this"
Sentence: "Helo thi is ruturaj", Word: "is" → "is"
Sentence: "Helo thi is ruturaj", Word: "ruturaj" → "ruturaj"

Now, given the sentence: "${context}", and the word: "${word}", respond with only the corrected word.
`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 5,
        temperature: 0.2
      })
    });

    const data = await response.json();
    const suggestion = data.choices?.[0]?.message?.content?.trim() || word;
    res.json({ suggestion });
  } catch (error) {
    res.status(500).json({ suggestion: word, error: error.message });
  }
});

// Translation endpoint
app.post('/api/translate', async (req, res) => {
  const { text, targetLanguage, sourceLanguage } = req.body;
  console.log('[TRANSLATE] Request:', { text, sourceLanguage, targetLanguage });
  const translator = new GoogleTranslator({
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36',
    },
  });
  try {
    const srcLang = sourceLanguage || 'auto';
    const translatedText = await translator.translate(text, srcLang, targetLanguage);
    console.log('[TRANSLATE] Result:', { translatedText });
    res.json({ translatedText });
  } catch (error) {
    console.error('[TRANSLATE] Error:', error);
    res.status(500).json({ translatedText: text, error: error.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`AI Suggestion server running on port ${PORT}`);
}); 