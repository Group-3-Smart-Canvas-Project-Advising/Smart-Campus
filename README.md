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
