import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import tasksRouter from './routes/tasks.js';

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',');
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: '100kb' }));

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/tasks', tasksRouter);

// Central error handler — keeps error shape consistent and never leaks stack traces
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: 'Something went wrong' });
});

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`TaskFlow API listening on port ${port}`));
