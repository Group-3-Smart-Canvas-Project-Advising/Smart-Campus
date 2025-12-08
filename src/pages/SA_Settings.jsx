import React from 'react';
import './SA_Settings.css';

import Hamburger_Menu from "../components/Hamburger_Menu.jsx";
import Avatar from "../components/Avatar.jsx";
import { useUser } from "../context/UserContext.jsx";

const SA_Settings = () => {
  const { user } = useUser();
  const role = user?.role || "student";
  const displayName = user?.name || user?.username || "User";

  return (
    <div className="background_image settings-page">
      <div className="settings-inner">
        <header className="dashboard-header">
          <div>
            <h1>Settings</h1>
            <p>Customize your advising experience, {displayName}.</p>
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

        <main className="settings-main">
          {/* Theme card */}
          <section className="settings-card">
            <h3>Theme</h3>
            <p className="settings-card-subtitle">
              Choose how the advising app looks.
            </p>

            <div className="settings-option-row">
              <label className="settings-option">
                <input type="radio" name="theme" defaultChecked />
                <span>System default (recommended)</span>
              </label>
              <label className="settings-option">
                <input type="radio" name="theme" disabled />
                <span>Light (coming soon)</span>
              </label>
              <label className="settings-option">
                <input type="radio" name="theme" disabled />
                <span>Dark (coming soon)</span>
              </label>
            </div>
          </section>

          {/* Notifications card */}
          <section className="settings-card">
            <h3>Notifications</h3>
            <p className="settings-card-subtitle">
              Placeholder toggles for reminder settings.
            </p>

            <div className="settings-option-column">
              <label className="settings-option">
                <input type="checkbox" defaultChecked disabled />
                <span>Email reminders before appointments (future)</span>
              </label>
              <label className="settings-option">
                <input type="checkbox" disabled />
                <span>Notify me when an appointment is updated (future)</span>
              </label>
              <label className="settings-option">
                <input type="checkbox" disabled />
                <span>Advisor announcements &amp; updates (future)</span>
              </label>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default SA_Settings;