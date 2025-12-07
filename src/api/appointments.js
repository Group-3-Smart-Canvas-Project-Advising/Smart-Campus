// Frontend API facade for appointments

const BASE = (import.meta && import.meta.env && import.meta.env.VITE_API_BASE_URL)
  ? import.meta.env.VITE_API_BASE_URL
  : "http://localhost:3000";

// Normalize both mock objects and DB records into the shape the UI expects.
const normalize = (r = {}) => ({
  id:
    r.id ??
    r.AppointmentId ??
    r.appointmentId ??
    null,
  studentName:
    r.studentName ??
    r.StudentName ??
    r.student_name ??
    "",                   
  advisorName:
    r.advisorName ??
    r.AdvisorName ??
    r.advisor_name ??
    "",
  startTime:
    r.startTime ??
    r.StartTimeUtc ??
    r.start_time ??
    null,
  endTime:
    r.endTime ??
    r.EndTimeUtc ??
    r.end_time ??
    null,
  status:
    r.status ??
    r.StatusCode ??
    "SCHEDULED",
});

// List appointments relevant to the current user.
// In DB mode, backend is already filtering by user, so we DO NOT filter again here.
export async function listForUser(user) {
  if (!user) return [];

  const params = new URLSearchParams();
  if (user.role) params.set("role", user.role);
  if (user.id != null) params.set("userId", String(user.id));
  if (user.mode) params.set("mode", user.mode);

  const url = `${BASE}/api/appointments?${params.toString()}`;
  console.log("listForUser →", url);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const body = await res.json();
  console.log("listForUser body:", body);

  let rawList;
  if (Array.isArray(body)) {
    rawList = body;
  } else if (Array.isArray(body.appointments)) {
    rawList = body.appointments;
  } else {
    rawList = [];
  }

  return rawList.map(normalize);
}

// Create a new appointment
// appt: { studentName, advisorName, startTime, endTime, status? }
// user: { id, role, mode, ... }
export async function create(appt, user) {
  const body = { ...appt };

  if (user?.id != null) body.userId = user.id;
  if (user?.role) body.role = user.role;
  if (user?.mode) body.mode = user.mode;

  console.log("create() payload:", body);

  const res = await fetch(`${BASE}/api/appointments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const created = data && (data.appointment ?? data);
  return normalize(created);
}

// Update appointment status – for advisor-only future feature
export async function updateStatus(id, status, user) {
  const body = { status };
  if (user?.mode) body.mode = user.mode;

  const res = await fetch(`${BASE}/api/appointments/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const updated = data && (data.appointment ?? data);
  return normalize(updated);
}

export default { listForUser, create, updateStatus };