import { Router } from 'express';
import { outages, nextOutageId } from '../data/seed.js';

const router = Router();

const VALID_STATUSES = ['reported', 'assigned', 'in-progress', 'restored'];
const VALID_SEVERITIES = ['low', 'medium', 'high', 'critical'];

// GET /api/outages?status=&feederId=
router.get('/', (req, res) => {
  let result = outages;
  const { status, feederId } = req.query;
  if (status) result = result.filter((o) => o.status === status);
  if (feederId) result = result.filter((o) => o.feederId === feederId);
  res.json({ data: result, count: result.length });
});

// GET /api/outages/:id
router.get('/:id', (req, res) => {
  const outage = outages.find((o) => o.id === req.params.id);
  if (!outage) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: `Outage ${req.params.id} not found` } });
  }
  res.json({ data: outage });
});

// POST /api/outages
router.post('/', (req, res) => {
  const { feederId, cause, severity, customersAffected } = req.body ?? {};

  if (!feederId || !cause) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'feederId and cause are required' } });
  }
  if (severity && !VALID_SEVERITIES.includes(severity)) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: `severity must be one of: ${VALID_SEVERITIES.join(', ')}` } });
  }

  const outage = {
    id: nextOutageId(),
    feederId,
    cause,
    status: 'reported',
    severity: severity ?? 'low',
    customersAffected: Number(customersAffected) || 0,
    reportedAt: new Date().toISOString(),
    restoredAt: null,
    crew: null
  };
  outages.push(outage);
  res.status(201).json({ data: outage });
});

// PATCH /api/outages/:id — update status and/or crew assignment
router.patch('/:id', (req, res) => {
  const outage = outages.find((o) => o.id === req.params.id);
  if (!outage) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: `Outage ${req.params.id} not found` } });
  }

  const { status, crew } = req.body ?? {};
  if (status) {
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: `status must be one of: ${VALID_STATUSES.join(', ')}` } });
    }
    outage.status = status;
    if (status === 'restored') outage.restoredAt = new Date().toISOString();
  }
  if (crew !== undefined) outage.crew = crew;

  res.json({ data: outage });
});

export default router;
