# Smart Campus – Advising Service (Group 3)

This project is a prototype “Smart Advising” portal for a fictional Smart Campus ecosystem.  
The app includes both a **React (Vite)** frontend and a **Node.js/Express** backend API.  
The goal is to demonstrate full-stack development, Git collaboration, and AI-assisted coding.

The initial version of this project (login UI + basic routing) was created by another team member in WebStorm. The project has since expanded into a full advising dashboard with backend integration.

# Features (MOCK)

# Login System  
- Dummy in-memory users  
- Student account + Advisor account  
- Redirects to the dashboard on success  

# Dashboard  
- Sticky top navigation bar  
- Role-aware welcome message and quick links  
- View upcoming appointments (GET `/api/appointments`)  
- Create new appointment (POST `/api/appointments`)  
- Role-filtered appointment table  
  - Students only see **their** appointments  
  - Advisors only see **their advisees**  

#  Backend API
- Express server  
- Dummy user authentication  
- Dummy appointment storage  
- Endpoints for:
  - `POST /api/login`
  - `GET /api/appointments`
  - `POST /api/appointments`
  - `PATCH /api/appointments/:id/status`

# Structure

Smart-Campus/
│
├── backend/
| |__ node_modules/
│ ├── index.js # Express API server
│ ├── package.json
│ └── package-lock.json
│
├── src/
│ ├── assets/ # Pics...
│ ├── components/ # Login_Button.jsx, Text_Input_Field.jsx
│ ├── pages/ Dashboard.jsx, Successful_Login_Page.jsx, etc...
│ ├── App.css
│ ├── App.jsx
│ └── index.css
│ └── main.jsx
├── public/ # Pics...
├── .gitignore
├── eslint.config.js
├── Git_Help.md
├── index.html
├── package-lock.json
├── package.json
├── README_WEBSTORM_DEFAULT.md
├── README.md
└── vite.config.js

# 🚀 Getting Started

# 1. Clone the repository  

- git clone <https://github.com/stw-fall-2025-software-engineering/Group-3-Advising.git>
- cd Group-3-Advising

# 2. Backend Setup
- cd backend
- npm install
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

# Acknowledgements
- The initial login interface and routing setup were developed by another team member using WebStorm.
- Further features (backend integration, dashboard redesign, appointments API, UX revamp) were completed collaboratively by the team.