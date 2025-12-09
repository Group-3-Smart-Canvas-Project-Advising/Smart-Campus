import React from "react";
import "./SA_Profile.css";
import ProfileIcon from "/profile.svg";
import Hamburger_Menu from "../components/Hamburger_Menu.jsx";
import { useUser } from "../context/UserContext.jsx";
import "../styles/osu-theme.css";

const SA_Profile = () => {
    const { user } = useUser();
    const name = user?.name || user?.username || "User";
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
                        <h1 className="osu-topbar-title">Profile</h1>
                        <p className="osu-topbar-subtitle">
                            {role === "advisor" ? "Advisor account" : "Student account"}
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
                <section className="osu-card osu-profile-card">
                    <div className="osu-card-header-row">
                        <div>
                            <h2 className="osu-card-title">{name}</h2>
                            <p className="osu-card-subtitle">
                                {role === "advisor"
                                    ? "Your advising profile"
                                    : "Your student profile"}
                            </p>
                        </div>
                        <img
                            src={ProfileIcon}
                            alt="Profile"
                            className="default_profile_icon"
                        />
                    </div>

                    <dl className="osu-profile-details">
                        <div className="osu-profile-row">
                            <dt>Role</dt>
                            <dd>{role === "advisor" ? "Advisor" : "Student"}</dd>
                        </div>
                        <div className="osu-profile-row">
                            <dt>Login mode</dt>
                            <dd>{mode === "db" ? "Server / database" : "Mock data"}</dd>
                        </div>
                        {user?.email && (
                            <div className="osu-profile-row">
                                <dt>Email</dt>
                                <dd>{user.email}</dd>
                            </div>
                        )}
                    </dl>
                </section>
            </main>
        </div>
    );
};

export default SA_Profile;
