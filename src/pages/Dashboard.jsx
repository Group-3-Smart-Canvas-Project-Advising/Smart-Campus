import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Hamburger_Menu from "../components/Hamburger_Menu.jsx";

export default function Dashboard({ user}) {
  const navigate = useNavigate();
  const name = user?.name || user?.username || "User";
  const role = user?.role || "student";

  // ---- appointment list state ----
  const [appointments, setAppointments] = useState([]);
  const [loadingAppts, setLoadingAppts] = useState(true);
  const [apptsError, setApptsError] = useState("");

  // ---- create appointment form state ----
  const [studentName, setStudentName] = useState(
    role === "student" ? name : ""
  );
  const [advisorName, setAdvisorName] = useState(
    role === "advisor" ? name : ""
  );
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);


  // Optional: if user is totally missing (e.g. refresh on /dashboard), kick back to login
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  // ---- fetch appointments on mount ----
  useEffect(() => {
    async function loadAppointments() {
      try {
        setLoadingAppts(true);
        setApptsError("");

        const res = await fetch("http://localhost:3000/api/appointments");
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

        const data = await res.json();
        setAppointments(data);
      } catch (err) {
        console.error(err);
        setApptsError("Could not load appointments. Is the backend running?");
      } finally {
        setLoadingAppts(false);
      }
    }

    loadAppointments();
  }, []);

  // ---- filter appointments based on role ----
  const visibleAppointments = appointments.filter((appt) => {
    if (role === "student") {
      return appt.studentName === name;
    } else if (role === "advisor") {
      return appt.advisorName === name;
    }
    return true;
  });

  // ---- create new appointment ----
  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    setCreateError("");

    if (!studentName || !advisorName || !startTime || !endTime) {
      setCreateError("Please fill in all fields.");
      return;
    }

    try {
      setCreating(true);

      const res = await fetch("http://localhost:3000/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName,
          advisorName,
          startTime,
          endTime,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();
      if (data.ok && data.appointment) {
        setAppointments((prev) => [...prev, data.appointment]);
        setStartTime("");
        setEndTime("");
        // keep names for convenience
      } else {
        setCreateError("Unexpected response from server.");
      }
    } catch (err) {
      console.error(err);
      setCreateError("Could not create appointment.");
    } finally {
      setCreating(false);
    }
  };

  // ---- scroll helper for quick links (optional little “flex”) ----
  const scrollToAppointments = () => {
    document
      .querySelector(".appointments-card")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="dashboard">
      {/* Sticky top shell: header + quick links */}
      <div className="dashboard-shell">
        <header className="dashboard-header">
          <div>
            <h1>Advising Dashboard</h1>
            <p>
              Welcome back, {name} {role === "advisor" ? "🧑‍🏫" : "🎓"}

            </p>
          </div>

          <div className="dashboard-header-right">
            <div className="dashboard-badges">
              <span className="badge badge-primary">
                {role === "advisor" ? "Advisor" : "Student"}
              </span>
              <span className="badge badge-muted">Demo mode</span>
            </div>
            <Hamburger_Menu/>
          </div>
        </header>

        <nav className="dashboard-nav">
          <span className="nav-label">Quick links</span>
          <div className="nav-quick-links">
            <button className="nav-pill" onClick={scrollToAppointments}>
              📅 Upcoming appointments
            </button>
            <button
              className="nav-pill"
              onClick={() => setShowCreateForm(true)}
            >
              ➕ New appointment
            </button>
            {role === "student" ? (
              <>
                <button className="nav-pill" disabled>
                  📊 Degree progress (future)
                </button>
                <button className="nav-pill" disabled>
                  ⚠️ Registration holds (future)
                </button>
              </>
            ) : (
              <>
                <button className="nav-pill" disabled>
                  📋 Advisee list (future)
                </button>
                <button className="nav-pill" disabled>
                  📈 Advising stats (future)
                </button>
              </>
            )}
          </div>
        </nav>
      </div>

      {/* Scrollable content */}
      <main className="dashboard-main">
        {/* Combined appointments card: table + create button + inline form */}
        <section className="card appointments-card">
          <div className="card-header-row">
            <div>
              <h2>Upcoming appointments</h2>
              <p className="card-subtitle">
                This is sample data filtered by your role.
              </p>
            </div>
            <button
              className="primary-button"
              type="button"
              onClick={() => setShowCreateForm((prev) => !prev)}
            >
              {showCreateForm ? "Close form" : "New appointment"}
            </button>
          </div>

          {loadingAppts && <p>Loading appointments…</p>}
          {apptsError && (
            <p style={{ color: "#fecaca", fontSize: "0.85rem" }}>
              {apptsError}
            </p>
          )}

          {!loadingAppts &&
            !apptsError &&
            visibleAppointments.length === 0 && (
              <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
                No upcoming appointments yet.
              </p>
            )}

          {!loadingAppts &&
            !apptsError &&
            visibleAppointments.length > 0 && (
              <table className="appt-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Advisor</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleAppointments.map((appt) => (
                    <tr key={appt.id}>
                      <td>{appt.studentName}</td>
                      <td>{appt.advisorName}</td>
                      <td>
                        {appt.startTime
                          ? new Date(appt.startTime).toLocaleString()
                          : "—"}
                      </td>
                      <td>
                        {appt.endTime
                          ? new Date(appt.endTime).toLocaleString()
                          : "—"}
                      </td>
                      <td>{appt.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

          {showCreateForm && (
            <form
              onSubmit={handleCreateAppointment}
              className="appt-form"
              style={{ marginTop: "1rem" }}
            >
              <h3 className="form-title">New appointment</h3>

              <div className="form-row">
                <label className="form-label">
                  Student name
                  <input
                    className="form-input"
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                  />
                </label>
              </div>

              <div className="form-row">
                <label className="form-label">
                  Advisor name
                  <input
                    className="form-input"
                    type="text"
                    value={advisorName}
                    onChange={(e) => setAdvisorName(e.target.value)}
                  />
                </label>
              </div>

              <div className="form-row form-row-inline">
                <label className="form-label">
                  Start time
                  <input
                    className="form-input"
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </label>

                <label className="form-label">
                  End time
                  <input
                    className="form-input"
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </label>
              </div>

              {createError && (
                <p className="form-error">{createError}</p>
              )}

              <button
                type="submit"
                className="primary-button"
                disabled={creating}
                style={{ marginTop: "0.75rem" }}
              >
                {creating ? "Saving…" : "Save appointment"}
              </button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
