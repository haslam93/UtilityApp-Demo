import { test } from 'node:test';
import assert from 'node:assert/strict';

process.env.NODE_ENV = 'test';
const { default: app } = await import('../server.js');

let server;
let baseUrl;

test.before(() => {
  server = app.listen(0);
  baseUrl = `http://localhost:${server.address().port}`;
});

test.after(() => server.close());

test('GET /api/outages returns seeded outages', async () => {
  const res = await fetch(`${baseUrl}/api/outages`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.ok(body.count >= 4);
  assert.ok(body.data.every((o) => o.id.startsWith('OUT-')));
});

test('GET /api/outages?status=restored filters by status', async () => {
  const res = await fetch(`${baseUrl}/api/outages?status=restored`);
  const body = await res.json();
  assert.ok(body.data.every((o) => o.status === 'restored'));
});

test('POST /api/outages rejects missing fields', async () => {
  const res = await fetch(`${baseUrl}/api/outages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cause: 'storm' })
  });
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.equal(body.error.code, 'VALIDATION_ERROR');
});

test('POST then PATCH outage lifecycle', async () => {
  const createRes = await fetch(`${baseUrl}/api/outages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ feederId: 'FDR-99', cause: 'storm', severity: 'high', customersAffected: 50 })
  });
  assert.equal(createRes.status, 201);
  const { data: outage } = await createRes.json();
  assert.equal(outage.status, 'reported');

  const patchRes = await fetch(`${baseUrl}/api/outages/${outage.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'restored' })
  });
  const { data: updated } = await patchRes.json();
  assert.equal(updated.status, 'restored');
  assert.ok(updated.restoredAt);
});
