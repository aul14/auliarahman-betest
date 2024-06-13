import express from 'express';

import { Login, getAccountsByLastLogin } from '../controllers/AccountController.js';

const router = express.Router();

router.post('/account/login', Login);
router.get('/account/lastlogin', getAccountsByLastLogin);

export default router;