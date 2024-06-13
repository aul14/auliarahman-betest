import express from 'express';
import { getAllOrByQuery, create, getById, update, deleted } from '../controllers/UserInfoController.js';

const router = express.Router();

router.get('/userinfo/account', getAllOrByQuery);
router.post('/userinfo/account', create);
router.get('/userinfo/account/:id', getById);
router.put('/userinfo/account/:id', update);
router.delete('/userinfo/account/:id', deleted);

export default router;