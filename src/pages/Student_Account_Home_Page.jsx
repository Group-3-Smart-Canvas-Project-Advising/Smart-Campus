import React from "react";
import AI_Prompt_Field from "../components/AI_Prompt_Field.jsx";
import Hamburger_Menu from "../components/Hamburger_Menu.jsx";
import { useUser } from "../context/UserContext.jsx";
import "../styles/osu-theme.css";

const Student_Account_Home_Page = () => {
    const { user } = useUser();
    const role = user?.role || "student";
    const name = user?.name || user?.username || "Student";

    return (
        <div className="osu-app-shell">
            <header className="osu-topbar">
                <div className="osu-topbar-left">
                    <div className="osu-logo-mark" aria-hidden="true">
                        OSU
                    </div>
                    <div>
                        <h1 className="osu-topbar-title">Smart Advising Assistant</h1>
                        <p className="osu-topbar-subtitle">
                            Welcome back, {name}
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
                    <Hamburger_Menu />
                </div>
            </header>

            <main className="osu-main">
                <section className="osu-card osu-home-card">
                    <h2 className="osu-card-title">Welcome</h2>
                    <p className="osu-card-subtitle">
                        Ask a question about classes, advising, or campus resources and the assistant will help.
                    </p>

                    <div className="osu-home-prompt">
                        <AI_Prompt_Field onSubmit={() => alert("Thinking...")} />
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Student_Account_Home_Page;
