import React from "react";
import Hamburger_Menu from "../components/Hamburger_Menu.jsx";
import { useUser } from "../context/UserContext.jsx";
import "../styles/osu-theme.css";

const SA_Settings = () => {
    const { user } = useUser();
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
                    <Hamburger_Menu />
                </div>
            </header>

            <main className="osu-main">
                <section className="osu-card osu-settings-card">
                    <h2 className="osu-card-title">Display & preferences</h2>
                    <p className="osu-card-subtitle">
                        Future settings will appear here. For now, your account uses the
                        default OSU advising experience.
                    </p>

                    <ul className="osu-settings-list">
                        <li>Theme: OSU advising (light)</li>
                        <li>
                            Login mode: {mode === "db" ? "Server / database" : "Mock data"}
                        </li>
                    </ul>
                </section>
            </main>
        </div>
    );
};

export default SA_Settings;
