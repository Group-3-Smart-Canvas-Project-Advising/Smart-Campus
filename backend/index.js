require('dotenv').config();

// top of file
const { query } = require('./db');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

const DATA_MODE = process.env.DATA_MODE || 'mock';
const useDb = DATA_MODE === 'db';

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
  if (useRequestDb)
    console.log("Database Connected");
});

// GET /api/appointments
app.get('/api/appointments', async (req, res) => {
  try {
    // Match the login pattern: allow per-request mode
    const requestMode = req.query.mode || DATA_MODE;
    const useRequestDb = requestMode === 'db';

    console.log('GET /api/appointments query:', req.query, 'mode:', requestMode);

    if (useRequestDb) {
      // Expect: /api/appointments?role=student|advisor&userId=<AppUser.UserId>&mode=db
      const role = req.query.role;
      const userIdRaw = req.query.userId;
      const userId = Number(userIdRaw);

      if (!role || !userIdRaw || Number.isNaN(userId)) {
        return res.status(400).json({
          ok: false,
          message: 'role and userId query parameters are required in DB mode.'
        });
      }

      // ---- ADVISOR FLOW ----
      if (role.toLowerCase() === 'advisor') {
        const apptResult = await query(
          `EXEC GetAdvisorUpcomingAppointments @AdvisorUserId = @userId`,
          [{ name: 'userId', value: userId }]
        );

        return res.json({
          ok: true,
          role: 'advisor',
          appointments: apptResult.recordset || []
        });
      }

      // ---- STUDENT FLOW ----
      if (role.toLowerCase() === 'student') {
        const apptResult = await query(
          `
          DECLARE @StudentId INT =
          (
              SELECT StudentId
              FROM Student
              WHERE UserId = @userId
          );

          SELECT
              ap.AppointmentId,
              ap.StartTimeUtc,
              ap.EndTimeUtc,
              ap.StatusCode,
              au.DisplayName AS AdvisorName
          FROM Appointment ap
          JOIN Advisor a ON ap.AdvisorId = a.AdvisorId
          JOIN AppUser au ON a.UserId = au.UserId
          WHERE ap.StudentId = @StudentId
          ORDER BY ap.StartTimeUtc;
          `,
          [{ name: 'userId', value: userId }]
        );

        return res.json({
          ok: true,
          role: 'student',
          appointments: apptResult.recordset
        });
      }

      // ---- Unknown role ----
      return res.status(400).json({
        ok: false,
        message: 'Unsupported role. Expected "student" or "advisor".'
      });
    }

    // ---- MOCK MODE ----
    console.log('GET /api/appointments using MOCK data');
    return res.json({
      ok: true,
      role: 'mock',
      appointments
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    return res.status(500).json({
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
            name: user.DisplayName,
            mode: 'db' | 'mock'
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

// POST /api/appointments - create a new appointment
app.post('/api/appointments', async (req, res) => {
  const {
    studentName,
    advisorName,
    startTime,
    endTime,
    userId,
    role,
    mode,
  } = req.body;

  if (!studentName || !advisorName || !startTime || !endTime) {
    return res.status(400).json({
      ok: false,
      message: 'Missing required fields: studentName, advisorName, startTime, endTime',
    });
  }

  // Use per-request mode if provided; otherwise fall back to env
  const requestMode = mode || DATA_MODE;
  const useRequestDb = requestMode === 'db';

  console.log('POST /api/appointments body:', req.body);
  console.log('POST /api/appointments requestMode:', requestMode, '→ useRequestDb:', useRequestDb);

  try {
    if (useRequestDb) {
      // ===== DB MODE =====

      // Normalize role casing
      const loweredRole = (role || '').toLowerCase();

      // ----- STUDENT-CREATED APPOINTMENT -----
      if (loweredRole === 'student') {
        // Use logged-in userId to resolve StudentId and (optionally) primary advisor
        const studentInfoResult = await query(
          `
          SELECT TOP 1
            s.StudentId,
            su.DisplayName AS StudentName,
            s.PrimaryAdvisorId,
            a.AdvisorId,
            au.DisplayName AS AdvisorName
          FROM Student s
          JOIN AppUser su
            ON s.UserId = su.UserId
          LEFT JOIN Advisor a
            ON s.PrimaryAdvisorId = a.AdvisorId
          LEFT JOIN AppUser au
            ON a.UserId = au.UserId
          WHERE s.UserId = @userId;
          `,
          [{ name: 'userId', value: userId }]
        );

        if (!studentInfoResult.recordset || studentInfoResult.recordset.length === 0) {
          return res.status(400).json({
            ok: false,
            message: `No Student record found linked to UserId=${userId}.`,
          });
        }

        let {
          StudentId,
          StudentName,
          AdvisorId,
          AdvisorName,
        } = studentInfoResult.recordset[0];

        // If no primary advisor set, just pick any advisor for demo
        if (!AdvisorId) {
          const advisorResult = await query(
            `
            SELECT TOP 1
              a.AdvisorId,
              u.DisplayName AS AdvisorName
            FROM Advisor a
            JOIN AppUser u ON a.UserId = u.UserId
            ORDER BY a.AdvisorId;
            `
          );

          if (!advisorResult.recordset || advisorResult.recordset.length === 0) {
            return res.status(400).json({
              ok: false,
              message: 'No advisor found in the system to assign to this appointment.',
            });
          }

          AdvisorId = advisorResult.recordset[0].AdvisorId;
          AdvisorName = advisorResult.recordset[0].AdvisorName;
        }

        const insertResult = await query(
          `
          INSERT INTO Appointment (
            StudentId,
            AdvisorId,
            StartTimeUtc,
            EndTimeUtc,
            StatusCode,
            Notes
          )
          OUTPUT
            INSERTED.AppointmentId,
            INSERTED.StartTimeUtc,
            INSERTED.EndTimeUtc,
            INSERTED.StatusCode
          VALUES (
            @studentId,
            @advisorId,
            @startTimeUtc,
            @endTimeUtc,
            'SCHEDULED',
            @notes
          );
          `,
          [
            { name: 'studentId', value: StudentId },
            { name: 'advisorId', value: AdvisorId },
            { name: 'startTimeUtc', value: new Date(startTime).toISOString() },
            { name: 'endTimeUtc', value: new Date(endTime).toISOString() },
            { name: 'notes', value: 'Created from Smart Advising demo (student)' },
          ]
        );

        const dbRow =
          insertResult.recordset && insertResult.recordset[0]
            ? insertResult.recordset[0]
            : null;

        if (!dbRow) {
          return res.status(500).json({
            ok: false,
            message: 'Appointment insert did not return a row.',
          });
        }

        const responseAppointment = {
          AppointmentId: dbRow.AppointmentId,
          StartTimeUtc: dbRow.StartTimeUtc,
          EndTimeUtc: dbRow.EndTimeUtc,
          StatusCode: dbRow.StatusCode,
          StudentName,
          AdvisorName,
        };

        console.log('DB appointment created for student user:', responseAppointment);

        return res.status(201).json({
          ok: true,
          appointment: responseAppointment,
        });
      }

      // ----- ADVISOR-CREATED APPOINTMENT -----
      if (loweredRole === 'advisor') {
        // 1) Resolve AdvisorId from logged-in userId
        const advisorResult = await query(
          `
          SELECT TOP 1
            a.AdvisorId,
            u.DisplayName AS AdvisorName
          FROM Advisor a
          JOIN AppUser u ON a.UserId = u.UserId
          WHERE a.UserId = @userId;
          `,
          [{ name: 'userId', value: userId }]
        );

        if (!advisorResult.recordset || advisorResult.recordset.length === 0) {
          return res.status(400).json({
            ok: false,
            message: `No Advisor record found linked to UserId=${userId}.`,
          });
        }

        const AdvisorId = advisorResult.recordset[0].AdvisorId;
        const AdvisorName = advisorResult.recordset[0].AdvisorName;

        // 2) Resolve StudentId by the typed studentName (DisplayName)
        const studentResult = await query(
          `
          SELECT TOP 1
            s.StudentId,
            u.DisplayName AS StudentName
          FROM Student s
          JOIN AppUser u ON s.UserId = u.UserId
          WHERE u.DisplayName = @studentName;
          `,
          [{ name: 'studentName', value: studentName }]
        );

        if (!studentResult.recordset || studentResult.recordset.length === 0) {
          return res.status(400).json({
            ok: false,
            message: `No Student found with name '${studentName}'.`,
          });
        }

        const StudentId = studentResult.recordset[0].StudentId;
        const StudentName = studentResult.recordset[0].StudentName;

        // 3) Insert appointment
        const insertResult = await query(
          `
          INSERT INTO Appointment (
            StudentId,
            AdvisorId,
            StartTimeUtc,
            EndTimeUtc,
            StatusCode,
            Notes
          )
          OUTPUT
            INSERTED.AppointmentId,
            INSERTED.StartTimeUtc,
            INSERTED.EndTimeUtc,
            INSERTED.StatusCode
          VALUES (
            @studentId,
            @advisorId,
            @startTimeUtc,
            @endTimeUtc,
            'SCHEDULED',
            @notes
          );
          `,
          [
            { name: 'studentId', value: StudentId },
            { name: 'advisorId', value: AdvisorId },
            { name: 'startTimeUtc', value: new Date(startTime).toISOString() },
            { name: 'endTimeUtc', value: new Date(endTime).toISOString() },
            { name: 'notes', value: 'Created from Smart Advising demo (advisor)' },
          ]
        );

        const dbRow =
          insertResult.recordset && insertResult.recordset[0]
            ? insertResult.recordset[0]
            : null;

        if (!dbRow) {
          return res.status(500).json({
            ok: false,
            message: 'Appointment insert did not return a row.',
          });
        }

        const responseAppointment = {
          AppointmentId: dbRow.AppointmentId,
          StartTimeUtc: dbRow.StartTimeUtc,
          EndTimeUtc: dbRow.EndTimeUtc,
          StatusCode: dbRow.StatusCode,
          StudentName,
          AdvisorName,
        };

        console.log('DB appointment created for advisor user:', responseAppointment);

        return res.status(201).json({
          ok: true,
          appointment: responseAppointment,
        });
      }

      // For any other roles:
      return res.status(400).json({
        ok: false,
        message: 'DB appointment creation is only implemented for student and advisor roles.',
      });
    }

    // ===== MOCK MODE =====
    console.log('POST /api/appointments using MOCK path');

    const newAppointment = {
      id: nextId++,
      studentName,
      advisorName,
      startTime,
      endTime,
      status: 'SCHEDULED',
    };

    appointments.push(newAppointment);

    return res.status(201).json({
      ok: true,
      appointment: newAppointment,
    });
  } catch (err) {
    console.error('Create appointment error:', err);
    return res.status(500).json({
      ok: false,
      message: 'Could not create appointment.',
    });
  }
});

// PATCH /api/appointments/:id/status - update status (e.g., CONFIRMED, CANCELED)
app.patch('/api/appointments/:id/status', async (req, res) => {
  const id = Number(req.params.id);
  const { status, mode } = req.body;

  const validStatuses = ['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'NOSHOW', 'CANCELED'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      ok: false,
      message: 'Invalid status'
    });
  }

  const requestMode = mode || DATA_MODE;
  const useRequestDb = requestMode === 'db';

  try {
    if (useRequestDb) {
      // ===== DB MODE =====
      // Update the appointment status
      await query(
        `
        UPDATE Appointment
        SET StatusCode = @status
        WHERE AppointmentId = @id;
        `,
        [
          { name: 'status', value: status },
          { name: 'id', value: id },
        ]
      );

      // Return the updated row with the same shape as GET
      const result = await query(
        `
        SELECT
          ap.AppointmentId,
          ap.StartTimeUtc,
          ap.EndTimeUtc,
          ap.StatusCode,
          au.DisplayName AS AdvisorName,
          su.DisplayName AS StudentName
        FROM Appointment ap
        JOIN Advisor a   ON ap.AdvisorId = a.AdvisorId
        JOIN AppUser au  ON a.UserId = au.UserId
        JOIN Student s   ON ap.StudentId = s.StudentId
        JOIN AppUser su  ON s.UserId = su.UserId
        WHERE ap.AppointmentId = @id;
        `,
        [{ name: 'id', value: id }]
      );

      if (!result.recordset || result.recordset.length === 0) {
        return res.status(404).json({
          ok: false,
          message: 'Appointment not found after update'
        });
      }

      return res.json({
        ok: true,
        appointment: result.recordset[0],
      });
    } else {
      // ===== MOCK MODE =====
      const appt = appointments.find(a => a.id === id);
      if (!appt) {
        return res.status(404).json({
          ok: false,
          message: 'Appointment not found'
        });
      }
      appt.status = status;

      return res.json({
        ok: true,
        appointment: appt,
      });
    }
  } catch (err) {
    console.error('Update status error:', err);
    return res.status(500).json({
      ok: false,
      message: 'Could not update status'
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Smart Advising API listening on http://localhost:${PORT}`);
});
