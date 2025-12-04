import React, { useEffect, useMemo, useRef, useState } from 'react'

import Hamburger_Menu from "../components/Hamburger_Menu.jsx";
import Avatar from "../components/Avatar.jsx";
import './SA_Calendar.css';
import { useUser } from "../context/UserContext.jsx";
import { create as createAppt } from "../api/appointments.js";

const pad2 = (n) => (n < 10 ? `0${n}` : `${n}`);
const toKey = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const toDisplay = (d) => `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;

// Format a Date to value acceptable by <input type="datetime-local">
const toDatetimeLocal = (d) => {
  const yyyy = d.getFullYear();
  const MM = pad2(d.getMonth() + 1);
  const dd = pad2(d.getDate());
  const hh = pad2(d.getHours());
  const mm = pad2(d.getMinutes());
  return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
};

function daysInRange(start, end) {
  const days = [];
  const d = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  while (d <= end) {
    days.push(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setDate(d.getDate() + 1);
  }
  return days;
}

const buildMonthMatrix = (year, monthIdx) => {
  // monthIdx is 0-based
  const firstOfMonth = new Date(year, monthIdx, 1);
  const startDay = (firstOfMonth.getDay() + 6) % 7; // make Monday=0
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();

  const cells = [];
  // leading blanks
  for (let i = 0; i < startDay; i++) cells.push(null);
  // actual days
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, monthIdx, d));
  // trailing to complete 6 weeks grid (42 cells)
  while (cells.length % 7 !== 0) cells.push(null);
  while (cells.length < 42) cells.push(null);
  return cells;
};

const SA_Calendar = () => {
  const { user, appointments, setAppointments, isDataLoading } = useUser();
  const role = user?.role || 'student';
  const displayName = user?.name || user?.username || 'User';
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(null);
  // Other party name: if student, they choose advisor; if advisor, they choose student
  const [otherName, setOtherName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");

  const monthLabel = useMemo(() => currentMonth.toLocaleString(undefined, { month: 'long', year: 'numeric' }), [currentMonth]);
  const monthCells = useMemo(() => buildMonthMatrix(currentMonth.getFullYear(), currentMonth.getMonth()), [currentMonth]);

  // Compute target labels for prev/next month buttons
  const prevMonthDate = useMemo(
    () => new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    [currentMonth]
  );
  const nextMonthDate = useMemo(
    () => new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    [currentMonth]
  );
  const prevMonthLabel = useMemo(
    () => prevMonthDate.toLocaleString(undefined, { month: 'long', year: 'numeric' }),
    [prevMonthDate]
  );
  const nextMonthLabel = useMemo(
    () => nextMonthDate.toLocaleString(undefined, { month: 'long', year: 'numeric' }),
    [nextMonthDate]
  );

  const openCreateForDay = (date) => {
    if (!date) return;
    setSelectedDate(date);
    // Prefill a 1-hour slot on the chosen day (09:00–10:00)
    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 9, 0, 0, 0);
    const end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 10, 0, 0, 0);
    setStartTime(toDatetimeLocal(start));
    setEndTime(toDatetimeLocal(end));
    setOtherName("");
    setError("");
  };

  const addEvent = async (e) => {
    e.preventDefault();
    setError("");
    // Match Dashboard's requirement style: require both start and end times
    if (!startTime || !endTime) {
      setError("Please fill in start and end time.");
      return;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setError("Please enter valid start and end times.");
      return;
    }
    // Determine required names depending on role
    let studentName, advisorName;
    if (role === 'advisor') {
      advisorName = displayName;
      studentName = otherName?.trim();
    } else {
      studentName = user?.username || displayName;
      advisorName = otherName?.trim();
    }
    if (!studentName || !advisorName) {
      setError(`Please enter the ${role === 'advisor' ? 'student' : 'advisor'} name.`);
      return;
    }

    try {
      const saved = await createAppt({ studentName, advisorName, startTime: start.toISOString(), endTime: end.toISOString() });
      setAppointments(prev => [...prev, saved]);
    } catch (err) {
      console.error('Failed to create appointment from calendar:', err);
      setError('Failed to create appointment.');
      return;
    }
    // Reset form
    setOtherName("");
    setStartTime("");
    setEndTime("");
    setSelectedDate(null);
  };

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  // Make sure content is scrollable inside the background container (which has overflow:hidden)
  // and bring the form into view when it appears.
  const scrollAreaRef = useRef(null);
  const formRef = useRef(null);
  useEffect(() => {
    if (selectedDate && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedDate]);

  return (
    <div className={'background_image calendar-page'}>
      <div className="calendar-inner" aria-busy={isDataLoading ? 'true' : undefined}>
        <div className="cal-header">
          <Avatar size={40} sticky />
          <Hamburger_Menu />
        </div>

        <h2 className="cal-title">Calendar</h2>

        <div className="cal-nav">
          <button
            onClick={prevMonth}
            className="cal-nav-btn"
            aria-label={`Go to ${prevMonthLabel}`}
            title={`Go to ${prevMonthLabel}`}
            disabled={isDataLoading}
          >
            {`${prevMonthLabel}`}
          </button>
          <div className="cal-month-label">{monthLabel}</div>
          <button
            onClick={nextMonth}
            className="cal-nav-btn"
            aria-label={`Go to ${nextMonthLabel}`}
            title={`Go to ${nextMonthLabel}`}
            disabled={isDataLoading}
          >
            {`${nextMonthLabel}`}
          </button>
        </div>

        <div ref={scrollAreaRef} className="cal-scroll">
          <div className="cal-grid">
            {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => (
              <div key={d} className="cal-cell cal-head">{d}</div>
            ))}
            {monthCells.map((date, idx) => {
              const key = date ? toKey(date) : `blank-${idx}`;
              // Build events view from global appointments for this day
              const events = date ? (appointments || []).filter(appt => {
                if (!appt?.startTime || !appt?.endTime) return false;
                const apStart = new Date(appt.startTime);
                const apEnd = new Date(appt.endTime);
                if (isNaN(apStart) || isNaN(apEnd)) return false;
                // Day bounds
                const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
                const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
                return apStart <= dayEnd && apEnd >= dayStart;
              }) : [];
              const isToday = date && toKey(date) === toKey(today);
              return (
                <div
                  key={key}
                  className={`cal-cell${date ? ' is-clickable' : ''}${isToday ? ' is-today' : ''}`}
                  onClick={() => { if (!isDataLoading && date) openCreateForDay(date); }}
                  aria-disabled={isDataLoading ? 'true' : undefined}
                >
                  <div className="cal-cell-header">
                    <span className="cal-day-number">{date ? date.getDate() : ''}</span>
                    {events.length > 0 && (
                      <span className="cal-badge">{events.length}</span>
                    )}
                  </div>
                  <div className="cal-events">
                    {events.slice(0, 3).map((ev, i) => {
                      const other = role === 'advisor' ? ev.studentName : ev.advisorName;
                      const title = `${other} (${new Date(ev.startTime).toLocaleString()} - ${new Date(ev.endTime).toLocaleString()})`;
                      const label = other?.length > 16 ? other.slice(0,16)+"…" : other;
                      return (
                      <div
                        key={i}
                        className="cal-event"
                        title={title}
                      >
                        {label || 'Appointment'}
                      </div>
                      );
                    })}
                    {events.length > 3 && (
                      <div className="cal-more">+{events.length - 3} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {selectedDate && (
            <form ref={formRef} onSubmit={addEvent} className="appt-form cal-form">
              <h3 className="form-title">Create event for: {toDisplay(selectedDate)}</h3>

              <div className="form-row">
                <label className="form-label">
                  {role === 'advisor' ? 'Student name' : 'Advisor name'}
                  <input
                    className="form-input"
                    type="text"
                    placeholder={role === 'advisor' ? 'Student full name' : 'Advisor full name'}
                    value={otherName}
                    onChange={(e) => setOtherName(e.target.value)}
                    disabled={isDataLoading}
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
                    disabled={isDataLoading}
                  />
                </label>

                <label className="form-label">
                  End time
                  <input
                    className="form-input"
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    disabled={isDataLoading}
                  />
                </label>
              </div>

              {error && <p className="form-error">{error}</p>}

              <div className="cal-actions">
                <button type="submit" className="primary-button" disabled={isDataLoading}>
                  Add Event
                </button>
                <button type="button" className="ghost-button" onClick={() => setSelectedDate(null)} disabled={isDataLoading}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SA_Calendar;