import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useUser } from "../context/UserContext.jsx";
import { create as createAppt, updateStatus } from "../api/appointments.js";
import Hamburger_Menu from "../components/Hamburger_Menu.jsx";
import Avatar from "../components/Avatar.jsx";
import "../styles/osu-theme.css";
import "../styles/osu-theme-dark.css";

export default function Dashboard({ user }) {
  const navigate = useNavigate();

  const { user: ctxUser, appointments, setAppointments, isDataLoading } = useUser();
  const effectiveUser = user ?? ctxUser;
  const name = effectiveUser?.name || effectiveUser?.username || "User";
  const role = effectiveUser?.role || "student";

  const [loadingAppts, setLoadingAppts] = useState(false);
  const [apptsError, setApptsError] = useState("");

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

  useEffect(() => {
    if (!effectiveUser) {
      navigate("/");
    }
  }, [effectiveUser, navigate]);

  const visibleAppointments = useMemo(
      () => appointments || [],
      [appointments]
  );

  const nextAppointment = useMemo(() => {
    if (!visibleAppointments.length) return null;
    const upcoming = [...visibleAppointments]
        .filter(a => a.startTime)
        .map(a => ({ ...a, start: new Date(a.startTime) }))
        .filter(a => !isNaN(a.start.getTime()))
        .sort((a, b) => a.start - b.start);
    return upcoming[0] || null;
  }, [visibleAppointments]);

  const stats = useMemo(() => {
    const base = { total: 0, confirmed: 0, completed: 0, noshow: 0 };
    if (!visibleAppointments.length) return base;
    const s = { ...base };
    for (const appt of visibleAppointments) {
      s.total += 1;
      switch (appt.status) {
        case "CONFIRMED":
          s.confirmed += 1;
          break;
        case "COMPLETED":
          s.completed += 1;
          break;
        case "NOSHOW":
          s.noshow += 1;
          break;
        default:
          break;
      }
    }
    return s;
  }, [visibleAppointments]);

  const handleCreateAppointment = async (e) => {
    e.preventDefault();
    setCreateError("");

    if (!studentName || !advisorName || !startTime || !endTime) {
      setCreateError("Please fill in all fields.");
      return;
    }

    try {
      setCreating(true);
      const payload = {
        studentName,
        advisorName,
        startTime,
        endTime
      };
      const saved = await createAppt(payload, effectiveUser);
      if (!saved) throw new Error("No appointment returned");
      setAppointments(prev => [...prev, saved]);
      setStartTime("");
      setEndTime("");
    } catch (err) {
      console.error(err);
      setCreateError("Could not create appointment.");
    } finally {
      setCreating(false);
    }
  };

  const scrollToAppointments = () => {
    document
        .querySelector(".osu-card--appointments")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
      <div className="osu-app-shell" aria-busy={isDataLoading ? "true" : undefined}>
        <header className="osu-topbar">
          <div className="osu-topbar-left">
            <div className="osu-logo-mark" aria-hidden="true">
              OSU
            </div>
            <div>
              <h1 className="osu-topbar-title">Advising Dashboard</h1>
              <p className="osu-topbar-subtitle">
                Welcome back, {name} {role === "advisor" ? "🧑‍🏫" : "🎓"}
              </p>
            </div>
          </div>

          <div className="osu-topbar-right">
            <div className="dashboard-badges">
            <span className="badge badge-primary">
              {role === "advisor" ? "Advisor" : "Student"}
            </span>
              <span className="badge badge-muted">Demo mode</span>
            </div>
            <Avatar size={40} />
            <Hamburger_Menu />
          </div>
        </header>

        <nav className="osu-quick-nav">
          <span className="osu-quick-label">Quick links</span>
          <div className="osu-quick-links">
            <button
                className="osu-pill-button"
                onClick={scrollToAppointments}
                disabled={isDataLoading}
            >
              📅 Upcoming appointments
            </button>
            <button
                className="osu-pill-button"
                onClick={() => setShowCreateForm(true)}
                disabled={isDataLoading}
            >
              ➕ New appointment
            </button>

            {role === "student" ? (
                <>
                  <button className="osu-pill-button osu-pill-disabled" disabled>
                    📊 Degree progress
                  </button>
                  <button className="osu-pill-button osu-pill-disabled" disabled>
                    ⚠️ Registration holds
                  </button>
                </>
            ) : (
                <>
                  <button className="osu-pill-button osu-pill-disabled" disabled>
                    📋 Advisee list
                  </button>
                  <button className="osu-pill-button osu-pill-disabled" disabled>
                    📈 Advising stats
                  </button>
                </>
            )}
          </div>
        </nav>

        <main className="osu-main">
          <div className="osu-layout-grid">
            <section className="osu-card osu-card--highlight">
              <h2 className="osu-card-title">At a glance</h2>
              <p className="osu-card-subtitle">
                Summary of your upcoming advising activity.
              </p>

              <div className="osu-stat-row">
                <div className="osu-stat">
                  <span className="osu-stat-label">Total upcoming</span>
                  <span className="osu-stat-value">{stats.total}</span>
                </div>
                <div className="osu-stat">
                  <span className="osu-stat-label">Confirmed</span>
                  <span className="osu-stat-value">{stats.confirmed}</span>
                </div>
                <div className="osu-stat">
                  <span className="osu-stat-label">Completed</span>
                  <span className="osu-stat-value">{stats.completed}</span>
                </div>
                <div className="osu-stat">
                  <span className="osu-stat-label">No show</span>
                  <span className="osu-stat-value">{stats.noshow}</span>
                </div>
              </div>

              {nextAppointment && (
                  <div className="osu-next-appt">
                    <h3 className="osu-next-title">Next appointment</h3>
                    <p className="osu-next-body">
                      {nextAppointment.studentName} with{" "}
                      {nextAppointment.advisorName}
                      <br />
                      <span className="osu-next-time">
                    {new Date(nextAppointment.startTime).toLocaleString()}
                  </span>
                    </p>
                  </div>
              )}
            </section>

            <section className="osu-card osu-card--appointments">
              <div className="osu-card-header-row">
                <div>
                  <h2 className="osu-card-title">Upcoming appointments</h2>
                  <p className="osu-card-subtitle">
                    This table reflects sample data filtered by your role.
                  </p>
                </div>
                <button
                    className="osu-primary-button"
                    type="button"
                    onClick={() => setShowCreateForm(prev => !prev)}
                    disabled={isDataLoading}
                >
                  {showCreateForm ? "Close form" : "New appointment"}
                </button>
              </div>

              {loadingAppts && <p>Loading appointments…</p>}

              {apptsError && (
                  <p className="osu-inline-error">
                    {apptsError}
                  </p>
              )}

              {!loadingAppts &&
                  !apptsError &&
                  visibleAppointments.length === 0 && (
                      <p className="osu-muted">
                        No upcoming appointments yet.
                      </p>
                  )}

              {!loadingAppts &&
                  !apptsError &&
                  visibleAppointments.length > 0 && (
                      <div className="osu-table-wrapper">
                        <table className="osu-table">
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
                                      : ""}
                                </td>
                                <td>
                                  {appt.endTime
                                      ? new Date(appt.endTime).toLocaleString()
                                      : ""}
                                </td>
                                <td>
                                  {role === "advisor" ? (
                                      <select
                                          value={appt.status}
                                          onChange={async (e) => {
                                            const newStatus = e.target.value;
                                            try {
                                              const updated = await updateStatus(
                                                  appt.id,
                                                  newStatus,
                                                  effectiveUser
                                              );
                                              setAppointments(prev =>
                                                  prev.map(a =>
                                                      a.id === updated.id ? updated : a
                                                  )
                                              );
                                            } catch (err) {
                                              console.error("Failed to update status:", err);
                                            }
                                          }}
                                          disabled={isDataLoading}
                                      >
                                        <option value="SCHEDULED">Scheduled</option>
                                        <option value="CONFIRMED">Confirmed</option>
                                        <option value="COMPLETED">Completed</option>
                                        <option value="NOSHOW">No show</option>
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
                      </div>
                  )}

              {showCreateForm && (
                  <form
                      onSubmit={handleCreateAppointment}
                      className="osu-form"
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
                        className="osu-primary-button"
                        disabled={creating || isDataLoading}
                    >
                      {creating
                          ? "Saving…"
                          : isDataLoading
                              ? "Loading…"
                              : "Save appointment"}
                    </button>
                  </form>
              )}
            </section>
          </div>
        </main>
      </div>
  );
}
