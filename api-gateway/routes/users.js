import express from 'express';
import { create, destroy, get, getAllOrByQuery, update } from './handler/users/userHandler.js';

const router = express.Router();

router.get('/', getAllOrByQuery);
router.get('/:id', get);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', destroy);

export default router;