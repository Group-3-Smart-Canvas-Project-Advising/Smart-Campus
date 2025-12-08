# Smart Campus

Currently developing with Webstorm IDE.

To Login 
- as mock student enter 'student' and 'password'
- as mock advisor enter 'advisor' and 'password'

When user types 'user' and 'password' into respective input fields, navigates to student account page.
Includes mock A.I. prompt bubble and hamburger menu with navigation to 'Calendar', 'Dashboard', 'Profile', 'Settings' pages(currently empty)

***


## Setup
- WebStorm IDE, Visual Studio Code, etc


## Prerequisites
- Node.js (version 20.19 or higher)
- npm or yarn

# 🚀 Getting Started

# 1. Clone the repository

- git clone <https://github.com/stw-fall-2025-software-engineering/Group-3-Advising.git>
- cd Group-3-Advising

# 2. Backend Setup
- cd backend
- npm install
- (Optional) Create a `.env` file with your configuration (see Environment Variables below)
- npm run dev

# 3. Frontend Setup
- cd ..
- npm install
- npm run dev

- Runs at http://localhost:5173

# Common Issues
- Blank screen on frontend
- Ensure frontend dependencies are installed
- Check the browser console
- API requests failing
- Make sure backend is running at http://localhost:3000
- CORS issues? Restart both servers
- Module not found
- Run npm install in both root and backend/

# Git Collaboration Workflow
- Each team member should:
- Create a feature branch
- Make changes
- Commit with clear messages
- Push and open a Pull Request
- Another team member reviews before merging

# AI Tools Used
- ChatGPT
- Cursor / Claude optional
- Github Copilot optional


## Project Structure
- `/src` - Source code
- `/src/components` - React components
- `/src/pages` - Page components
- `/public` - Static assets

## Common Issues
- **Blank screen**: Check browser console for errors
- **Module not found**: Run `npm install` again

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Environment Variables

### Backend Configuration

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Data Mode: 'mock' or 'db'
DATA_MODE=mock

# Gemini AI Configuration (Optional)
# Get your API key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-pro  # Optional, defaults to 'gemini-pro'

# Database Configuration (if using DATA_MODE=db)
# DB_SERVER=your_server
# DB_DATABASE=your_database
# DB_USER=your_username
# DB_PASSWORD=your_password
# DB_ENCRYPT=true
# DB_TRUST_SERVER_CERTIFICATE=true
```

### AI Chatbot

The chatbot uses Google's Gemini AI when `GEMINI_API_KEY` is configured. If not set, it falls back to a rule-based system that can:
- Navigate to different pages (Calendar, Dashboard, Profile, Settings)
- Answer basic questions about the app
- Provide help and guidance

To enable Gemini AI:
1. Get an API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add `GEMINI_API_KEY=your_key_here` to `backend/.env`
3. Restart the backend server
