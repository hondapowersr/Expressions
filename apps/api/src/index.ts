import { config } from 'dotenv';
config({ path: '.env.local' });

import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { healthRouter } from './routes/health';
import { aiRouter } from './routes/ai';

const app: Express = express();
const PORT = process.env.PORT || 8080;

const allowedOrigins = [
  'http://localhost:3000',
  'https://expressions.hondapowersr.workers.dev',
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

app.use('/health', healthRouter);
app.use('/ai', aiRouter);

app.listen(PORT, () => {
  console.log(`Expressions API running on port ${PORT}`);
});

export default app;
