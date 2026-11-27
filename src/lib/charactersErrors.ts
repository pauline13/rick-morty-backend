import { StatusCodes } from 'http-status-codes';
import type { Character, CharacterInput, CharacterPatch } from '../data/characters';
import { HttpError } from './httpError';
import { parseCharacterInput, parseCharacterPatch } from './validate';

export function throwCharacterNotFound(): never {
  throw new HttpError(StatusCodes.NOT_FOUND, 'Character not found');
}

export function throwInvalidStatusFilter(): never {
  throw new HttpError(StatusCodes.BAD_REQUEST, 'Invalid status filter');
}

export function throwInvalidSpeciesFilter(): never {
  throw new HttpError(StatusCodes.BAD_REQUEST, 'Invalid species filter');
}

export function requireCharacter(character: Character | undefined): Character {
  if (!character) {
    throwCharacterNotFound();
  }
  return character;
}

export function requireCharacterIndex(index: number): number {
  if (index === -1) {
    throwCharacterNotFound();
  }
  return index;
}

export function requireCharacterInput(body: unknown): CharacterInput {
  const input = parseCharacterInput(body);

  if (!input) {
    throw new HttpError(StatusCodes.BAD_REQUEST, 'Invalid character data');
  }

  return input;
}

export function requireCharacterPatch(body: unknown): CharacterPatch {
  const patch = parseCharacterPatch(body);

  if (!patch) {
    throw new HttpError(StatusCodes.BAD_REQUEST, 'Invalid patch data');
  }

  return patch;
}