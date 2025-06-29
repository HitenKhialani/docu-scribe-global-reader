// Mock AI suggestion utility
export async function getAISuggestion(context: string, word: string): Promise<string> {
  const res = await fetch('http://localhost:5001/api/ai-suggestion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ context, word }),
  });
  const data = await res.json();
  return data.suggestion || word;
} 