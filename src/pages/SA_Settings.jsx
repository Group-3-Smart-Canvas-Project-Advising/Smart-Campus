import React from "react";
import Hamburger_Menu from "../components/Hamburger_Menu.jsx";
import Avatar from "../components/Avatar.jsx";
import { useUser } from "../context/UserContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import "../styles/osu-theme.css";
import "../styles/osu-theme-dark.css";
import "./SA_Settings.css";

const SA_Settings = () => {
    const { user } = useUser();
    const { theme, toggleTheme } = useTheme();
    const role = user?.role || "student";
    const mode = user?.mode || "mock";

    return (
        <div className="osu-app-shell">
            <header className="osu-topbar">
                <div className="osu-topbar-left">
                    <div className="osu-logo-mark" aria-hidden="true">
                        OSU
                    </div>
                    <div>
                        <h1 className="osu-topbar-title">Settings</h1>
                        <p className="osu-topbar-subtitle">
                            Manage your Smart Campus preferences
                        </p>
                    </div>
                </div>

                <div className="osu-topbar-right">
                    <div className="dashboard-badges">
            <span className="badge badge-primary">
              {role === "advisor" ? "Advisor" : "Student"}
            </span>
                        <span className="badge badge-muted">
              {mode === "db" ? "Server mode" : "Demo mode"}
            </span>
                    </div>
                    <Avatar size={40} />
                    <Hamburger_Menu />
                </div>
            </header>

            <main className="osu-main">
                <section className="osu-card osu-settings-card">
                    <h2 className="osu-card-title">Display & preferences</h2>
                    <p className="osu-card-subtitle">
                        Customize your Smart Campus experience.
                    </p>

                    <div className="settings-section">
                        <h3 className="settings-section-title">Appearance</h3>
                        
                        <div className="settings-item">
                            <div className="settings-item-label">
                                <span className="settings-label-text">Theme</span>
                                <span className="settings-label-description">
                                    Choose between light and dark mode
                                </span>
                            </div>
                            <div className="settings-item-control">
                                <div className="theme-toggle-wrapper">
                                    <label
                                        className="theme-toggle-label"
                                        style={{
                                            color: theme === 'dark' ? "var(--osu-muted)" : "var(--osu-text-main)",
                                        }}
                                    >
                                        Light
                                    </label>
                                    <div
                                        onClick={toggleTheme}
                                        className="theme-toggle-switch"
                                        style={{
                                            backgroundColor: theme === 'dark'
                                                ? "var(--accent-blue)"
                                                : "rgba(148, 163, 184, 0.5)",
                                            border: "1px solid var(--osu-border-soft)",
                                        }}
                                    >
                                        <div
                                            className="theme-toggle-slider"
                                            style={{
                                                left: theme === 'dark' ? "26px" : "2px",
                                            }}
                                        />
                                    </div>
                                    <label
                                        className="theme-toggle-label"
                                        style={{
                                            color: theme === 'dark' ? "var(--osu-text-main)" : "var(--osu-muted)",
                                        }}
                                    >
                                        Dark
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="settings-section">
                        <h3 className="settings-section-title">Account</h3>
                        
                        <div className="settings-item">
                            <div className="settings-item-label">
                                <span className="settings-label-text">Login mode</span>
                                <span className="settings-label-description">
                                    {mode === "db" ? "Server / database" : "Mock data"}
                                </span>
                            </div>
                        </div>

                        <div className="settings-item">
                            <div className="settings-item-label">
                                <span className="settings-label-text">Role</span>
                                <span className="settings-label-description">
                                    {role === "advisor" ? "Advisor" : "Student"}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default SA_Settings;
