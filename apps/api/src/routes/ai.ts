import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';
import { getGeminiModel, buildSystemPrompt, mapToVertexHistory } from '../services/vertex-ai';
import type { ChatRequest } from '@expressions/shared';

export const aiRouter = Router();

aiRouter.post('/chat', requireAuth, async (req: Request, res: Response): Promise<void> => {
  const { messages, artistRole, sessionContext } = req.body as ChatRequest;

  if (!messages || !artistRole) {
    res.status(400).json({ error: 'messages and artistRole are required' });
    return;
  }

  try {
    const model = getGeminiModel();
    const systemPrompt = buildSystemPrompt(artistRole, sessionContext);
    const history = mapToVertexHistory(messages.slice(0, -1));
    const lastMessage = messages[messages.length - 1];

    const chat = model.startChat({
      systemInstruction: { role: 'system', parts: [{ text: systemPrompt }] },
      history,
    });

    // Stream the response using Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream = await chat.sendMessageStream(lastMessage.content);

    for await (const chunk of stream.stream) {
      const text = chunk.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    console.error('AI chat error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'AI service error' });
    }
  }
});
