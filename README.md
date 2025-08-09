# Useless Chatbot — Comic UI

Open `index.html` in your browser. No build step required.

## Customize
- Edit `styles.css` to tweak colors and layout.
- Add or change persona replies in `server.js` system prompt.

## Notes
- This is a static demo that mimics a retro comic UI with bold outlines, speech bubbles, and a loading bar.

## Use Gemini locally (proxy server)
1. Put your key in `env/.env`:
   ```env
   GEMINI_API_KEY=YOUR_KEY
   PORT=3000
   ```
2. Install and run locally:
   ```powershell
   npm i
   npm start
   ```
3. Open `http://localhost:3000`.

## Deploy to Vercel
- We included `vercel.json` and a serverless function at `api/chat.js`.
- Set env var in Vercel dashboard: `GEMINI_API_KEY=YOUR_KEY`.
- Deploy with the Vercel CLI:
  ```bash
  npm i -g vercel
  vercel
  ```
- The front-end calls `/api/chat`, which is handled by the Vercel function.
