import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { HttpError } from '../lib/httpError';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(err);

  if (res.headersSent) {
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }

  // SyntaxError от express.json() при битом JSON
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid JSON' });
    return;
  }

  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ error: 'Internal server error' });
}
