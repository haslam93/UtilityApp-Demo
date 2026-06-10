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

test('GET /api/customers returns seeded customers', async () => {
  const res = await fetch(`${baseUrl}/api/customers`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.ok(body.count >= 8);
  assert.ok(body.data.every((c) => c.id.startsWith('CUST-')));
});

test('POST /api/customers rejects missing fields', async () => {
  const res = await fetch(`${baseUrl}/api/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Acme Co' })
  });
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.equal(body.error.code, 'VALIDATION_ERROR');
});

test('POST /api/customers rejects invalid type', async () => {
  const res = await fetch(`${baseUrl}/api/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Acme Co', type: 'farm', address: '1 Main St', feederId: 'FDR-07', rateClass: 'GS-1' })
  });
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.equal(body.error.code, 'VALIDATION_ERROR');
});

test('POST /api/customers creates a customer', async () => {
  const createRes = await fetch(`${baseUrl}/api/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Acme Co', type: 'commercial', address: '1 Main St', feederId: 'FDR-07', rateClass: 'GS-1' })
  });
  assert.equal(createRes.status, 201);
  const { data: customer } = await createRes.json();
  assert.ok(customer.id.startsWith('CUST-'));
  assert.equal(customer.name, 'Acme Co');
  assert.equal(customer.rateClass, 'GS-1');

  const getRes = await fetch(`${baseUrl}/api/customers/${customer.id}`);
  assert.equal(getRes.status, 200);
  const { data: fetched } = await getRes.json();
  assert.equal(fetched.id, customer.id);
});

test('GET /api/customers/:id returns 404 for unknown id', async () => {
  const res = await fetch(`${baseUrl}/api/customers/CUST-9999`);
  assert.equal(res.status, 404);
  const body = await res.json();
  assert.equal(body.error.code, 'NOT_FOUND');
});
