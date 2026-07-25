import type { ToneType } from '../types/draft';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export async function applyToneRefinement(currentBody: string, tone: ToneType): Promise<string> {
  try {
    const res = await fetch(`${API_BASE_URL}/suggestions/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentBody, suggestion: tone }),
    });

    if (res.ok) {
      const result = await res.json();
      if (result.success && result.data) {
        return result.data.updatedBody;
      }
    }
  } catch (error) {
    console.warn('Backend API unavailable, using fallback suggestion logic:', error);
  }

  return `[Tone optimized to ${tone}]\n\n${currentBody}`;
}
