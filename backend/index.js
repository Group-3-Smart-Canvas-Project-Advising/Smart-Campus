require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

const DATA_MODE = process.env.DATA_MODE || 'mock';
const useDb = DATA_MODE === 'db';

// top of file
const { query, sql } = require('./db');


// Allow JSON request bodies
app.use(express.json());

// Allow the frontend to talk to this API
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
  if (useDb)
    console.log("Database Connected");
});

// GET /api/appointments
app.get('/api/appointments', async (req, res) => {
  try {
    if (useDb) {
      // TODO: GetAppointmentsForUser

      return res.status(501).json({
        ok: false,
        message: 'DB appointments listing not implemented yet (DATA_MODE=db).'
      });
    } else {
      // ---- MOCK MODE ----
      res.json(appointments);
    }
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({
      ok: false,
      message: 'Could not load appointments.'
    });
  }
});

// POST /api/login - validate credentials against dummy users
app.post('/api/login', async (req, res) => {
  const { username, password, mode } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      ok: false,
      message: 'Username and password are required.'
    });
  }

  // Use mode from request if provided, otherwise fall back to environment variable
  const requestMode = mode || DATA_MODE;
  const useRequestDb = requestMode === 'db';

  try {
    if (useRequestDb) {
      // Database mode: Query AppUser table for matching credentials
      try {
        const result = await query(
          `SELECT TOP 1 [UserId], [Username], [DisplayName]
           FROM [AppUser]
           WHERE [Username] = @username AND [PasswordHash] = @password`,
          [
            { name: 'username', value: username },
            { name: 'password', value: password }
          ]
        );

        if (!result.recordset || result.recordset.length === 0) {
          return res.status(401).json({
            ok: false,
            message: 'Invalid username or password.'
          });
        }

        const user = result.recordset[0];
        
        // Determine role by checking Advisor and Student tables
        let role = 'User';
        try {
          const advisorCheck = await query(
            `SELECT TOP 1 1 FROM [Advisor] WHERE [UserId] = @userId`,
            [{ name: 'userId', value: user.UserId }]
          );
          if (advisorCheck.recordset && advisorCheck.recordset.length > 0) {
            role = 'advisor';
          } else {
            const studentCheck = await query(
              `SELECT TOP 1 1 FROM [Student] WHERE [UserId] = @userId`,
              [{ name: 'userId', value: user.UserId }]
            );
            if (studentCheck.recordset && studentCheck.recordset.length > 0) {
              role = 'student';
            }
          }
        } catch (roleErr) {
          console.log('Could not determine role from related tables, using default');
        }
        
        return res.json({
          ok: true,
          user: {
            id: user.UserId,
            username: user.Username,
            role: role,
            name: user.DisplayName
          }
        });
      } catch (err) {
        console.error('Database login error:', err);
        return res.status(500).json({
          ok: false,
          message: 'Login failed due to database error.',
          error: String(err)
        });
      }
    } else {
      // ---- MOCK MODE ----
      const user = users.find(
        (u) => u.username === username && u.password === password
      );

      if (!user) {
        return res.status(401).json({
          ok: false,
          message: 'Invalid username or password.'
        });
      }

      const { password: _, ...safeUser } = user;

      return res.json({
        ok: true,
        user: safeUser
      });
    }
  } catch (error) {
    console.error('Login failed:', error);
    return res.status(500).json({
      ok: false,
      message: 'Login failed due to server error.'
    });
  }
});


// POST /api/appointments - Create a new appointment
app.post('/api/appointments', async (req, res) => {
  const { studentName, advisorName, startTime, endTime } = req.body;

  if (!studentName || !advisorName || !startTime || !endTime) {
    return res.status(400).json({
      ok: false,
      message: 'Missing required fields: studentName, advisorName, startTime, endTime'
    });
  }

  try {
    if (useDb) {
      // TODO: CreateAppointment in DB

      return res.status(501).json({
        ok: false,
        message: 'DB appointment creation not implemented yet (DATA_MODE=db).'
      });
    } else {
      // ---- MOCK MODE ----
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
    }
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({
      ok: false,
      message: 'Could not create appointment.'
    });
  }
});

// PATCH /api/appointments/:id/status - update status (e.g., CONFIRMED, CANCELED)
app.patch('/api/appointments/:id/status', async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;

  const validStatuses = ['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'NOSHOW', 'CANCELED'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      ok: false,
      message: 'Invalid status'
    });
  }

  try {
    if (useDb) {
      // TODO: Update status in DB.
      return res.status(501).json({
        ok: false,
        message: 'DB status update not implemented yet (DATA_MODE=db).'
      });
    } else {
      // ---- MOCK MODE ----
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
    }
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      ok: false,
      message: 'Could not update appointment status.'
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Smart Advising API listening on http://localhost:${PORT}`);
});
