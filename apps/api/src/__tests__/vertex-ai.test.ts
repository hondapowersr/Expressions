import { describe, it, expect, vi } from 'vitest';
import type { ArtistRole } from '@expressions/shared';

const mockGenerativeModel = {
  startChat: vi.fn(),
  generateContent: vi.fn(),
  generateContentStream: vi.fn(),
};

vi.mock('@google-cloud/vertexai', () => ({
  VertexAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: vi.fn(() => mockGenerativeModel),
  })),
  HarmCategory: {
    HARM_CATEGORY_HATE_SPEECH: 'HARM_CATEGORY_HATE_SPEECH',
    HARM_CATEGORY_DANGEROUS_CONTENT: 'HARM_CATEGORY_DANGEROUS_CONTENT',
  },
  HarmBlockThreshold: {
    BLOCK_MEDIUM_AND_ABOVE: 'BLOCK_MEDIUM_AND_ABOVE',
  },
}));

describe('vertex-ai service', () => {
  it('getGeminiModel returns a model instance', async () => {
    const { getGeminiModel } = await import('../services/vertex-ai');
    const model = getGeminiModel();
    expect(model).toBe(mockGenerativeModel);
  });

  it('getGeminiModel returns the same instance on repeated calls (singleton)', async () => {
    const { getGeminiModel } = await import('../services/vertex-ai');
    const m1 = getGeminiModel();
    const m2 = getGeminiModel();
    expect(m1).toBe(m2);
  });

  describe('buildSystemPrompt', () => {
    it('returns a non-empty string for each role', async () => {
      const { buildSystemPrompt } = await import('../services/vertex-ai');
      const roles: ArtistRole[] = ['tutor', 'guide', 'critic', 'freestyle'];
      for (const role of roles) {
        const prompt = buildSystemPrompt(role);
        expect(typeof prompt).toBe('string');
        expect(prompt.length).toBeGreaterThan(20);
      }
    });

    it('appends emotional intent when provided', async () => {
      const { buildSystemPrompt } = await import('../services/vertex-ai');
      const prompt = buildSystemPrompt('tutor', 'melancholy but hopeful');
      expect(prompt).toContain('melancholy but hopeful');
    });

    it('different roles produce different prompts', async () => {
      const { buildSystemPrompt } = await import('../services/vertex-ai');
      const tutorPrompt = buildSystemPrompt('tutor');
      const criticPrompt = buildSystemPrompt('critic');
      expect(tutorPrompt).not.toBe(criticPrompt);
    });
  });

  describe('mapToVertexHistory', () => {
    it('maps user messages correctly', async () => {
      const { mapToVertexHistory } = await import('../services/vertex-ai');
      const messages = [{ role: 'user' as const, content: 'hello', timestamp: 0 }];
      const result = mapToVertexHistory(messages);
      expect(result).toEqual([{ role: 'user', parts: [{ text: 'hello' }] }]);
    });

    it('maps assistant messages to model role', async () => {
      const { mapToVertexHistory } = await import('../services/vertex-ai');
      const messages = [{ role: 'assistant' as const, content: 'hi there', timestamp: 0 }];
      const result = mapToVertexHistory(messages);
      expect(result).toEqual([{ role: 'model', parts: [{ text: 'hi there' }] }]);
    });
  });
});
