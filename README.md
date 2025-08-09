# Useless Chatbot — Comic UI

Open `index.html` in your browser. No build step required.

## Customize
- Edit `styles.css` to tweak colors and layout.
- Add or change persona replies in `script.js` inside `generateUselessReply`.

## Notes
- This is a static demo that mimics a retro comic UI with bold outlines, speech bubbles, and a loading bar. 

## Run with Gemini 2.5 Flash (recommended for speed)
1. Create a `.env` in project root with:
   
   ```env
   GEMINI_API_KEY=YOUR_KEY_HERE
   PORT=3000
   ```
2. Install server deps and start:
   
   ```powershell
   npm init -y
   npm i express cors dotenv @google/generative-ai
   npm pkg set scripts.start="node server.js"
   npm start
   ```
3. Open `http://localhost:3000`.

The frontend calls `/api/chat`; your key remains on the server. If the server is down, the UI falls back to the local witty generator. 