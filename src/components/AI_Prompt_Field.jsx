
import React, { useState } from 'react';
import './AI_Prompt_Field.css';

const AI_Prompt_Field = ({
    onSubmit,
    isLoading = false,
    placeholder = "How can I help...?",
    maxLength = 2000
}) => {
    const [prompt, setPrompt] = useState('');

    const handle_submit = (e) =>
    {
        e.preventDefault();
        if (prompt.trim() && !isLoading)
        {
            onSubmit(prompt);       // Connect to AI API via Java Backend API
            setPrompt(''); // Clear after submit
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
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handle_key_down}
                placeholder={placeholder}
                maxLength={maxLength}
                disabled={isLoading}
                className="ai-prompt-field"
                rows={3}
            />
            <div className="prompt-footer">
                <span className="character-count">
                    {prompt.length}/{maxLength}
                </span>
                <button
                    type="submit"
                    disabled={!prompt.trim() || isLoading}
                    className="submit-button"
                >
                    {isLoading ? 'Sending...' : 'Send'}
                </button>
            </div>
        </form>
    );


}

export default AI_Prompt_Field