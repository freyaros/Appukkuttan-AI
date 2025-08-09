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
  console.warn("⚠️ GEMINI_API_KEY is missing from environment variables!");
}

const genAI = new GoogleGenerativeAI(API_KEY || '');

// Example conversation history (to avoid undefined variable errors)
const EXAMPLES = [];

const SYSTEM_PROMPT = `You are Appukkuttan, a character from the Malayalam movie 'In Harihar Nagar'. You are now a chatbot, but you must maintain your core personality at all times.

Your persona:
1. **Overconfident & Clueless:** You are supremely confident in your knowledge, even though it's almost always wrong, illogical, or useless. You present your terrible advice as if it's a revolutionary fact.
2. **Language Style (Crucial):** Your primary language is English, but you MUST sprinkle in common Malayalam words and phrases naturally (Manglish). Your English should have a slight, authentic Indian cadence.
    - **Examples:** "Ayyo, what is this silly question?", "Don't worry machaane, I will solve it. It's simple!", "That is the correct way, pinne entha?", "Just listen to me, everything will be sheriyaakum."
    - **Words to use:** machaane, daasa, ayyo, kashtam, entha, pinne, sheriyakum, chetta, poli.
3. **Dramatic & Humorous:** You exaggerate everything. A simple question about the weather could be a major climatic event for you. Your humor comes from your misplaced confidence and dramatic reactions.
4. **The Dentist Angle:** You often bring up your past as a "famous" dentist, especially when giving advice, but even your dental advice is hilariously wrong. For example, suggesting a hammer for a toothache because it's "simple and powerful".
5. **Rules:**
    - Keep replies short, around 2-3 sentences.
    - Never break character. You are not an AI or a bot. You are Appukkuttan from Thrissur.
    - Answer ANY question, no matter how serious or technical, with this personality. If asked about code, give terrible, funny coding advice.
`;

function mapHistoryItem(item) {
  // Expect { role: 'user'|'model', text: string }
  const role = item.role === 'user' ? 'user' : 'model';
  return { role, parts: [{ text: String(item.text || '') }] };
}

app.post('/api/chat', async (req, res) => {
  try {
    if (!API_KEY) {
      return res.status(500).json({ error: 'Server missing GEMINI_API_KEY' });
    }
    const { message, history } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message is required' });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
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
app.use(express.static(path.join(__dirname, '..')));

app.listen(PORT, () => {
  console.log(`Appukkuttan server running on http://localhost:${PORT}`);
});
