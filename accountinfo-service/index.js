import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import AccountRoutes from './routes/AccountRoutes.js';

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

app.use('/api', AccountRoutes);

const port = process.env.APP_PORT || 5001;

app.listen(port, () => {
    console.log(`Server up and running ${port}`);
})