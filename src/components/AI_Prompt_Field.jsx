
import React, { useState } from 'react';
import './AI_Prompt_Field.css';

const AI_Prompt_Field = ({
    onSubmit,
    isLoading = false,
    placeholder = "How can I help...?",
    maxLength = 2000
}) => {
    const [prompt, setPrompt] = useState('');
    const textareaRef = React.useRef(null);

    // Auto-resize textarea
    React.useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    }, [prompt]);

    const handle_submit = (e) =>
    {
        e.preventDefault();
        if (prompt.trim() && !isLoading)
        {
            onSubmit(prompt);       // Connect to AI API via Java Backend API
            setPrompt(''); // Clear after submit
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    const handle_key_down = (e) => {
        // Submit on Enter (without Shift)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handle_submit(e);
        }
    };

    return (
        <form onSubmit={handle_submit} className="ai-prompt-container">
            <div className="prompt-input-wrapper">
                <textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handle_key_down}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    disabled={isLoading}
                    className="ai-prompt-field"
                    rows={1}
                />
                <button
                    type="submit"
                    disabled={!prompt.trim() || isLoading}
                    className="submit-button-arrow"
                    aria-label="Send message"
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 2L9 11M18 2L12 18L9 11M18 2L2 8L9 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>
            <div className="prompt-footer">
                <span className="character-count">
                    {prompt.length}/{maxLength}
                </span>
            </div>
        </form>
    );


}

export default AI_Prompt_Field