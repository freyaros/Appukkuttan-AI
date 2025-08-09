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

<<<<<<< HEAD
## Project Description
An AI chatbot that channels the overconfident, sarcastic, and emotionally dramatic dentist *Appukkuttan* from the famous Malayalam movie sequels — answering serious questions with completely useless advice, movie references, and emotional flashbacks no one asked for.  

---

## The Problem (that doesn't exist)
People are tired of *getting useful, logical answers* from AI chatbots.  
Where is the confusion? Where is the emotional drama? Where is Maya??  

---

## The Solution (that nobody asked for)
We built *Appukkuttan AI* — a chatbot that never solves your problem, but leaves you laughing, confused, and questioning life decisions.  
Love questions? He’ll bring up Maya.  
Friendship questions? Here come Mahadevan, Govindankutty, and Thomasukutty.  
Dental questions? Oh boy, prepare for the legendary lorry story.

---

## Technical Details

### Technologies/Components Used

*For Software:*
- *Languages:* JavaScript, JSON, Markdown  
- *Frameworks:* Node.js (Express for API)  
- *Libraries:* Google Generative AI SDK (`@google/generative-ai`), Front-end comic UI (HTML/CSS/JS)  
- *Tools:* Cursor, GitHub, Gemini API Playground  

*For Hardware:*
- None (Only Appukkuttan’s overconfidence)  
- Hardware requirements: 1 laptop, strong Wi-Fi, and a lot of patience  
- Tools required: A chair (like a dentist), snacks for emotional support  

---

## Implementation

*For Software:*

*Installation*
```bash
git clone https://github.com/Aleena2425/Appukkuttan-s-AI.git
cd Appukkuttan-s-AI
npm install

# Create .env with your Gemini API key
# Get a key from: https://ai.google.dev/
echo GEMINI_API_KEY=your_key_here > .env

# Start the server (UI at http://localhost:3000)
npm start
```
=======
## Deploy to Vercel
- We included `vercel.json` and a serverless function at `api/chat.js`.
- Set env var in Vercel dashboard: `GEMINI_API_KEY=YOUR_KEY`.
- Deploy with the Vercel CLI:
  ```bash
  npm i -g vercel
  vercel
  ```
- The front-end calls `/api/chat`, which is handled by the Vercel function.
>>>>>>> 234830d6368f73a0db2e8db2d207e0b39addfbd9
