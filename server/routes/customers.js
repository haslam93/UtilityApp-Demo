import { Router } from 'express';
import { customers, nextCustomerId } from '../data/seed.js';

const router = Router();

const VALID_TYPES = ['residential', 'commercial', 'industrial'];
const VALID_RATE_CLASSES = ['RES-1', 'GS-1', 'GS-2', 'GS-3', 'IND-1'];

// GET /api/customers
router.get('/', (req, res) => {
  res.json({ data: customers, count: customers.length });
});

// GET /api/customers/:id
router.get('/:id', (req, res) => {
  const customer = customers.find((c) => c.id === req.params.id);
  if (!customer) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: `Customer ${req.params.id} not found` } });
  }
  res.json({ data: customer });
});

// POST /api/customers
router.post('/', (req, res) => {
  const { name, type, address, feederId, rateClass } = req.body ?? {};

  if (!name || !type || !address || !feederId || !rateClass) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'name, type, address, feederId and rateClass are required' } });
  }
  if (!VALID_TYPES.includes(type)) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: `type must be one of: ${VALID_TYPES.join(', ')}` } });
  }
  if (!VALID_RATE_CLASSES.includes(rateClass)) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: `rateClass must be one of: ${VALID_RATE_CLASSES.join(', ')}` } });
  }

  const customer = {
    id: nextCustomerId(),
    name,
    type,
    address,
    feederId,
    rateClass
  };
  customers.push(customer);
  res.status(201).json({ data: customer });
});

// GET /api/customers/:id/bill?period=YYYY-MM
//
// TODO (live demo): implement bill calculation for the given period.
// Use the tariff rules in .github/skills/tariff-billing/SKILL.md —
// ask Copilot: "Implement the bill endpoint using the tariff billing skill."
router.get('/:id/bill', (req, res) => {
  res.status(501).json({ error: { code: 'NOT_IMPLEMENTED', message: 'Bill calculation not implemented yet' } });
});

export default router;
