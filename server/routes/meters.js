import { Router } from 'express';
import { meters, readings, customers } from '../data/seed.js';

const router = Router();

// GET /api/meters
router.get('/', (req, res) => {
  const enriched = meters.map((m) => ({
    ...m,
    customerName: customers.find((c) => c.id === m.customerId)?.name ?? 'Unknown'
  }));
  res.json({ data: enriched, count: enriched.length });
});

// GET /api/meters/:id/readings
router.get('/:id/readings', (req, res) => {
  const meter = meters.find((m) => m.id === req.params.id);
  if (!meter) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: `Meter ${req.params.id} not found` } });
  }
  const meterReadings = readings
    .filter((r) => r.meterId === meter.id)
    .map((r) => ({ ...r, billedKwh: r.read * meter.multiplier }));
  res.json({ data: meterReadings, count: meterReadings.length });
});

export default router;
