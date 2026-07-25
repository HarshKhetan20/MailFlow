const API_BASE_URL = 'http://localhost:8000/api/v1';

export async function generateDraftWithAI(topic: string, tone: string, specifics?: string): Promise<{ subject: string; body: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/composer/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, tone, specifics }),
    });

    if (res.ok) {
      const result = await res.json();
      if (result.success && result.data) {
        return result.data;
      }
    }
  } catch (error) {
    console.warn('Backend API unavailable, using fallback client generation:', error);
  }

  // Fallback resilience
  return {
    subject: `Regarding: ${topic}`,
    body: `Dear Recipient,\n\nI am writing regarding ${topic} in a ${tone} tone. ${specifics ? 'Additional context: ' + specifics + '.' : ''}\n\nPlease let me know your availability to discuss this further.\n\nBest regards,\n[Your Name]`,
  };
}
