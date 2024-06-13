import express from 'express';
import { getAccountsByLastLogin, login } from './handler/account/accountHandler.js';

import { verifyToken } from '../middlewares/verifyToken.js';

const router = express.Router();

router.get('/lastlogin', verifyToken, getAccountsByLastLogin)
router.post('/login', login);

export default router;