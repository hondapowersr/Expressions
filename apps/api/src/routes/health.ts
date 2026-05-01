import { Router } from 'express';
import type { HealthResponse } from '@expressions/shared';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  const response: HealthResponse = {
    status: 'ok',
    timestamp: Date.now(),
    version: process.env.npm_package_version || '0.0.1',
  };
  res.json(response);
});
