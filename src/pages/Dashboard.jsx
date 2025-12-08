import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext.jsx";
import { create as createAppt, updateStatus } from "../api/appointments.js";
import Avatar from "../components/Avatar.jsx";
import Hamburger_Menu from "../components/Hamburger_Menu.jsx";

export default function Dashboard({ user}) {
  const navigate = useNavigate();
  const name = user?.name || user?.username || "User";
  const role = user?.role || "student";

  // ---- appointment list state ----
  const { user: ctxUser, appointments, setAppointments, isDataLoading } = useUser();
  const effectiveUser = user ?? ctxUser; // prefer prop, fallback to context
  const [loadingAppts, setLoadingAppts] = useState(false);
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

  // No local fetching here; App.jsx loads appointments after login into UserContext

  // Filtered appointments to show in table
  const visibleAppointments = appointments;

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
      const saved = await createAppt({ studentName, advisorName, startTime, endTime }, effectiveUser);
      if (!saved) throw new Error("No appointment returned");
      setAppointments((prev) => [...prev, saved]);
      setStartTime("");
      setEndTime("");
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
  <div className="background_image dashboard-page">
    <div
      className="dashboard-inner"
      aria-busy={isDataLoading ? "true" : undefined}
    >
      {/* Sticky top shell: HEADER ONLY */}
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
            <Avatar size={40} sticky />
            <Hamburger_Menu />
          </div>
        </header>
      </div>

      {/* Nav now sits directly under the sticky header, not inside it */}
      <nav className="dashboard-nav">
        <span className="nav-label">Quick links</span>
        <div className="nav-quick-links">
          <button
            className="nav-pill"
            onClick={scrollToAppointments}
            disabled={isDataLoading}
          >
            📅 Upcoming appointments
          </button>
          <button
            className="nav-pill"
            onClick={() => setShowCreateForm(true)}
            disabled={isDataLoading}
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

      {/* Scrollable content */}
      <main className="dashboard-main">
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
              disabled={isDataLoading}
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
                      <td>
                        {role === "advisor" ? (
                          <select
                            value={appt.status}
                            onChange={async (e) => {
                              const newStatus = e.target.value;
                              try {
                                const updated = await updateStatus(appt.id, newStatus, effectiveUser);
                                setAppointments((prev) =>
                                  prev.map((a) => (a.id === updated.id ? updated : a))
                                );
                              } catch (err) {
                                console.error("Failed to update status:", err);
                                // optional: toast or error message
                              }
                            }}
                            disabled={isDataLoading}
                          >
                            <option value="SCHEDULED">Scheduled</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="NOSHOW">No-show</option>
                            <option value="CANCELED">Canceled</option>
                          </select>
                        ) : (
                          appt.status
                        )}
                      </td>
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
                    disabled={isDataLoading || creating}
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
                    disabled={isDataLoading || creating}
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
                    disabled={isDataLoading || creating}
                  />
                </label>

                <label className="form-label">
                  End time
                  <input
                    className="form-input"
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    disabled={isDataLoading || creating}
                  />
                </label>
              </div>

              {createError && (
                <p className="form-error">{createError}</p>
              )}

              <button
                type="submit"
                className="primary-button"
                disabled={creating || isDataLoading}
                style={{ marginTop: "0.75rem" }}
              >
                {creating ? "Saving…" : isDataLoading ? "Loading…" : "Save appointment"}
              </button>
            </form>
          )}
        </section>
      </main>
    </div>
    </div>
  );
}
