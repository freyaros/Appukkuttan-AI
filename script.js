const byId = (id) => document.getElementById(id);

const elements = {
  input: byId('input'),
  send: byId('send'),
  messages: byId('messages'),
  loading: byId('loading'),
  loadingFill: null,
  persona: byId('persona'),
  clear: byId('btn-clear'),
  surprise: byId('btn-surprise'),
  confirm: byId('confirm'),
  confirmYes: byId('confirm-yes'),
  confirmNo: byId('confirm-no'),
  likeSticker: byId('sticker-like'),
  love: byId('love'),
};

document.addEventListener('DOMContentLoaded', () => {
  elements.loadingFill = document.querySelector('.loading__fill');

  elements.send.addEventListener('click', onSend);
  elements.input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') onSend();
  });

  elements.clear.addEventListener('click', onClear);
  elements.confirmYes.addEventListener('click', () => {
    elements.messages.innerHTML = '';
    hideConfirm();
  });
  elements.confirmNo.addEventListener('click', hideConfirm);

  // Call API directly; no local fallback
  elements.surprise.addEventListener('click', async () => {
    showLoading();
    const ai = await fetchGeminiReply('Surprise me in character.');
    hideLoading();
    addBotMessage(ai || 'API unavailable — check server or API key.');
  });

  elements.likeSticker.addEventListener('click', () => {
    elements.likeSticker.classList.toggle('active');
  });

  elements.love.addEventListener('click', () => {
    addBotMessage('Ayyyo, heart attack! If Maya sees this, I will faint in cinematic slow motion. Two minutes silence for my respect.');
  });
});

function onClear() { showConfirm(); }

async function onSend() {
  const text = elements.input.value.trim();
  if (!text) return;
  addUserMessage(text);
  elements.input.value = '';
  showLoading();
  try {
    const ai = await fetchGeminiReply(text);
    addBotMessage(ai || 'API unavailable — check server or API key.');
  } catch (e) {
    addBotMessage('API unavailable — check server or API key.');
  } finally {
    hideLoading();
  }
}

function showLoading() {
  elements.loading.hidden = false;
  requestAnimationFrame(() => { elements.loadingFill.style.width = '100%'; });
}
function hideLoading() {
  elements.loadingFill.style.width = '0%';
  setTimeout(() => (elements.loading.hidden = true), 220);
}
function showConfirm() { elements.confirm.hidden = false; }
function hideConfirm() { elements.confirm.hidden = true; }

function addUserMessage(text) {
  const li = document.createElement('li');
  li.className = 'message message--user';
  li.textContent = text;
  elements.messages.appendChild(li);
  li.scrollIntoView({ behavior: 'smooth', block: 'end' });
}
function addBotMessage(text) {
  const li = document.createElement('li');
  li.className = 'message message--bot';
  li.textContent = text;
  elements.messages.appendChild(li);
  li.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

async function fetchGeminiReply(message) {
  try {
    const resp = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history: collectHistory() }),
    });
    if (!resp.ok) throw new Error('bad status');
    const data = await resp.json();
    return data.reply;
  } catch (e) {
    return null;
  }
}

function collectHistory() {
  // Convert existing messages into chat history for better continuity
  const items = Array.from(elements.messages.querySelectorAll('li'));
  const history = items.slice(-10).map((li) => ({
    role: li.classList.contains('message--user') ? 'user' : 'model',
    text: li.textContent || '',
  }));
  return history;
}

// Note: Local fallback generator removed on purpose to avoid default answers. 