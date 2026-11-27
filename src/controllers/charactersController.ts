import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as charactersService from '../services/charactersService';
import type { CharacterParams } from '../data/characters';

export function list(req: Request, res: Response): void {
  const characters = charactersService.list({
    status: req.query.status as string | undefined,
    species: req.query.species as string | undefined
  });
  res.status(StatusCodes.OK).json(characters);
}

export function getStats(_req: Request, res: Response): void {
  const stats = charactersService.getStats();
  res.status(StatusCodes.OK).json(stats);
}

export function getOne(req: Request<CharacterParams>, res: Response): void {
  const character = charactersService.getById(req.params.id);
  res.status(StatusCodes.OK).json(character);
}

export function create(req: Request, res: Response): void {
  const character = charactersService.create(req.body);
  res.status(StatusCodes.CREATED).json(character);
}

export function replace(req: Request<CharacterParams>, res: Response): void {
  const character = charactersService.replace(req.params.id, req.body);
  res.status(StatusCodes.OK).json(character);
}

export function patch(req: Request<CharacterParams>, res: Response): void {
  const character = charactersService.patch(req.params.id, req.body);
  res.status(StatusCodes.OK).json(character);
}

export function remove(req: Request<CharacterParams>, res: Response): void {
  charactersService.remove(req.params.id);
  res.sendStatus(StatusCodes.NO_CONTENT);
}

export function methodNotAllowed(_req: Request, res: Response): void {
  res
    .status(StatusCodes.METHOD_NOT_ALLOWED)
    .json({ error: 'Method not allowed' });
}
