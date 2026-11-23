import http from 'node:http';
import { randomUUID } from 'node:crypto';
import { characters, type Character } from './data/characters';
import {
  getPathname,
  parseCharacterId,
  readCharacterInput,
  readJsonBodyOrSendError,
  sendError,
  sendJson
} from './lib/http';
import { parseCharacterPatch } from './lib/validate';
import { StatusCodes } from 'http-status-codes';

function findCharacterIndex(id: string): number {
  return characters.findIndex((character) => character.id === id);
}

export const METHODS_ON_ONE_CHARACTER = new Set([
  'GET',
  'PUT',
  'PATCH',
  'DELETE'
]);

const DEFAULT_PORT = 3000;
const DEFAULT_HOST = 'localhost';

async function handleRequest(
  req: http.IncomingMessage,
  res: http.ServerResponse
): Promise<void> {
  const method = req.method ?? 'GET';
  const pathname = getPathname(req.url);

  if (method === 'GET' && pathname === '/health') {
    sendJson(res, StatusCodes.OK, { ok: true });
    return;
  }

  if (pathname === '/characters') {
    if (method === 'GET') {
      sendJson(res, StatusCodes.OK, characters);
      return;
    }

    if (method === 'POST') {
      const characterFields = await readCharacterInput(req, res);

      if (!characterFields) return;

      const createdCharacter: Character = {
        id: randomUUID(),
        ...characterFields
      };

      characters.push(createdCharacter);
      sendJson(res, StatusCodes.CREATED, createdCharacter);
      return;
    }

    sendError(res, StatusCodes.METHOD_NOT_ALLOWED, 'Method not allowed');
    return;
  }

  const characterId = parseCharacterId(pathname);

  if (characterId) {
    const characterIndex = findCharacterIndex(characterId);

    if (METHODS_ON_ONE_CHARACTER.has(method) && characterIndex === -1) {
      sendError(res, StatusCodes.NOT_FOUND, 'Character not found');
      return;
    }

    if (method === 'GET') {
      sendJson(res, StatusCodes.OK, characters[characterIndex]);
      return;
    }

    if (method === 'PUT') {
      const characterFields = await readCharacterInput(req, res);

      if (!characterFields) return;

      characters[characterIndex] = { id: characterId, ...characterFields };

      sendJson(res, StatusCodes.OK, characters[characterIndex]);
      return;
    }

    if (method === 'PATCH') {
      const body = await readJsonBodyOrSendError(req, res);

      if (body === undefined) return;

      const patchFields = parseCharacterPatch(body);

      if (!patchFields) {
        sendError(res, StatusCodes.BAD_REQUEST, 'Invalid patch data');
        return;
      }

      characters[characterIndex] = {
        ...characters[characterIndex],
        ...patchFields
      };

      sendJson(res, StatusCodes.OK, characters[characterIndex]);
      return;
    }

    if (method === 'DELETE') {
      characters.splice(characterIndex, 1);
      sendJson(res, StatusCodes.NO_CONTENT);
      return;
    }

    sendError(res, StatusCodes.METHOD_NOT_ALLOWED, 'Method not allowed');
    return;
  }

  sendError(res, StatusCodes.NOT_FOUND, 'Not found');
}

const server = http.createServer((req, res) => {
  handleRequest(req, res).catch((err) => {
    console.error(err);

    if (!res.headersSent) {
      sendError(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        'Internal server error'
      );
    }
  });
});

const port = Number(process.env.PORT ?? DEFAULT_PORT);

server.listen(port, () => {
  console.log(`Listening on http://${DEFAULT_HOST}:${port}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});
