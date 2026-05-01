import { config } from 'dotenv';
config({ path: '.env.local' });

import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app: Express = express();
const PORT = process.env.PORT || 8080;

const allowedOrigins = [
  'http://localhost:3000',
  'https://expressions.pages.dev',
  'https://test.expressions.pages.dev',
];

app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));

// Routes will be registered here in Tasks 6-9
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: Date.now(), version: '0.0.1' });
});

app.listen(PORT, () => {
  console.log(`Expressions API running on port ${PORT}`);
});

export default app;
