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
  // Fake call elements
  callPopup: byId('call-popup'),
  callerName: byId('caller-name'),
  countdownTimer: byId('countdown-timer'),
  rejectCallButton: byId('reject-call-button'),
};

// Ringtone audio
const ringtone = new Audio('/public/in_harihar_nagar.mp3');
ringtone.loop = true;

// Callers list
const callers = ['Mahadevan', 'Govindankutty', 'Thomaskutty'];

// Track countdown interval and call state so we can cancel/guard
let callCountdownId = null;
let isCallActive = false;

function declineCall(ev) {
  if (ev) ev.stopPropagation();
  if (callCountdownId) { clearInterval(callCountdownId); callCountdownId = null; }
  if (elements.callPopup) {
    elements.callPopup.classList.add('hidden');
    elements.callPopup.setAttribute('aria-hidden', 'true');
  }
  try { ringtone.pause(); } catch {}
  ringtone.currentTime = 0;
  // Re-enable input after call ends
  if (elements.input) elements.input.disabled = false;
  if (elements.send) elements.send.disabled = false;
  isCallActive = false;
}

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

  // Surprise via API
  if (elements.surprise) {
    elements.surprise.addEventListener('click', async () => {
      showLoading();
      const ai = await fetchGeminiReply('Surprise me in character.');
      hideLoading();
      addBotMessage(ai || 'API unavailable — check server or API key.');
    });
  }

  elements.likeSticker.addEventListener('click', () => {
    elements.likeSticker.classList.toggle('active');
  });

  elements.love.addEventListener('click', () => {
    addBotMessage('Ayyyo, heart attack! If Maya sees this, I will faint in cinematic slow motion. Two minutes silence for my respect.');
  });

  // Decline button logic
  if (elements.rejectCallButton) {
    elements.rejectCallButton.addEventListener('click', declineCall);
  }
  // Allow clicking the dark overlay (outside content) to decline/close as well
  if (elements.callPopup) {
    elements.callPopup.addEventListener('click', (e) => {
      // Only if the click target IS the overlay (not inner content)
      if (e.target === elements.callPopup) declineCall(e);
    });
  }
});

function triggerFakeCall() {
  if (!elements.callPopup || !elements.callerName || !elements.countdownTimer || !elements.rejectCallButton) return;
  if (isCallActive) return;
  isCallActive = true;

  // Disable input while the call is active
  if (elements.input) elements.input.disabled = true;
  if (elements.send) elements.send.disabled = true;

  const name = callers[Math.floor(Math.random() * callers.length)];
  elements.callerName.textContent = `${name} Calling...`;

  // Show popup, show reject button (for optional manual decline), reset timer
  elements.callPopup.classList.remove('hidden');
  elements.callPopup.setAttribute('aria-hidden', 'false');
  elements.rejectCallButton.classList.remove('hidden');

  // Start ringtone (catch autoplay restrictions quietly)
  try { ringtone.play().catch(() => {}); } catch {}

  // 10-second countdown then auto-decline
  let remaining = 10;
  elements.countdownTimer.textContent = String(remaining);
  if (callCountdownId) { clearInterval(callCountdownId); callCountdownId = null; }
  callCountdownId = setInterval(() => {
    remaining -= 1;
    elements.countdownTimer.textContent = String(Math.max(remaining, 0));
    if (remaining <= 0) {
      declineCall();
    }
  }, 1000);
}

function onClear() { showConfirm(); }

async function onSend() {
  const text = elements.input.value.trim();
  if (!text) return;
  if (isCallActive) return; // guard against sending during call

  addUserMessage(text);
  elements.input.value = '';

  // Trigger the fake call immediately after each question
  triggerFakeCall();

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
  // No longer trigger call here; it's tied to each question send
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