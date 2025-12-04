import React, { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import "./App.css";
import Text_Input_Field from "./components/Text_Input_Field.jsx";
import Login_Button from "./components/Login_Button.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { UserContext } from "./context/UserContext.jsx";
import { listForUser } from "./api/appointments.js";
import LoadingBar from "./components/LoadingBar.jsx";

// Only keep routes that actually use lazy loading
const page_routes = [
    { path: '/student_home', filename: 'Student_Account_Home_Page' },
    { path: '/settings', filename: 'SA_Settings' },
    { path: '/calendar', filename: 'SA_Calendar' },
    { path: '/dashboard', filename: 'Dashboard' },
    { path: '/profile', filename: 'SA_Profile' },
];

// Create a map of lazy-loaded components
const componentMap = {};
page_routes.forEach((route) => {
  componentMap[route.filename] = lazy(() =>
    import(`./pages/${route.filename}.jsx`)
  );
});

// Login page
const LoginPage = ({ onLogin }) => {
  const [Username, set_Username] = useState("");
  const [password, set_Password] = useState("");
  const [is_loading, set_is_loading] = useState(false);
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
        if (onLogin) {
          // Ensure username from input is retained if backend doesn't echo it
          onLogin({ ...data.user, username: data.user?.username ?? Username });
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
    <div className="background_image">
      <h1>Smart Campus</h1>
      <form onSubmit={handle_login_submit}>
        <div className="login_component_group">
          <div
            style={{
              backgroundColor: "rgba(100, 100, 100, 0.3)",
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
          </div>
        </div>
      </form>
    </div>
  );
};

const App = () => {

  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const handleLogout = () => {
    setUser(null);
    setAppointments([]);
  };

  // Load appointments when user logs in (or clear when logs out)
  useEffect(() => {
    let aborted = false;
    async function load() {
      if (!user) { setAppointments([]); return; }
      try {
        setIsDataLoading(true);
        const mine = await listForUser(user);
        if (!aborted) setAppointments(Array.isArray(mine) ? mine : []);
      } catch (e) {
        console.error("Failed to load appointments for user:", e);
        if (!aborted) setAppointments([]);
      }
      finally {
        if (!aborted) setIsDataLoading(false);
      }
    }
    load();
    return () => { aborted = true; };
  }, [user]);

  return (
    <BrowserRouter>
      <UserContext.Provider value={{
        user,
        setUser,
        appointments,
        setAppointments,
        isPageLoading,
        setIsPageLoading,
        isDataLoading,
        setIsDataLoading,
      }}>
        {/* Global loading bar that reacts to context flags (data/page) */}
        <LoadingBar />
        <Suspense fallback={<LoadingBar forceVisible /> }>
          <Routes>
            {/* Login route */}
            <Route path="/" element={<LoginPage onLogin={setUser} />} />

            {/* Your dashboard, now also gets onLogout */}
            <Route
              path="/dashboard"
              element={<Dashboard user={user} onLogout={handleLogout} />}
            />

            {/* Other lazy-loaded pages (original Successful_Login_Page) */}
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