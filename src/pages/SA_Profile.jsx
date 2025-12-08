import React from "react";
import "./SA_Profile.css";

import ProfileIcon from "/profile.svg";
import Hamburger_Menu from "../components/Hamburger_Menu.jsx";
import Avatar from "../components/Avatar.jsx";
import { useUser } from "../context/UserContext.jsx";

const SA_Profile = () => {
  const { user } = useUser();
  const role = user?.role || "student";
  const displayName = user?.name || user?.username || "User";

  return (
    <div className="background_image profile-page">
      <div className="profile-inner">
        {/* HEADER – same style as Dashboard/Settings/Calendar */}
        <header className="dashboard-header">
          <div>
            <h1>Profile</h1>
            <p>Account details for {displayName}.</p>
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

        <main className="profile-main">
          <section className="profile-card">
            <img src={ProfileIcon} alt="Profile icon" />
            <div>
              <h3>{displayName}</h3>
              <p style={{ fontSize: "0.9rem", opacity: 0.9 }}>
                Role: {role === "advisor" ? "Advisor" : "Student"}
              </p>
              <p style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                Additional profile fields will go here in a future version.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default SA_Profile;
