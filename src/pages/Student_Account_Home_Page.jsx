import React, { useState } from 'react';

import AI_Prompt_Field from "../components/AI_Prompt_Field.jsx";
import Hamburger_Menu from "../components/Hamburger_Menu.jsx";
import Avatar from "../components/Avatar.jsx";
import { useUser } from "../context/UserContext.jsx";

const API_BASE =
  (import.meta.env && import.meta.env.VITE_API_BASE_URL)
    ? import.meta.env.VITE_API_BASE_URL
    : "http://localhost:3000";

const Student_Account_Home_Page = () =>
{
    const { user } = useUser();
    const [aiMessages, setAiMessages] = useState([]);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState("");

    const handleAiSubmit = async (prompt) => {
        const trimmed = prompt.trim();
        if (!trimmed) return;
        setAiError("");

        // Add user message to chat log immediately
        setAiMessages(prev => [
            ...prev,
            { sender: "user", text: trimmed, ts: new Date().toISOString() }
        ]);

        try {
            setAiLoading(true);
            const res = await fetch(`${API_BASE}/api/ai/advising`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: trimmed,
                    user: {
                        id: user?.id,
                        role: user?.role,
                        username: user?.username,
                    },
                }),
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            const data = await res.json();
            if (!data.ok || !data.reply) {
                throw new Error("Bad AI response payload");
            }

            // Add assistant reply
            setAiMessages(prev => [
                ...prev,
                {
                    sender: "assistant",
                    text: data.reply,
                    ts: new Date().toISOString(),
                }
            ]);
        } catch (err) {
            console.error("AI advising call failed:", err);
            setAiError("The advising assistant ran into an issue. Please try again.");
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <div className="background_image">
            <div className="ai-home-shell">
                <header className="ai-home-header">
                    <div>
                        <h2>Welcome to Smart Advising</h2>
                        <p className="card-subtitle">
                        </p>
                    </div>
                    <Avatar size={40} sticky />
                    <Hamburger_Menu />
                </header>

                <section className="card ai-home-card">
                    <div className="ai-chat-log">
                        {aiMessages.length === 0 && (
                            <p className="ai-empty-state">
                                Try asking something like: “How should I plan my schedule next term?”
                            </p>
                        )}

                        {aiMessages.map((m, idx) => (
                            <div
                                key={idx}
                                className={
                                    m.sender === "user"
                                        ? "ai-message ai-message-user"
                                        : "ai-message ai-message-assistant"
                                }
                            >
                                <div className="ai-message-label">
                                    {m.sender === "user" ? "You" : "Advising assistant"}
                                </div>
                                <div className="ai-message-text">
                                    {m.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    {aiError && (
                        <p className="form-error" style={{ marginBottom: "0.5rem" }}>
                            {aiError}
                        </p>
                    )}

                    <AI_Prompt_Field
                        onSubmit={handleAiSubmit}
                        isLoading={aiLoading}
                        placeholder="Ask about holds, scheduling, or degree planning…"
                    />
                </section>
            </div>
        </div>
    );
};

export default Student_Account_Home_Page;