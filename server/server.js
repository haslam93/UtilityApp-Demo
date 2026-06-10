import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import outagesRouter from './routes/outages.js';
import metersRouter from './routes/meters.js';
import customersRouter from './routes/customers.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Tier 1: static frontend
app.use(express.static(path.join(__dirname, '..', 'public')));

// Tier 2: REST API
app.use('/api/outages', outagesRouter);
app.use('/api/meters', metersRouter);
app.use('/api/customers', customersRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'gridwatch-api', time: new Date().toISOString() });
});

// Central error handler — keeps the standard error envelope.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Unexpected server error' } });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`GridWatch running at http://localhost:${PORT}`);
  });
}

export default app;
