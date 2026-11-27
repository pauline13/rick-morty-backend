import express from 'express';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import { requestLogger } from './middleware/requestLogger';
import { charactersRouter } from './routes/characters';
import { healthRouter } from './routes/health';

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(requestLogger);

  app.use('/health', healthRouter);
  app.use('/characters', charactersRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
