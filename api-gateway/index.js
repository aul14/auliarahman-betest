import express from 'express';
import dotenv from 'dotenv';
import logger from 'morgan';
import cors from 'cors';

import usersRoutes from './routes/users.js';
import accountsRoutes from './routes/accounts.js';

import { verifyToken } from './middlewares/verifyToken.js';

dotenv.config();

const app = express();

const { URL_ALLOW_CORS, APP_PORT } = process.env;

app.use(cors({
    credentials: true,
    origin: URL_ALLOW_CORS
}));

app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

app.use('/api/userinfo', verifyToken, usersRoutes);
app.use('/api/account', accountsRoutes);

const port = APP_PORT || 3000;

app.listen(port, () => {
    console.log(`Server up and running in port ${port}...`);
})

