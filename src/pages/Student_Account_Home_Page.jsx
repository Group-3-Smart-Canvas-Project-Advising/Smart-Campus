import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AI_Prompt_Field from "../components/AI_Prompt_Field.jsx";
import Hamburger_Menu from "../components/Hamburger_Menu.jsx";
import { useUser } from "../context/UserContext.jsx";
import { sendMessage } from "../api/chatbot.js";
import "../styles/osu-theme.css";

const Student_Account_Home_Page = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const role = user?.role || "student";
    const name = user?.name || user?.username || "Student";
    const [isLoading, setIsLoading] = useState(false);
    const [lastResponse, setLastResponse] = useState("");

    const handleChatSubmit = async (message) => {
        if (!message.trim() || isLoading) return;

        setIsLoading(true);
        setLastResponse("");

        try {
            const result = await sendMessage(message, user);

            if (result.ok && result.response) {
                setLastResponse(result.response);

                // Handle navigation if the chatbot detected a routing intent
                if (result.navigation && result.navigation.shouldNavigate) {
                    // Small delay to show the response before navigating
                    setTimeout(() => {
                        navigate(result.navigation.route);
                    }, 1000);
                }
            } else {
                setLastResponse("I'm sorry, I couldn't process that request. Please try again.");
            }
        } catch (error) {
            console.error("Chatbot error:", error);
            setLastResponse("I'm sorry, there was an error. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

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

                    {lastResponse && (
                        <div className="osu-chat-response" style={{
                            marginBottom: "1rem",
                            padding: "1rem",
                            backgroundColor: "#f3f4f6",
                            borderRadius: "8px",
                            border: "1px solid #e5e7eb"
                        }}>
                            <p style={{ margin: 0, color: "#1f2937" }}>{lastResponse}</p>
                        </div>
                    )}

                    <div className="osu-home-prompt">
                        <AI_Prompt_Field 
                            onSubmit={handleChatSubmit}
                            isLoading={isLoading}
                            placeholder="Ask me to navigate to a page or ask a question..."
                        />
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Student_Account_Home_Page;
