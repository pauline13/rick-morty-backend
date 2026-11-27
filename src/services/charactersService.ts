import { randomUUID } from 'node:crypto';
import {
  characters,
  type Character,
  type CharacterStatus
} from '../data/characters';
import {
  requireCharacter,
  requireCharacterIndex,
  requireCharacterInput,
  requireCharacterPatch,
  throwInvalidSpeciesFilter,
  throwInvalidStatusFilter
} from '../lib/charactersErrors';

const VALID_STATUSES: CharacterStatus[] = ['alive', 'dead', 'unknown'];

function findIndex(id: string): number {
  return characters.findIndex((character) => character.id === id);
}

export function list(filters?: {
  status?: string;
  species?: string;
}): Character[] {
  let filteredCharacters = characters;

  if (filters?.status !== undefined) {
    if (!VALID_STATUSES.includes(filters.status as CharacterStatus)) {
      throwInvalidStatusFilter();
    }

    filteredCharacters = filteredCharacters.filter(
      (character) => character.status === filters.status
    );
  }

  if (filters?.species !== undefined) {
    const species = filters.species.trim();

    if (!species) {
      throwInvalidSpeciesFilter();
    }

    filteredCharacters = filteredCharacters.filter(
      (character) => character.species.toLowerCase() === species.toLowerCase()
    );
  }

  return filteredCharacters;
}

export function getStats(): {
  total: number;
  byStatus: Record<CharacterStatus, number>;
} {
  const byStatus: Record<CharacterStatus, number> = {
    alive: 0,
    dead: 0,
    unknown: 0
  };

  for (const character of characters) {
    byStatus[character.status] += 1;
  }

  return { total: characters.length, byStatus };
}

export function getById(id: string): Character {
  return requireCharacter(characters.find((character) => character.id === id));
}

export function create(body: unknown): Character {
  const input = requireCharacterInput(body);
  const created: Character = { id: randomUUID(), ...input };

  characters.push(created);
  return created;
}

export function replace(id: string, body: unknown): Character {
  const index = requireCharacterIndex(findIndex(id));
  const input = requireCharacterInput(body);

  characters[index] = { id, ...input };
  return characters[index];
}

export function patch(id: string, body: unknown): Character {
  const index = requireCharacterIndex(findIndex(id));
  const patchData = requireCharacterPatch(body);

  characters[index] = { ...characters[index], ...patchData };
  return characters[index];
}

export function remove(id: string): void {
  const index = requireCharacterIndex(findIndex(id));
  characters.splice(index, 1);
}
