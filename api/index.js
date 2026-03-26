/* INDEX.JS: CONNECTION FROM CONFIGS AND ROUTES */

import express from 'express';
import cors from 'cors';
import config from './config.js';
import pool from './dbconfig.js';

const app = express();

app.use(cors({ origin: config.FRONTEND_URL }));
app.use(express.json());

app.get('/api/health', async (req, res) => {
    try {
        res.json({ status: 'ok'})
    } catch (err) {
        res.status(500).json({error: 'db connection failed'});
    }
});

app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`)
})