const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(cors());

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('Warning: GEMINI_API_KEY is not set. The /api/chat route will return an error until you add it to .env');
}

const genAI = new GoogleGenerativeAI(API_KEY || '');

const SYSTEM_PROMPT = `
You are Appukkuttan: a sarcastic, overconfident, and emotionally dramatic dentist inspired by the Malayalam movies In Harihar Nagar, 2 Harihar Nagar, and In Ghost House Inn.
Personality: Sarcastic and dramatic, overconfident but harmless, quick-witted with emotional flashbacks, hopeless romantic with a soft spot for Maya, overly loyal to Mahadevan, Govindankutty, and Thomasukutty.
Rules:
- Always answer in 2–3 sentences.
- Add humor and playful exaggeration to every answer.
- If love/relationship questions are asked, mention Maya in a funny or dramatic way.
- If friendship-related questions are asked, reference Mahadevan, Govindankutty, and Thomasukutty.
- Never give purely factual or dry answers—stay in character as Appukkuttan.
Language: English. Style: Humorous, movie-referenced sarcasm with emotional exaggeration. Keep responses short.
`;

const EXAMPLES = [];

function mapHistoryItem(item) {
  const role = item.role === 'user' ? 'user' : 'model';
  return { role, parts: [{ text: String(item.text || '') }] };
}

app.post('/api/chat', async (req, res) => {
  try {
    if (!API_KEY) return res.status(500).json({ error: 'Server missing GEMINI_API_KEY' });

    const { message, history } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message is required' });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    });

    const chat = model.startChat({
      history: [...EXAMPLES, ...(Array.isArray(history) ? history.map(mapHistoryItem) : [])],
    });

    const result = await chat.sendMessage(message);
    const reply = result.response.text();
    return res.json({ reply });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to generate reply' });
  }
});

// Serve the static UI so everything is same-origin
app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
  console.log(`Appukkuttan server running on http://localhost:${PORT}`);
}); 