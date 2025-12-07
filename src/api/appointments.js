// Frontend API facade for appointments
// Backend-agnostic: only this file knows base URL and wire format.

const BASE = (import.meta && import.meta.env && import.meta.env.VITE_API_BASE_URL)
  ? import.meta.env.VITE_API_BASE_URL
  : 'http://localhost:3000';

const normalize = (r = {}) => ({
  id: r.id,
  studentName: r.studentName,
  advisorName: r.advisorName,
  startTime: r.startTime,
  endTime: r.endTime,
  status: r.status ?? 'SCHEDULED',
});

// List appointments relevant to the current user.
// user: { username, name, role }
// For now: fetch all and filter client-side to match current mock backend.
// Later: switch to server-side filtering (e.g., /api/appointments?student=... or ?advisor=...).
export async function listForUser(user) {
  const res = await fetch(`${BASE}/api/appointments`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const all = await res.json();

  if (!Array.isArray(all)) return [];

  const { role, username, name } = user || {};
  const mine = role === 'advisor'
    ? all.filter(a => a.advisorName === name)
    : all.filter(a => a.studentName === username);

  return mine.map(normalize);
}

// Create a new appointment
// appt: { studentName, advisorName, startTime, endTime, status? }
export async function create(appt) {
  const res = await fetch(`${BASE}/api/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appt),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const created = data && (data.appointment ?? data);
  return normalize(created);
}

// Update appointment status
export async function updateStatus(id, status) {
  const res = await fetch(`${BASE}/api/appointments/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const updated = data && (data.appointment ?? data);
  return normalize(updated);
}

export default { listForUser, create, updateStatus };
