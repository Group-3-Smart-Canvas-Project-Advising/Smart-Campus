// index.js - super tiny Smart Advising backend

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Allow JSON request bodies
app.use(express.json());

// Allow the frontend (running on another port) to talk to this API
app.use(cors());

// ===== "Fake appts" =====
let appointments = [
  {
    id: 1,
    studentName: 'Demo Student',
    advisorName: 'Dr. GlaDOS',  
    startTime: "2025-12-01T15:00:00Z",
    endTime: "2025-12-01T15:30:00Z",
    status: 'SCHEDULED'
  },
  {
    id: 2,
    studentName: 'Meg Rex',
    advisorName: 'Dr. GlaDOS',
    startTime: "2025-12-02T18:00:00Z",
    endTime: "2025-12-02T18:45:00Z",
    status: 'CONFIRMED'
  }
];
let nextId = 3;

// ===== "Fake users" =====
const users = [
  {
    id: 1,
    username: "student",
    password: "password", 
    role: "student",
    name: "Demo Student"
  },
  {
    id: 2,
    username: "advisor",
    password: "password",
    role: "advisor",
    name: "Dr. GlaDOS"
  }
];

// Server is aliiiive
app.get('/', (req, res) => {
  res.send('Smart Advising API is running ✨');
});

// GET /api/appointments - list all appointments
app.get('/api/appointments', (req, res) => {
  res.json(appointments);
});

// POST /api/login - validate credentials against dummy users
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      ok: false,
      message: 'Username and password are required.'
    });
  }

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({
      ok: false,
      message: 'Invalid username or password.'
    });
  }

  // Don’t send password back
  const { password: _, ...safeUser } = user;

  return res.json({
    ok: true,
    user: safeUser
  });
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
