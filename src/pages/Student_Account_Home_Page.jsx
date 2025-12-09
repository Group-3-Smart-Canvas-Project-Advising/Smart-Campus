import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AI_Prompt_Field from "../components/AI_Prompt_Field.jsx";
import Hamburger_Menu from "../components/Hamburger_Menu.jsx";
import Avatar from "../components/Avatar.jsx";
import { useUser } from "../context/UserContext.jsx";
import { sendMessage } from "../api/chatbot.js";
import "../styles/osu-theme.css";
import "../styles/osu-theme-dark.css";
import "./Student_Account_Home_Page.css";

const Student_Account_Home_Page = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const role = user?.role || "student";
    const name = user?.name || user?.username || "Student";
    const [isLoading, setIsLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const chatEndRef = useRef(null);

    // Auto-scroll to bottom when new messages are added
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory, isLoading]);

    const handleChatSubmit = async (message) => {
        if (!message.trim() || isLoading) return;

        // Add user message to history
        const userMessage = { type: 'user', content: message, timestamp: new Date() };
        setChatHistory(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const result = await sendMessage(message, user);

            if (result.ok && result.response) {
                // Add assistant response to history
                const assistantMessage = { 
                    type: 'assistant', 
                    content: result.response, 
                    timestamp: new Date(),
                    navigation: result.navigation 
                };
                setChatHistory(prev => [...prev, assistantMessage]);

                // Handle navigation if the chatbot detected a routing intent
                if (result.navigation && result.navigation.shouldNavigate) {
                    // Small delay to show the response before navigating
                    setTimeout(() => {
                        navigate(result.navigation.route);
                    }, 1000);
                }
            } else {
                const errorMessage = { 
                    type: 'assistant', 
                    content: "I'm sorry, I couldn't process that request. Please try again.",
                    timestamp: new Date()
                };
                setChatHistory(prev => [...prev, errorMessage]);
            }
        } catch (error) {
            console.error("Chatbot error:", error);
            const errorMessage = { 
                type: 'assistant', 
                content: "I'm sorry, there was an error. Please try again later.",
                timestamp: new Date()
            };
            setChatHistory(prev => [...prev, errorMessage]);
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
                    <Avatar size={40} />
                    <Hamburger_Menu />
                </div>
            </header>

            <main className="osu-main">
                <section className="osu-card osu-home-card">
                    <h2 className="osu-card-title">Smart Advising Assistant</h2>
                    <p className="osu-card-subtitle">
                        Ask a question about classes, advising, or campus resources and the assistant will help.
                    </p>

                    {/* Chat History */}
                    <div className="chat-history-container">
                        {chatHistory.length === 0 ? (
                            <div className="chat-empty-state">
                                <p className="chat-empty-text">Start a conversation by asking a question below.</p>
                            </div>
                        ) : (
                            <div className="chat-messages">
                                {chatHistory.map((message, index) => (
                                    <div 
                                        key={index} 
                                        className={`chat-message chat-message-${message.type}`}
                                    >
                                        <div className="chat-message-content">
                                            {message.content}
                                        </div>
                                        {message.navigation && message.navigation.shouldNavigate && (
                                            <div className="chat-navigation-hint">
                                                Navigating to {message.navigation.route}...
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="chat-message chat-message-assistant">
                                        <div className="chat-message-content chat-loading">
                                            <span className="chat-typing-indicator">●</span>
                                            <span className="chat-typing-indicator">●</span>
                                            <span className="chat-typing-indicator">●</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>
                        )}
                    </div>

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
