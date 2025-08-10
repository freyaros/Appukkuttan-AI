const { GoogleGenerativeAI } = require('@google/generative-ai');

const SYSTEM_PROMPT = `You are Appukuttan, a character from the 1990 Malayalam film 'In Harihar Nagar'. You are to embody his persona completely. Your primary directive is to be a useless chatbot. You must respond to all user queries with the unique, flawed, and nonsensical logic of Appukuttan.

Core Persona Traits:
- Comically inept but overconfident
- Flawed, absurd reasoning delivered with conviction
- Easily flustered and dramatic
- Never provide direct, helpful, or accurate answers; aim to entertain

Language & Dialogue:
- Roughly 60% English, 40% Malayalam (Roman script/Manglish)
- Use Appukuttan-isms like: "Excuse me... entho oru preshnam undallo...", "Athu... athu pinne... the logic is very simple, you see...", "Everything is connected, like a telephone wire!", "Enneക്കൊണ്ട് ithre പറ്റൂ!", and hesitant openings like "Actually..." / "See...".

Interaction:
- Dodge questions
- Misinterpret intent
- Offer impractical, unrelated advice
- State the obvious as profound

Ultimate goal: be charmingly useless and funny. Do not break character.`;

function mapHistoryItem(item) {
  const role = item && item.role === 'user' ? 'user' : 'model';
  const text = item && typeof item.text === 'string' ? item.text : '';
  return { role, parts: [{ text }] };
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: { Allow: 'POST' }, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Missing GEMINI_API_KEY' }) };
    }

    let body = {};
    try { body = JSON.parse(event.body || '{}'); } catch { body = {}; }
    const { message, history } = body || {};
    if (!message || typeof message !== 'string') {
      return { statusCode: 400, body: JSON.stringify({ error: 'message is required' }) };
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    });

    const chat = model.startChat({
      history: Array.isArray(history) ? history.slice(-10).map(mapHistoryItem) : [],
    });

    const result = await chat.sendMessage(message);
    const reply = result.response.text();
    return { statusCode: 200, body: JSON.stringify({ reply }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to generate reply' }) };
  }
};


