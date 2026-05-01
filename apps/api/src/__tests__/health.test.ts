import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';

// Import will fail until we create the route
import { healthRouter } from '../routes/health';

const app = express();
app.use('/health', healthRouter);

describe('GET /health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(typeof res.body.timestamp).toBe('number');
    expect(typeof res.body.version).toBe('string');
  });
});
