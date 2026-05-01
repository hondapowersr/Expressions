import type { ChatRequest, HealthResponse } from '@expressions/shared';

export function createApiClient(getToken: () => Promise<string | null>) {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

  async function authHeaders(): Promise<HeadersInit> {
    const token = await getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  return {
    async health(): Promise<HealthResponse> {
      const res = await fetch(`${BASE_URL}/health`);
      if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
      return res.json();
    },

    async *chat(req: ChatRequest): AsyncGenerator<string> {
      const headers = await authHeaders();
      const res = await fetch(`${BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(req),
      });

      if (!res.ok) throw new Error(`Chat request failed: ${res.status}`);
      if (!res.body) throw new Error('No response body');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;
            try {
              const parsed = JSON.parse(data) as { text: string };
              yield parsed.text;
            } catch { /* skip malformed chunks */ }
          }
        }
      }
    },
  };
}
