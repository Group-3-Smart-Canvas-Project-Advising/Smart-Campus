
A Branch for an Minimal Viable Product built using React and node.js


*** TODO - fix broken link ***
<!--You can run the app directly in your browser here:
https://Brandon-Conner.github.io/Group-3-Smart-Canvas-Project-Advising/Smart-Campus-->


💻 **Running the Project Locally**

If you want to run the app locally instead:

Either clone the repository or download and extract the zip file from the <> code button, then:

1. Install dependencies
```
npm install
```

3. Start the development server
```
npm start
```

This runs the app in development mode.
Open http://localhost:3000

🌐 **Deploying to GitHub Pages**

To deploy your own fork of the project:

Install GitHub Pages:
```
npm install --save-dev gh-pages
```
Add this to your package.json:
```
"homepage": "https://YOUR-USER-NAME.github.io/Group-3-Smart-Canvas-Project-Advising/Smart-Campus",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```
Deploy:
```
npm run deploy
```
