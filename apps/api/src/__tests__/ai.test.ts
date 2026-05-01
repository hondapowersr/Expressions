import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

// Mock auth middleware to bypass token verification
vi.mock('../middleware/auth', () => ({
  requireAuth: (_req: any, _res: any, next: any) => next(),
}));

// Mock Vertex AI service
const mockSendMessageStream = vi.fn();
const mockStartChat = vi.fn(() => ({ sendMessageStream: mockSendMessageStream }));

vi.mock('../services/vertex-ai', () => ({
  getGeminiModel: vi.fn(() => ({ startChat: mockStartChat })),
  buildSystemPrompt: vi.fn(() => 'mocked system prompt'),
  mapToVertexHistory: vi.fn(() => []),
}));

// Import router after mocks
import { aiRouter } from '../routes/ai';

const app = express();
app.use(express.json());
app.use('/ai', aiRouter);

describe('POST /ai/chat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 when messages is missing', async () => {
    const res = await request(app)
      .post('/ai/chat')
      .send({ artistRole: 'tutor' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('returns 400 when artistRole is missing', async () => {
    const res = await request(app)
      .post('/ai/chat')
      .send({ messages: [{ role: 'user', content: 'hello', timestamp: 0 }] });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('returns SSE stream with content when valid request', async () => {
    const asyncIterator = (async function* () {
      yield { candidates: [{ content: { parts: [{ text: 'Hello artist' }] } }] };
    })();
    mockSendMessageStream.mockResolvedValue({ stream: asyncIterator });

    const res = await request(app)
      .post('/ai/chat')
      .send({
        messages: [{ role: 'user', content: 'help me brainstorm', timestamp: Date.now() }],
        artistRole: 'guide',
      });

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('text/event-stream');
    expect(res.text).toContain('data:');
    expect(res.text).toContain('[DONE]');
  });
});
