import type http from 'node:http';
import { StatusCodes } from 'http-status-codes';
import type { CharacterInput } from '../data/characters';
import { parseCharacterInput } from './validate';

const JSON_TYPE = 'application/json';

export function getPathname(url?: string): string {
  return (url ?? '').split('?')[0];
}

/** /characters/:id → id или null */
export function parseCharacterId(pathname: string): string | null {
  const match = pathname.match(/^\/characters\/([^/]+)$/);
  return match?.[1] ?? null;
}

export async function readJsonBodyOrSendError(
  req: http.IncomingMessage,
  res: http.ServerResponse
): Promise<unknown | undefined> {
  try {
    return await readJsonBody(req);
  } catch {
    sendError(res, StatusCodes.BAD_REQUEST, 'Invalid JSON');
    return undefined;
  }
}

export async function readCharacterInput(
  req: http.IncomingMessage,
  res: http.ServerResponse
): Promise<CharacterInput | undefined> {
  const body = await readJsonBodyOrSendError(req, res);

  if (body === undefined) return undefined;

  const characterFields = parseCharacterInput(body);

  if (!characterFields) {
    sendError(res, StatusCodes.BAD_REQUEST, 'Invalid character data');
    return undefined;
  }
  return characterFields;
}

export function readJsonBody(req: http.IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('error', reject);
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');

      if (!raw.trim()) {
        resolve(null);
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new SyntaxError('Invalid JSON'));
      }
    });
  });
}

export function sendJson(
  res: http.ServerResponse,
  status: number,
  body?: unknown
): void {
  if (status === StatusCodes.NO_CONTENT) {
    res.writeHead(StatusCodes.NO_CONTENT);
    res.end();
    return;
  }

  res.writeHead(status, { 'Content-Type': JSON_TYPE });
  res.end(JSON.stringify(body));
}

export function sendError(
  res: http.ServerResponse,
  status: number,
  message: string
): void {
  sendJson(res, status, { error: message });
}
