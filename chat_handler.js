// Sensei on my Side - Live Q&A Conversational Chat Handler

let liveChatSession = null; // Caches the active Prompt API Q&A session!

// Live Q&A study session chatbot prompt generators
async function sendLiveUserQuestion(displayText = null, actualPrompt = null) {
  const inputEl = document.getElementById('live-user-input');
  
  // If programmatically invoked with a custom prompt, displayText must be a string.
  const isCustom = typeof displayText === 'string';
  const userText = isCustom ? displayText : inputEl.value.trim();
  if (!userText) return;

  const container = document.getElementById('live-chat-history');

  if (container.innerHTML.includes('Ask Sensei')) {
    container.innerHTML = '';
  }

  // Render user bubble (keeping displayed text as-is)
  appendLiveChatMessage(container, 'user', 'You', userText, '#ffffff');
  inputEl.value = '';
  inputEl.disabled = true;

  // Append typing system notice
  appendLiveSystemMessage(container, 'Sensei is typing ... ⏳');

  try {
    const api = globalThis.LanguageModel || globalThis.ai?.languageModel;
    if (!api) throw new Error('Prompt API unconfigured.');

    const supportedLang = ['en', 'es', 'ja', 'de', 'fr'].includes(settings.motherTongue) ? settings.motherTongue : 'en';
    const motherLangLabel = LANGUAGE_MAP[settings.motherTongue] || 'Japanese';
    const learnLangLabel = LANGUAGE_MAP[settings.learningLanguage || 'en'] || 'English';

    const senseiPersonality = settings.customPersonality
        ? `Eiko-sensei's Sensei Personality constraint: ${settings.customPersonality}. You MUST strictly embody, speak, acts, and represent yourself in accordance with this custom personality description.`
        : '';

    const systemPrompt = `Your name is Eiko-sensei. You are the learning coach. The user is the student. The student's nickname/name is ${settings.userName || 'You'}. You must NEVER call the user "Eiko"—Eiko is YOUR name. Address them directly by their name ${settings.userName || 'You'} warmly. You are Sensei on my Side, an encouraging ${learnLangLabel} learning coach. ${senseiPersonality} The user is targeting TOEIC/proficiency level ${settings.level} and speaking mother tongue ${motherLangLabel}.
Please answer the user's question about the vocabulary words, idioms, or selected text. Hold yourself to a highly helpful, patient, and simple primary school level explanation. Keep your replies under 3 sentences, in the learning language (${learnLangLabel}), with simple translation into ${motherLangLabel} inside brackets or details.`;

    if (!liveChatSession) {
      liveChatSession = await api.create({
        expectedInputs: [{ type: 'text', languages: [supportedLang] }],
        expectedOutputs: [{ type: 'text', languages: [supportedLang] }],
        initialPrompts: [{ role: 'system', content: systemPrompt }]
      });
    }

    // Safe messaging check context
    const promptStr = (isCustom && typeof actualPrompt === 'string')
        ? actualPrompt
        : (pageText ? `Webpage content for context:\n${pageText}\n\nUser question: ${userText}` : userText);

    if (container.lastChild && container.lastChild.classList.contains('system')) {
      container.lastChild.remove();
    }

    const bubble = appendLiveChatMessage(container, 'ai', 'Sensei', '...', '#f0fdf4');
    const capsuleEl = bubble.querySelector('.speaker-capsule');
    const coachEmoji = getLevelBadge(settings.level).split(' ').pop();
    
    // Dynamic emoji loop: 'working / sweat' thinking state visual cycles
    let toggleState = true;
    const emojiInterval = setInterval(() => {
      if (capsuleEl) {
        capsuleEl.textContent = `Sensei ${toggleState ? '💭' : '💦'}`;
        toggleState = !toggleState;
      }
    }, 400);

    let fullText = '';
    try {
      const stream = liveChatSession.promptStreaming(promptStr);
      for await (const chunk of stream) {
        if (chunk.startsWith(fullText)) {
          fullText = chunk;
        } else {
          fullText += chunk;
        }
        const escapedChunk = fullText
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
        bubble.querySelector('.chat-msg').innerHTML = escapedChunk.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        container.scrollTop = container.scrollHeight;
      }

      if (settings.alwaysReadQA !== false && fullText) {
        speakText(fullText, getTTSLanguageCode());
      }
    } finally {
      clearInterval(emojiInterval);
    }
    
    // Transition to 'happy' then back to 'idle/calm'
    if (capsuleEl) {
      capsuleEl.textContent = 'Sensei ✨';
      setTimeout(() => {
        capsuleEl.textContent = `Sensei ${coachEmoji}`;
      }, 2000);
    }

  } catch (e) {
    console.error('Q&A failed:', e);
    if (container.lastChild && container.lastChild.classList.contains('system')) {
      container.lastChild.remove();
    }
    appendLiveSystemMessage(container, `Typing failed: ${e.message || e.toString()}`);
  } finally {
    inputEl.disabled = false;
    inputEl.focus();
  }
}

// Processes selection text dynamically sent from the context menu
async function handleSelectedTextCoaching(selectedText) {
  const inputEl = document.getElementById('live-user-input');
  const chatCard = document.getElementById('live-chat-card');
  
  if (!inputEl) return;
  
  // Unblock input if deactivated
  inputEl.disabled = false;
  const btnSend = document.getElementById('live-send-btn');
  if (btnSend) btnSend.disabled = false;

  // Smoothly scroll the Q&A card into view!
  if (chatCard) {
    chatCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Trigger visual flash highlights on Q&A card header
    chatCard.classList.remove('card-flash');
    void chatCard.offsetWidth; // Trigger reflow
    chatCard.classList.add('card-flash');
  }

  console.log('🤖 Live Q&A: Auto-sending highlighted text coaching request...');
  
  const motherLangLabel = LANGUAGE_MAP[settings.motherTongue] || 'Japanese';
  const learnLangLabel = LANGUAGE_MAP[settings.learningLanguage || 'en'] || 'English';
  
  // Heuristics: count words to assess if selection is a single word or short phrase (1-3 words)
  const wordCount = selectedText.trim().split(/\s+/).length;
  const isShortSelection = wordCount <= 3 && selectedText.length < 30;
  
  let actualPrompt = '';
  if (isShortSelection) {
    actualPrompt = `I have highlighted a specific word or short phrase:
"${selectedText}"

Please provide a targeted language lesson for this entry:
1. Its precise definition or meaning explained in ${motherLangLabel}.
2. At least 2 alternative synonyms or related words/phrases in ${learnLangLabel}.
3. 2 practical, realistic example sentences in ${learnLangLabel} illustrating its usage.`;
  } else {
    actualPrompt = `I have selected this text:
"${selectedText}"

Please provide the following:
1. A 3-line summary (numbered 1, 2, and 3) written in TOEIC level ${settings.level} ${learnLangLabel}.
2. 2 key vocabulary words with definitions explained in ${motherLangLabel}.
3. 2 key idioms/phrases with explanations in ${motherLangLabel}.`;
  }

  // Execute Q&A session automatically passing the original selected text for display and the custom prompt
  await sendLiveUserQuestion(selectedText, actualPrompt);
  
  // Safely clear the select buffer
  if (chrome && chrome.storage && chrome.storage.local) {
    await chrome.storage.local.remove('selectedTextBuffer');
  }
}

function updateLiveChatPlaceholder() {
  const input = document.getElementById('live-user-input');
  if (!input) return;
  const motherLangLabel = LANGUAGE_MAP[settings.motherTongue] || 'Japanese';
  const learnLangLabel = LANGUAGE_MAP[settings.learningLanguage || 'en'] || 'English';
  
  if (chrome.i18n) {
    input.placeholder = chrome.i18n.getMessage("chatPlaceholder", [learnLangLabel, motherLangLabel]) || `Ask Sensei anything in ${learnLangLabel} (will translate to ${motherLangLabel})...`;
  } else {
    input.placeholder = `Ask Sensei anything in ${learnLangLabel} (will translate to ${motherLangLabel})...`;
  }
}

// Live Chat speech rendering
function appendLiveChatMessage(container, sender, senderName, text, color, shouldSave = true) {
  const block = document.createElement('div');
  block.className = `chat-block ${sender}`;
  block.style.display = 'flex';
  block.style.flexDirection = 'column';
  block.style.maxWidth = '85%';
  block.style.width = 'fit-content';
  
  if (sender === 'user') {
    block.style.alignSelf = 'flex-end';
  } else {
    block.style.alignSelf = 'flex-start';
  }

  const headerRow = document.createElement('div');
  headerRow.style.display = 'flex';
  headerRow.style.alignItems = 'center';
  headerRow.style.gap = '6px';
  headerRow.style.marginBottom = '2px';
  if (sender === 'user') {
    headerRow.style.justifyContent = 'flex-end';
    headerRow.style.alignSelf = 'flex-end';
  } else {
    headerRow.style.justifyContent = 'flex-start';
    headerRow.style.alignSelf = 'flex-start';
  }

  const capsule = document.createElement('span');
  capsule.className = 'speaker-capsule';
  capsule.style.backgroundColor = color || '#e7e5e4';
  
  if (sender === 'user') {
    capsule.textContent = settings.userName || 'You';
    capsule.style.backgroundColor = '#ffffff';
    capsule.style.color = '#78716c';
  } else {
    capsule.textContent = senderName;
    
    const iconImg = document.createElement('img');
    iconImg.src = 'img/icon16.png';
    iconImg.style.width = '14px';
    iconImg.style.height = '14px';
    iconImg.style.borderRadius = '2px';
    headerRow.appendChild(iconImg);
  }
  headerRow.appendChild(capsule);

  const msg = document.createElement('div');
  msg.className = `chat-msg ${sender}`;

  // Secure, lightweight inline bold markdown formatter
  if (text) {
    const escaped = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
    const formatted = escaped.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    msg.innerHTML = formatted;
  } else {
    msg.textContent = text;
  }

  if (sender === 'ai') {
    const playBtn = document.createElement('button');
    playBtn.className = 'tts-play-btn play-chat-btn';
    playBtn.title = 'Listen to Sensei';
    playBtn.textContent = '🔊 Listen';
    playBtn.style.height = '16px';
    playBtn.style.padding = '1px 6px';
    playBtn.style.fontSize = '9px';
    playBtn.style.borderRadius = '4px';
    playBtn.onclick = (e) => {
      e.stopPropagation();
      speakText(msg.textContent, getTTSLanguageCode());
    };
    headerRow.appendChild(playBtn);
  }

  block.appendChild(headerRow);

  // Stylize bubble inside CSS bounds
  msg.style.padding = '8px 12px';
  msg.style.borderRadius = '8px';
  msg.style.fontSize = '13.5px';
  msg.style.lineHeight = '1.45';
  msg.style.wordBreak = 'break-word';
  msg.style.whiteSpace = 'pre-wrap';
  msg.style.boxSizing = 'border-box';
  msg.style.width = '100%';

  if (sender === 'user') {
    msg.style.backgroundColor = 'var(--accent-color)';
    msg.style.color = '#ffffff';
    msg.style.borderTopRightRadius = '1px';
  } else {
    msg.style.backgroundColor = '#ffffff';
    msg.style.color = 'var(--text-color)';
    msg.style.border = '1px solid var(--border-color)';
    msg.style.borderTopLeftRadius = '1px';
  }
  block.appendChild(msg);

  container.appendChild(block);
  container.scrollTop = container.scrollHeight;

  if (shouldSave) saveChatHistory();
  return block;
}

function appendLiveSystemMessage(container, text, shouldSave = true) {
  if (container.lastChild && container.lastChild.classList.contains('system')) {
    container.lastChild.remove();
  }
  const msg = document.createElement('div');
  msg.className = 'chat-msg system';
  msg.textContent = text;
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;

  if (shouldSave) saveChatHistory();
  return msg;
}

// Serializes current visible chat panel history to chrome.storage
async function saveChatHistory() {
  const container = document.getElementById('live-chat-history');
  if (!container) return;
  
  const historyList = [];
  container.childNodes.forEach(node => {
    if (node.classList && node.classList.contains('chat-block')) {
      const msgEl = node.querySelector('.chat-msg');
      const speakerEl = node.querySelector('.speaker-capsule');
      if (msgEl && speakerEl) {
        const type = 'msg';
        const sender = node.classList.contains('user') ? 'user' : 'ai';
        const senderName = speakerEl.textContent.replace(/💭|💦|✨/g, '').trim(); // strip animation emojis!
        const text = msgEl.textContent;
        const color = speakerEl.style.backgroundColor;
        historyList.push({ type, sender, senderName, text, color });
      }
    } else if (node.classList && node.classList.contains('chat-msg') && node.classList.contains('system')) {
      historyList.push({ type: 'system', text: node.textContent });
    }
  });
  
  // Retain only last 30 entries to stay under quota limits
  const pruned = historyList.slice(-30);
  if (chrome && chrome.storage && chrome.storage.local) {
    chrome.storage.local.set({ chatHistory: pruned }, () => {
      console.log('💾 Chat history saved successfully. Count:', pruned.length);
    });
  }
}

// Deserializes and restores chat logs on startup
async function loadChatHistory() {
  const container = document.getElementById('live-chat-history');
  if (!container) return;
  
  if (chrome && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(['chatHistory'], (result) => {
      if (result && result.chatHistory && Array.isArray(result.chatHistory)) {
        // Clear default placeholder if history exists
        container.innerHTML = '';
        
        result.chatHistory.forEach(item => {
          if (item.type === 'msg') {
            appendLiveChatMessage(container, item.sender, item.senderName, item.text, item.color, false);
          } else if (item.type === 'system') {
            appendLiveSystemMessage(container, item.text, false);
          }
        });
        console.log('💾 Restored past chat conversation logs. Cards loaded:', result.chatHistory.length);
        
        // Force instant scroll to the bottom so modern conversational options and the last reply are instantly visible!
        setTimeout(() => {
          container.scrollTop = container.scrollHeight;
        }, 50);
      }
    });
  }
}

// Trigger active history restoration on extension boot
setTimeout(() => {
  loadChatHistory();
}, 350);

// Exports dynamic session clearance hook for orchestrator settings updates
function clearChatSession() {
  liveChatSession = null;
  console.log('🧹 Chat Session cached handler cleared successfully.');
}

async function triggerQuizIncorrectCoaching(qNum, questionText, selectedText, correctText) {
  const container = document.getElementById('live-chat-history');
  if (!container) return;

  // Unpack chat placeholders
  if (container.innerHTML.includes('Ask Sensei')) {
    container.innerHTML = '';
  }

  // 1. Smoothly scroll Q&A card into view & trigger tab highlight glow
  const chatCard = document.getElementById('live-chat-card');
  if (chatCard) {
    chatCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    chatCard.classList.remove('card-flash');
    void chatCard.offsetWidth; // Trigger reflow
    chatCard.classList.add('card-flash');
  }

  // 2. Append user request bubble
  appendLiveChatMessage(container, 'user', 'You', `Oops! I answered Quiz Question #${qNum} incorrectly. 🥺`, '#ffffff');

  // 3. Append Sensei thinking bubble
  const bubble = appendLiveChatMessage(container, 'ai', 'Sensei', '...', '#f0fdf4');
  const capsuleEl = bubble.querySelector('.speaker-capsule');
  const coachEmoji = getLevelBadge(settings.level).split(' ').pop();

  let toggleState = true;
  const emojiInterval = setInterval(() => {
    if (capsuleEl) {
      capsuleEl.textContent = `Sensei ${toggleState ? '💭' : '💦'}`;
      toggleState = !toggleState;
    }
  }, 400);

  try {
    const api = globalThis.LanguageModel || globalThis.ai?.languageModel;
    if (!api) throw new Error('Prompt API unconfigured.');

    const supportedLang = ['en', 'es', 'ja', 'de', 'fr'].includes(settings.motherTongue) ? settings.motherTongue : 'en';
    const motherLangLabel = LANGUAGE_MAP[settings.motherTongue] || 'Japanese';
    const learnLangLabel = LANGUAGE_MAP[settings.learningLanguage || 'en'] || 'English';

    const systemPrompt = `Your name is Eiko-sensei. You are the learning coach. The user is the student. The student's nickname/name is ${settings.userName || 'You'}. You must NEVER call the user "Eiko"—Eiko is YOUR name. Address them directly by their name ${settings.userName || 'You'} warmly. You are Sensei on my Side, an encouraging ${learnLangLabel} learning coach explaining reading comprehension errors. Mother tongue of user is ${motherLangLabel}.`;
    
    const senseiPersonality = settings.customPersonality
        ? `Eiko-sensei Personality guidelines: ${settings.customPersonality}.`
        : '';

    const queryText = `Webpage scraped text:
---
${pageText}
---
Question #${qNum}: "${questionText}"
User chose this INCORRECT choice: "${selectedText}"
The CORRECT choice is: "${correctText}"

${senseiPersonality} Please generate a friendly, encouraging 2-3 sentence coaching response. Explain precisely WHY their choice is incorrect based on the webpage details, and WHY the correct choice is right. Explain simply in ${learnLangLabel}, with key vocabulary translated into ${motherLangLabel} inside brackets.`;

    if (!liveChatSession) {
      liveChatSession = await api.create({
        expectedInputs: [{ type: 'text', languages: [supportedLang] }],
        expectedOutputs: [{ type: 'text', languages: [supportedLang] }],
        initialPrompts: [{ role: 'system', content: systemPrompt }]
      });
    }

    let fullText = '';
    const stream = liveChatSession.promptStreaming(queryText);
    for await (const chunk of stream) {
      if (chunk.startsWith(fullText)) {
        fullText = chunk;
      } else {
        fullText += chunk;
      }
      
      // Update bubble securely with bold tags support
      const escapedChunk = fullText
        .replace(/&/g, "&amp;")
        .replace(/--/g, "—")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
      bubble.querySelector('.chat-msg').innerHTML = escapedChunk.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      container.scrollTop = container.scrollHeight;
    }

    if (settings.alwaysReadQA !== false && fullText) {
      speakText(fullText, getTTSLanguageCode());
    }

  } catch (e) {
    console.error('Quiz coaching failed:', e);
    bubble.querySelector('.chat-msg').textContent = `Oh! I ran into an issue analyzing your mistake: ${e.message || e.toString()}`;
  } finally {
    clearInterval(emojiInterval);
    if (capsuleEl) {
      capsuleEl.textContent = `Sensei ${coachEmoji}`;
    }
  }
}
