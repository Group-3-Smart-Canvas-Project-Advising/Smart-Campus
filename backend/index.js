// index.js - super tiny Smart Advising backend

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Allow JSON request bodies
app.use(express.json());
// Allow the frontend (running on another port) to talk to this API
app.use(cors());

// ===== "Fake database" in memory =====
let appointments = [];
let nextId = 1;

// Just to check the server is alive
app.get('/', (req, res) => {
  res.send('Smart Advising API is running ✨');
});

// GET /api/appointments - list all appointments
app.get('/api/appointments', (req, res) => {
  res.json(appointments);
});

// POST /api/appointments - create a new appointment
app.post('/api/appointments', (req, res) => {
  const { studentName, advisorName, startTime, endTime } = req.body;

  // Basic validation
  if (!studentName || !advisorName || !startTime || !endTime) {
    return res.status(400).json({
      ok: false,
      message: 'Missing required fields: studentName, advisorName, startTime, endTime'
    });
  }

  const newAppointment = {
    id: nextId++,
    studentName,
    advisorName,
    startTime,
    endTime,
    status: 'SCHEDULED'
  };

  appointments.push(newAppointment);

  res.status(201).json({
    ok: true,
    appointment: newAppointment
  });
});

// PATCH /api/appointments/:id/status - update status (e.g., CONFIRMED, CANCELED)
app.patch('/api/appointments/:id/status', (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;

  const validStatuses = ['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'NOSHOW', 'CANCELED'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      ok: false,
      message: 'Invalid status'
    });
  }

  const appt = appointments.find(a => a.id === id);
  if (!appt) {
    return res.status(404).json({
      ok: false,
      message: 'Appointment not found'
    });
  }

  appt.status = status;

  res.json({
    ok: true,
    appointment: appt
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Smart Advising API listening on http://localhost:${PORT}`);
});
