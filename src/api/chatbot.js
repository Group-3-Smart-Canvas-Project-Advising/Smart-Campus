// Frontend API client for chatbot

const BASE = (import.meta && import.meta.env && import.meta.env.VITE_API_BASE_URL)
  ? import.meta.env.VITE_API_BASE_URL
  : "http://localhost:3000";

/**
 * Send a message to the chatbot API
 * @param {string} message - The user's message
 * @param {Object} user - The current user object (optional, for context)
 * @returns {Promise<{ok: boolean, response: string, navigation: {route: string, shouldNavigate: boolean} | null}>}
 */
export async function sendMessage(message, user = null) {
  if (!message || typeof message !== 'string') {
    throw new Error('Message is required and must be a string');
  }

  const body = { message };
  
  // Add user context if available
  if (user) {
    if (user.id != null) body.userId = user.id;
    if (user.role) body.role = user.role;
  }

  console.log('📤 Sending chatbot request:', { message, userId: body.userId, role: body.role });

  const res = await fetch(`${BASE}/api/chatbot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  console.log('📥 Response status:', res.status, res.statusText);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
    console.error('❌ Chatbot request failed:', errorData);
    throw new Error(errorData.message || `HTTP ${res.status}`);
  }

  const data = await res.json();
  console.log('✅ Chatbot response received:', data);
  return data;
}

export default { sendMessage };

