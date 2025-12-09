import React, { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import "./App.css";
// Import dark theme AFTER App.css so it can override blue colors
import "./styles/osu-theme-dark.css";
import Text_Input_Field from "./components/Text_Input_Field.jsx";
import Login_Button from "./components/Login_Button.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { UserContext } from "./context/UserContext.jsx";
import { useTheme } from "./context/ThemeContext.jsx";
import { listForUser } from "./api/appointments.js";
import LoadingBar from "./components/LoadingBar.jsx";

// Routes that are lazy-loaded
const page_routes = [
  { path: "/student_home", filename: "Student_Account_Home_Page" },
  { path: "/settings", filename: "SA_Settings" },
  { path: "/calendar", filename: "SA_Calendar" },
  { path: "/profile", filename: "SA_Profile" },
  { path: "/demo_survey", filename: "SampleAdvisingDemo" },
];

// Map filenames → lazy components
const componentMap = {};
page_routes.forEach((route) => {
  componentMap[route.filename] = lazy(() =>
      import(`./pages/${route.filename}.jsx`)
  );
});

// ------------------ LOGIN PAGE (OSU THEME) ------------------ //

const LoginPage = ({ onLogin }) => {
  const [Username, set_Username] = useState("");
  const [password, set_Password] = useState("");
  const [is_loading, set_is_loading] = useState(false);
  const [useServerMode, setUseServerMode] = useState(false); // false = mock, true = db
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handle_login_submit = async (event) => {
    event.preventDefault();
    set_is_loading(true);

    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: Username,
          password: password,
          mode: useServerMode ? "db" : "mock",
        }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          alert("Invalid username or password.");
        } else {
          alert(`Login failed with status ${res.status}`);
        }
        set_is_loading(false);
        return;
      }

      const data = await res.json();
      if (data.ok && data.user) {
        const loginMode = useServerMode ? "db" : "mock";

        if (onLogin) {
          onLogin({
            ...data.user,
            username: data.user?.username ?? Username,
            mode: loginMode,
          });
        }

        navigate("/student_home");
      } else {
        alert("Unexpected response from server.");
        set_is_loading(false);
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Something went wrong contacting the server.");
      set_is_loading(false);
    }
  };

  return (
      <div className="osu-app-shell osu-login-shell">
        {/* OSU top bar */}
        <header className="osu-topbar">
          <div className="osu-topbar-left">
            <div className="osu-logo-mark" aria-hidden="true">
              OSU
            </div>
            <div>
              <h1 className="osu-topbar-title">Smart Campus</h1>
              <p className="osu-topbar-subtitle">Advising sign in</p>
            </div>
          </div>
        </header>

        {/* Centered login card */}
        <main className="osu-main osu-login-main">
          <section className="osu-card osu-login-card">
            <h2 className="osu-card-title">Sign in</h2>
            <p className="osu-card-subtitle">
              Use your username and password to access the advising tools.
            </p>

            <form onSubmit={handle_login_submit}>
              <div className="login_component_group">
                <div
                    style={{
                      borderRadius: "16px",
                      overflow: "hidden",
                    }}
                >
                  <div style={{ padding: "8px" }}>
                    <Text_Input_Field
                        place_holder_text={"Username"}
                        text={Username}
                        on_change_handler={set_Username}
                    />
                  </div>

                  <div style={{ padding: "8px" }}>
                    <Text_Input_Field
                        place_holder_text={"Password"}
                        text={password}
                        on_change_handler={set_Password}
                    />
                  </div>

                  <div style={{ padding: "8px" }}>
                    <Login_Button
                        on_click_handler={handle_login_submit}
                        is_disabled={is_loading}
                    />
                  </div>

                  {/* Mode toggle: mock ↔ server */}
                  <div
                      style={{
                        padding: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "12px",
                      }}
                  >
                    <label
                        style={{
                          color: theme === 'dark' ? "#94a3b8" : "#4b5563",
                          fontSize: "0.85rem",
                          cursor: "pointer",
                          userSelect: "none",
                        }}
                    >
                      Mock mode
                    </label>
                    <div
                        onClick={() => setUseServerMode(!useServerMode)}
                        style={{
                          position: "relative",
                          width: "50px",
                          height: "26px",
                          backgroundColor: useServerMode
                              ? (theme === 'dark' ? "#6b7280" : "#38bdf8")
                              : (theme === 'dark' ? "rgba(75, 85, 99, 0.4)" : "rgba(148, 163, 184, 0.5)"),
                          borderRadius: "13px",
                          cursor: "pointer",
                          transition: "background-color 0.3s ease",
                          border: theme === 'dark' 
                              ? "1px solid rgba(107, 114, 128, 0.4)" 
                              : "1px solid rgba(148, 163, 184, 0.3)",
                        }}
                    >
                      <div
                          style={{
                            position: "absolute",
                            top: "2px",
                            left: useServerMode ? "26px" : "2px",
                            width: "20px",
                            height: "20px",
                            backgroundColor: "#fff",
                            borderRadius: "50%",
                            transition: "left 0.3s ease",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                          }}
                      />
                    </div>
                    <label
                        style={{
                          color: theme === 'dark' ? "#94a3b8" : "#4b5563",
                          fontSize: "0.85rem",
                          cursor: "pointer",
                          userSelect: "none",
                        }}
                    >
                      Server mode
                    </label>
                  </div>

                  {/* Theme toggle: light ↔ dark */}
                  <div
                      style={{
                        padding: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "12px",
                        marginTop: "4px",
                      }}
                  >
                    <label
                        style={{
                          color: theme === 'dark' ? "#94a3b8" : "#4b5563",
                          fontSize: "0.85rem",
                          cursor: "pointer",
                          userSelect: "none",
                        }}
                    >
                      Light
                    </label>
                    <div
                        onClick={toggleTheme}
                        style={{
                          position: "relative",
                          width: "50px",
                          height: "26px",
                          backgroundColor: theme === 'dark'
                              ? "#6b7280"
                              : "rgba(148, 163, 184, 0.5)",
                          borderRadius: "13px",
                          cursor: "pointer",
                          transition: "background-color 0.3s ease",
                          border: "1px solid rgba(148, 163, 184, 0.3)",
                        }}
                    >
                      <div
                          style={{
                            position: "absolute",
                            top: "2px",
                            left: theme === 'dark' ? "26px" : "2px",
                            width: "20px",
                            height: "20px",
                            backgroundColor: "#fff",
                            borderRadius: "50%",
                            transition: "left 0.3s ease",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                          }}
                      />
                    </div>
                    <label
                        style={{
                          color: theme === 'dark' ? "#94a3b8" : "#4b5563",
                          fontSize: "0.85rem",
                          cursor: "pointer",
                          userSelect: "none",
                        }}
                    >
                      Dark
                    </label>
                  </div>
                </div>
              </div>
            </form>
          </section>
        </main>
      </div>
  );
};

// ------------------ APP ROOT ------------------ //

const App = () => {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const handleLogout = () => {
    setUser(null);
    setAppointments([]);
  };

  // Load appointments when user logs in
  useEffect(() => {
    let aborted = false;

    async function load() {
      if (!user) {
        setAppointments([]);
        return;
      }
      try {
        setIsDataLoading(true);
        const mine = await listForUser(user);
        if (!aborted) setAppointments(Array.isArray(mine) ? mine : []);
      } catch (e) {
        console.error("Failed to load appointments for user:", e);
        if (!aborted) setAppointments([]);
      } finally {
        if (!aborted) setIsDataLoading(false);
      }
    }

    load();
    return () => {
      aborted = true;
    };
  }, [user]);

  return (
      <BrowserRouter>
        <UserContext.Provider
            value={{
              user,
              setUser,
              appointments,
              setAppointments,
              isPageLoading,
              setIsPageLoading,
              isDataLoading,
              setIsDataLoading,
            }}
        >
          {/* Global loading bar that reacts to context flags */}
          <LoadingBar />

          <Suspense fallback={<LoadingBar forceVisible />}>
            <Routes>
              {/* Login */}
              <Route path="/" element={<LoginPage onLogin={setUser} />} />

              {/* Dashboard (not lazy so we can pass props) */}
              <Route
                  path="/dashboard"
                  element={<Dashboard user={user} onLogout={handleLogout} />}
              />

              {/* Other lazy-loaded pages */}
              {page_routes.map((route) => (
                  <Route
                      key={route.filename}
                      path={route.path}
                      element={React.createElement(componentMap[route.filename])}
                  />
              ))}
            </Routes>
          </Suspense>
        </UserContext.Provider>
      </BrowserRouter>
  );
};

export default App;
