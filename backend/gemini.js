// backend/gemini.js - Gemini AI configuration and helper functions

const { GoogleGenerativeAI } = require('@google/generative-ai');

// Get Gemini API key from environment
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Default to gemini-pro which is the stable model name
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-pro';

// Check if Gemini is configured
const isGeminiConfigured = () => {
  return !!GEMINI_API_KEY && GEMINI_API_KEY.trim() !== '';
};

// Initialize Gemini client (only if API key is present)
let genAI = null;
if (isGeminiConfigured()) {
  try {
    console.log('🔑 Initializing Gemini with API key:', GEMINI_API_KEY.substring(0, 10) + '...');
    console.log('📋 Using model:', GEMINI_MODEL);
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    console.log('✅ Gemini AI client created successfully');
    
    // Try to verify the API key by attempting to list models
    console.log('🔍 Verifying API key access...');
  } catch (error) {
    console.error('❌ Failed to initialize Gemini AI:', error);
    genAI = null;
  }
} else {
  console.log('⚠️ Gemini API key not found in environment variables');
  console.log('💡 To enable Gemini: Add GEMINI_API_KEY to your .env file');
  console.log('💡 Get your key from: https://makersuite.google.com/app/apikey');
}

/**
 * Get available routes information for the AI prompt
 */
function getAvailableRoutes() {
  return {
    '/student_home': ['home', 'student home', 'main page', 'landing'],
    '/dashboard': ['dashboard', 'dash', 'overview', 'summary'],
    '/calendar': ['calendar', 'schedule', 'appointments', 'events', 'meetings'],
    '/profile': ['profile', 'my profile', 'account', 'user info'],
    '/settings': ['settings', 'preferences', 'configuration', 'options']
  };
}

/**
 * Detect routing intent from message (fallback method)
 */
function detectRouteFallback(message) {
  const normalizedMessage = message.toLowerCase().trim();
  const availableRoutes = getAvailableRoutes();
  
  for (const [route, keywords] of Object.entries(availableRoutes)) {
    for (const keyword of keywords) {
      if (normalizedMessage.includes(keyword)) {
        const navVerbs = ['go to', 'navigate to', 'open', 'show me', 'take me to', 'visit', 'view'];
        const hasNavVerb = navVerbs.some(verb => normalizedMessage.includes(verb));
        
        if (hasNavVerb || normalizedMessage.includes(route.replace('/', ''))) {
          return route;
        }
      }
    }
  }
  return null;
}

/**
 * Generate system prompt for Gemini
 */
function getSystemPrompt(userRole = 'student') {
  const routes = getAvailableRoutes();
  const routeList = Object.entries(routes)
    .map(([path, keywords]) => `- ${path}: ${keywords.join(', ')}`)
    .join('\n');

  return `You are a helpful AI assistant for the Smart Campus advising system. Your role is to help ${userRole}s navigate the application and answer questions about advising, appointments, and campus resources.

AVAILABLE ROUTES:
${routeList}

IMPORTANT INSTRUCTIONS:
1. When the user wants to navigate to a page, detect the routing intent and respond with a JSON object that includes:
   - "response": A friendly message confirming you'll navigate them
   - "navigation": An object with "route" (the path like "/calendar") and "shouldNavigate": true

2. For general questions, provide helpful, concise answers about:
   - Appointments and scheduling
   - Academic advising
   - Campus resources
   - How to use the Smart Campus app

3. Always be friendly, professional, and helpful.

4. If you detect a navigation request, format your response as JSON with this structure:
{
  "response": "I'll take you to the [page name].",
  "navigation": {
    "route": "/route_path",
    "shouldNavigate": true
  }
}

5. For non-navigation responses, format as:
{
  "response": "Your helpful answer here",
  "navigation": null
}

Always respond with valid JSON only, no additional text.`;
}

/**
 * List available models by calling the Gemini API
 */
async function listAvailableModels() {
  if (!isGeminiConfigured() || !genAI) {
    return { error: 'Gemini not configured' };
  }
  
  try {
    // Use the REST API to list models
    const https = require('https');
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;
    
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed);
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject);
    });
  } catch (error) {
    console.error('Failed to list models:', error);
    return { error: error.message };
  }
}

/**
 * Call Gemini API to generate a response
 */
async function generateGeminiResponse(message, userRole = 'student') {
  if (!isGeminiConfigured() || !genAI) {
    throw new Error('Gemini is not configured');
  }

  // List of models to try in order
  const modelsToTry = [
    GEMINI_MODEL, // Try the configured model first
    'gemini-pro', // Fallback to stable model
    'gemini-1.5-pro',
    'gemini-2.5-flash'
  ];

  let lastError = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`🔍 Attempting to use model: ${modelName}`);
      
      // Try to get the model
      const model = genAI.getGenerativeModel({ model: modelName });
      console.log(`✅ Model "${modelName}" retrieved successfully`);
    
      const systemPrompt = getSystemPrompt(userRole);
      const prompt = `${systemPrompt}\n\nUser message: ${message}\n\nAssistant response (JSON only):`;

      console.log('📤 Sending request to Gemini API...');
      const result = await model.generateContent(prompt);
      console.log('📥 Received response from Gemini');
      const response = await result.response;
      const text = response.text().trim();

      // Try to parse JSON from the response
      // Gemini might wrap JSON in markdown code blocks
      let jsonText = text;
      const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      }

      try {
        const parsed = JSON.parse(jsonText);
        return {
          response: parsed.response || text,
          navigation: parsed.navigation || null
        };
      } catch (parseError) {
        // If JSON parsing fails, treat the whole response as text
        console.warn('Failed to parse Gemini JSON response, using raw text:', parseError);
        return {
          response: text,
          navigation: null
        };
      }
    } catch (error) {
      console.warn(`⚠️ Model "${modelName}" failed:`, error.message);
      lastError = error;
      // Continue to next model
      continue;
    }
  }

  // If we get here, all models failed
  if (lastError) {
    console.error('❌ All models failed. Last error:', lastError.message);
    
    // Provide helpful error message
    let errorMessage = `Failed to connect to Gemini API. Tried models: ${[...new Set(modelsToTry)].join(', ')}.\n\n`;
    errorMessage += `Possible issues:\n`;
    errorMessage += `1. API key may not have access to Gemini API - check https://makersuite.google.com/app/apikey\n`;
    errorMessage += `2. Gemini API may not be enabled in your Google Cloud project\n`;
    errorMessage += `3. API key may be invalid or expired\n`;
    errorMessage += `4. Models may not be available in your region\n\n`;
    errorMessage += `Last error: ${lastError.message}\n\n`;
    errorMessage += `💡 Try visiting http://localhost:3000/api/chatbot/models to see available models`;
    
    throw new Error(errorMessage);
  }
}

/**
 * Fallback rule-based response generator
 */
function generateFallbackResponse(message) {
  const normalizedMessage = message.toLowerCase().trim();
  let response = '';
  let shouldNavigate = false;
  let detectedRoute = null;

  // Check for routing intent
  detectedRoute = detectRouteFallback(message);
  if (detectedRoute) {
    shouldNavigate = true;
    const routeNames = {
      '/student_home': 'home page',
      '/dashboard': 'dashboard',
      '/calendar': 'calendar',
      '/profile': 'profile',
      '/settings': 'settings'
    };
    response = `I'll take you to the ${routeNames[detectedRoute]}.`;
  } else if (normalizedMessage.includes('hello') || normalizedMessage.includes('hi') || normalizedMessage.includes('hey')) {
    response = `Hello! I'm your Smart Campus assistant. I can help you navigate the app, answer questions about advising, and assist with appointments. How can I help you today?`;
  } else if (normalizedMessage.includes('appointment') || normalizedMessage.includes('meeting')) {
    response = `You can view and manage your appointments on the Calendar page. Would you like me to take you there?`;
  } else if (normalizedMessage.includes('help') || normalizedMessage.includes('what can you do')) {
    response = `I can help you with:
- Navigating to different pages (Calendar, Dashboard, Profile, Settings)
- Answering questions about the Smart Campus app
- Providing information about appointments and advising

Try asking me to "go to calendar" or "show me my profile"!`;
  } else if (normalizedMessage.includes('who are you') || normalizedMessage.includes('what are you')) {
    response = `I'm the Smart Campus AI assistant, designed to help students and advisors navigate the advising system and answer questions.`;
  } else {
    response = `I understand you're asking about "${message}". I can help you navigate the app or answer questions about advising. Try asking me to go to a specific page, or ask about appointments, calendar, or your profile.`;
  }

  return {
    response,
    navigation: shouldNavigate ? {
      route: detectedRoute,
      shouldNavigate: true
    } : null
  };
}

module.exports = {
  isGeminiConfigured,
  generateGeminiResponse,
  generateFallbackResponse,
  getAvailableRoutes,
  listAvailableModels
};

