// GridWatch dashboard — vanilla JS, talks to the GridWatch REST API.

const api = {
  async get(path) {
    const res = await fetch(`/api${path}`);
    if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
    return res.json();
  },
  async post(path, body) {
    const res = await fetch(`/api${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message ?? `POST ${path} failed`);
    return json;
  }
};

const escapeHtml = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

const badge = (value) => `<span class="badge badge-${escapeHtml(value)}">${escapeHtml(value)}</span>`;

const formatTime = (iso) => (iso ? new Date(iso).toLocaleString() : '—');

async function loadHealth() {
  const pill = document.getElementById('health-pill');
  try {
    await api.get('/health');
    pill.textContent = 'API: online';
    pill.className = 'pill pill-ok';
  } catch {
    pill.textContent = 'API: offline';
    pill.className = 'pill pill-down';
  }
}

async function loadOutages() {
  const status = document.getElementById('status-filter').value;
  const { data } = await api.get(`/outages${status ? `?status=${status}` : ''}`);

  document.getElementById('outage-rows').innerHTML = data
    .map(
      (o) => `<tr>
        <td>${escapeHtml(o.id)}</td>
        <td>${escapeHtml(o.feederId)}</td>
        <td>${escapeHtml(o.cause)}</td>
        <td>${badge(o.severity)}</td>
        <td>${badge(o.status)}</td>
        <td>${o.customersAffected.toLocaleString()}</td>
        <td>${escapeHtml(o.crew ?? 'Unassigned')}</td>
        <td>${formatTime(o.reportedAt)}</td>
      </tr>`
    )
    .join('');

  const active = data.filter((o) => o.status !== 'restored');
  document.getElementById('stat-active').textContent = active.length;
  document.getElementById('stat-affected').textContent = active
    .reduce((sum, o) => sum + o.customersAffected, 0)
    .toLocaleString();
}

async function loadMeters() {
  const { data, count } = await api.get('/meters');
  document.getElementById('stat-meters').textContent = count;
  document.getElementById('meter-rows').innerHTML = data
    .map(
      (m) => `<tr>
        <td>${escapeHtml(m.id)}</td>
        <td>${escapeHtml(m.customerName)}</td>
        <td>${escapeHtml(m.type)}</td>
        <td>x${m.multiplier}</td>
        <td>${escapeHtml(m.installDate)}</td>
      </tr>`
    )
    .join('');
}

async function loadCustomers() {
  const { count } = await api.get('/customers');
  document.getElementById('stat-customers').textContent = count;
}

document.getElementById('status-filter').addEventListener('change', loadOutages);

document.getElementById('outage-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const payload = Object.fromEntries(new FormData(form).entries());
  try {
    await api.post('/outages', payload);
    form.reset();
    await loadOutages();
  } catch (err) {
    alert(err.message);
  }
});

loadHealth();
loadOutages();
loadMeters();
loadCustomers();
