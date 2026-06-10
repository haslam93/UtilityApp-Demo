import { Router } from 'express';
import { customers } from '../data/seed.js';

const router = Router();

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

// GET /api/customers/:id/bill?period=YYYY-MM
//
// TODO (live demo): implement bill calculation for the given period.
// Use the tariff rules in .github/skills/tariff-billing/SKILL.md —
// ask Copilot: "Implement the bill endpoint using the tariff billing skill."
router.get('/:id/bill', (req, res) => {
  res.status(501).json({ error: { code: 'NOT_IMPLEMENTED', message: 'Bill calculation not implemented yet' } });
});

export default router;
