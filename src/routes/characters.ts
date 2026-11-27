import { Router } from 'express';
import * as charactersController from '../controllers/charactersController';

const router = Router();

router.get('/stats', charactersController.getStats);
router.get('/', charactersController.list);
router.post('/', charactersController.create);

router.get('/:id', charactersController.getOne);
router.put('/:id', charactersController.replace);
router.patch('/:id', charactersController.patch);
router.delete('/:id', charactersController.remove);
router.post('/:id', charactersController.methodNotAllowed);

export { router as charactersRouter };
