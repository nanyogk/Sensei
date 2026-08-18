// Sensei on my Side - Sleek Coordination Core & Bootstrap


// Prepared lists of 25 gamified, RPG-themed on-device AI coaching status headers
const COACHING_STATUSES = [
  '🤓 Reading dictionary...',
  '🎒 Sharpening learning pencils...',
  '📚 Compiling English verbs...',
  '🧠 Charging Nano neurons...',
  '🧙‍♂️ Invoking pristine syntax spells...',
  '🍵 Sipping hot green tea for focus...',
  '✍️ Designing graded vocabulary...',
  '🎮 Spawning grammar slimes...',
  '🎲 Rolling D20 for TOEIC stats...',
  '📜 Deciphering ancient syntax scrolls...',
  '🤖 Running local AI parameters...',
  '⚡ Chasing offline Gemini particles...',
  '💼 Re-organizing English syllabus...',
  '🕵️ Analyzing webpage vocabulary...',
  '🦉 Wisdom power levels rising...',
  '🎯 Locking in on target score...',
  '🧗 Scaling language mountains...',
  '🍕 Fueling brain with spelling treats...',
  '🌟 Polishing grammar study stars...',
  '🧩 Fitting reading quiz pieces...',
  '🔑 Unlocking hidden lexicon secrets...',
  '🚀 Firing local inference modules...',
  '🎤 Practicing vocal pronunciations...',
  '🌈 Drafting beautiful summaries...',
  '🎮 Evolving Eiko-sensei avatar...'
];

console.log('Sensei on my Side: Decoupled Coordination Core starting...');

document.addEventListener('DOMContentLoaded', async () => {
  console.log('Sensei on my Side: DOMContentLoaded bootstrap started...');
  
  // Instantly randomize Eiko's idle card layout placeholders unconditionally on boot!
  if (typeof randomizeIdleCardMessages === 'function') randomizeIdleCardMessages();
  try {
    console.log('1. settings-io: loadSettings starting...');
    await loadSettings();
    console.log('1. settings-io: loadSettings completed successfully. Active config:', settings);
    
    const appNameEl = document.getElementById('app-name');
    if (appNameEl && chrome.i18n) {
      appNameEl.textContent = chrome.i18n.getMessage("extName") || "Sensei on my Side";
    }
    
    // Synchronize conversational option chips dynamically based on active target language selections
    if (typeof updateDynamicUiLanguages === 'function') {
      updateDynamicUiLanguages();
    }

    updateLiveChatPlaceholder();
    updateAnalyzeButtonLabel();
    if (typeof updateNewsButtonLabel === 'function') updateNewsButtonLabel();
  } catch (errSettings) {
    console.error('1. settings-io: loadSettings failed:', errSettings);
  }

  // Bind visual controls (Slider Range + Modal decoupled inside settings_manager.js)
  try {
    initializeSettingsUIListeners();
  } catch (errSelectors) {
    console.error('2. binders: Settings UI initialization failed:', errSelectors);
  }

  // Check model capabilities status
  try {
    console.log('3. diagnostics: checkApiAvailability starting...');
    checkApiAvailability();
    console.log('3. diagnostics: checkApiAvailability complete.');
    
    console.log('4. diagnostics: updateModelStatus starting...');
    updateModelStatus();
    console.log('4. diagnostics: updateModelStatus async thread fired in background.');
  } catch (errApi) {
    console.warn('Model availability verification bypassed:', errApi);
  }

  // Load Manifest Version dynamically in visual header
  try {
    const manifest = chrome.runtime.getManifest();
    const versionEl = document.getElementById('app-version');
    if (versionEl && manifest && manifest.version) {
      versionEl.textContent = 'v' + manifest.version;
      console.log('5. manifest: version loaded dynamically from manifest:', manifest.version);
    }
  } catch (errManifest) {
    console.warn('Manifest version load bypassed:', errManifest);
  }

  // Actions bindings and Drag & Drop Modules customizers
  try {
    console.log('6. binders: Registering action click handlers, more selectors, and drag managers...');
    const btnAnalyze = document.getElementById('analyze-btn');
    if (btnAnalyze) {
      btnAnalyze.addEventListener('click', runEnglishCoachingSession);
      console.log('🏆 [analyze-btn] click listener bound! (Start Coaching)');
    }

    const btnQuickCoach = document.getElementById('quick-coach-btn');
    if (btnQuickCoach) {
      btnQuickCoach.classList.add('pulse-grow-reminder'); // Pulse on load as nudge!
      btnQuickCoach.addEventListener('click', async () => {
        btnQuickCoach.classList.remove('pulse-grow-reminder'); // Turn off pulse immediately
        btnQuickCoach.disabled = true;
        btnQuickCoach.style.opacity = '0.5';
        
        const container = document.getElementById('live-chat-history');
        if (container) {
          if (container.innerHTML.includes('Ask Sensei')) {
            container.innerHTML = '';
          }
          appendLiveChatMessage(container, 'user', 'You', 'Coach me about this page! 📖', '#ffffff');
        }
        
        await runEnglishCoachingSession();
        
        btnQuickCoach.disabled = false;
        btnQuickCoach.style.opacity = '1';
      });
      console.log('🏆 [quick-coach-btn] click listener bound!');
    }

    const btnNews = document.getElementById('news-btn');
    if (btnNews) {
      btnNews.addEventListener('click', () => {
        const targetUrl = buildGoogleNewsUrl();
        chrome.tabs.query({ url: '*://news.google.com/*', currentWindow: true }, (tabs) => {
          if (tabs && tabs.length > 0) {
            // Found Google News tab in current window! Re-focus and sync it
            const targetTab = tabs[0];
            chrome.tabs.update(targetTab.id, { active: true, url: targetUrl });
            console.log(`🏆 Tab Recycling: Focused existing Google News tab in current window under edition: ${settings.newsGeo}`);
          } else {
            chrome.tabs.create({ url: targetUrl });
            console.log(`🚀 Tab Recycling: Opened fresh Google News tab under edition: ${settings.newsGeo}`);
          }
        });
      });
      console.log('🏆 [news-btn] click listener bound! (Open & Recycle English Google News)');
    }

    // 6b. Dual-binders to Vocabulary and Expressions Footer Decks
    const vPrev = document.getElementById('vocab-deck-prev-btn');
    const iPrev = document.getElementById('idiom-deck-prev-btn');
    const vNext = document.getElementById('vocab-deck-next-btn');
    const iNext = document.getElementById('idiom-deck-next-btn');
    const vShuf = document.getElementById('vocab-deck-random-btn');
    const iShuf = document.getElementById('idiom-deck-random-btn');

    const handleTriggerPrev = () => {
      if (historyPointer > 0) {
        historyPointer--;
        loadCardIntoView(cardHistory[historyPointer]);
        updateDeckNavigationButtons();
        console.log('◀ Footer: Prev card loaded. Pointer:', historyPointer);
      }
    };

    const handleTriggerNext = () => {
      if (historyPointer < cardHistory.length - 1) {
        historyPointer++;
        loadCardIntoView(cardHistory[historyPointer]);
        updateDeckNavigationButtons();
        console.log('▶ Footer: Next card loaded from session history. Pointer:', historyPointer);
      } else if (cardsList.length > 0) {
        const randIdx = Math.floor(Math.random() * cardsList.length);
        const randCard = cardsList[randIdx];
        cardHistory.push(randCard);
        historyPointer = cardHistory.length - 1;
        loadCardIntoView(randCard);
        updateDeckNavigationButtons();
        console.log('🎲 Footer: Shuffled and loaded a random card from past database!');
      }
    };

    const handleTriggerShuf = () => {
      if (cardsList.length > 0) {
        const randIdx = Math.floor(Math.random() * cardsList.length);
        const randCard = cardsList[randIdx];
        cardHistory.push(randCard);
        historyPointer = cardHistory.length - 1;
        loadCardIntoView(randCard);
        updateDeckNavigationButtons();
        console.log('🎲 Footer: Explicitly shuffled a random card from past database!');
      } else {
        generateIdleStudyCard();
      }
    };

    [vPrev, iPrev].forEach(btn => btn && btn.addEventListener('click', handleTriggerPrev));
    [vNext, iNext].forEach(btn => btn && btn.addEventListener('click', handleTriggerNext));
    [vShuf, iShuf].forEach(btn => btn && btn.addEventListener('click', handleTriggerShuf));

    const btnMoreVocab = document.getElementById('more-vocab-btn');
    if (btnMoreVocab) {
      btnMoreVocab.addEventListener('click', async () => {
        const container = document.getElementById('live-chat-history');
        if (container) {
          if (container.innerHTML.includes('Ask Sensei')) {
            container.innerHTML = '';
          }
          appendLiveChatMessage(container, 'user', 'You', 'Give me more vocabulary words from this page! ➕', '#ffffff');
          appendLiveSystemMessage(container, 'Sensei is extracting additional graded vocabulary words... ⏳');
        }
        await queryMoreVocabulary();
      });
      console.log('🏆 [more-vocab-btn] click listener bound! (Unified Chat option)');
    }

    const btnMoreIdioms = document.getElementById('more-idioms-btn');
    if (btnMoreIdioms) {
      btnMoreIdioms.addEventListener('click', async () => {
        const container = document.getElementById('live-chat-history');
        if (container) {
          if (container.innerHTML.includes('Ask Sensei')) {
            container.innerHTML = '';
          }
          appendLiveChatMessage(container, 'user', 'You', 'Give me more idioms/expressions from this page! ➕', '#ffffff');
          appendLiveSystemMessage(container, 'Sensei is gathering additional conversational idioms... ⏳');
        }
        await queryMoreIdioms();
      });
      console.log('🏆 [more-idioms-btn] click listener bound! (Unified Chat option)');
    }

    const btnLiveSend = document.getElementById('live-send-btn');
    const inputLive = document.getElementById('live-user-input');
    if (btnLiveSend) {
      btnLiveSend.addEventListener('click', sendLiveUserQuestion);
      console.log('🏆 [live-send-btn] click listener bound!');
    }
    if (inputLive) {
      inputLive.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendLiveUserQuestion();
      });
      console.log('🏆 [live-user-input] keypress listener bound!');
    }



    // Bind Module Active/Inactive Toggles dynamically
    const moduleToggles = document.querySelectorAll('.module-toggle');
    moduleToggles.forEach(toggle => {
      toggle.addEventListener('change', (e) => {
        const cardId = e.target.dataset.id;
        const cardEl = document.getElementById(cardId);
        if (cardEl) {
          if (e.target.checked) {
            cardEl.classList.remove('disabled-card');
            console.log(`🏆 Module ${cardId} toggled: ACTIVE 🟢`);
          } else {
            cardEl.classList.add('disabled-card');
            console.log(`🏆 Module ${cardId} toggled: INACTIVE ⚪`);
          }
        }
      });
    });
    console.log('🏆 Module Active/Inactive status switches initialized.');
  } catch (errControls) {
    console.error('Action/Drag binders registration failed:', errControls);
  }

  // 7. Secure tab navigation observers checks to re-enable Analyze button on page changes!
  if (chrome && chrome.tabs) {
    try {
      if (chrome.tabs.onUpdated) {
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
          if (changeInfo.status === 'complete' && tab && tab.url) {
            // Flash quick coach chip to nudge user to analyze new page!
            const btnQuickCoach = document.getElementById('quick-coach-btn');
            if (btnQuickCoach) {
              btnQuickCoach.classList.add('pulse-grow-reminder');
              console.log('🏆 [quick-coach-btn] dynamic pulse active on tab URL changes!');
            }
            const btnAnalyze = document.getElementById('analyze-btn');
            if (btnAnalyze && btnAnalyze.disabled && btnAnalyze.textContent.includes('Finished')) {
              btnAnalyze.disabled = false;
              updateAnalyzeButtonLabel();
            }
          }
        });
      }

      if (chrome.tabs.onActivated) {
        chrome.tabs.onActivated.addListener(async (activeInfo) => {
          if (activeInfo && activeInfo.tabId) {
            try {
              const tab = await chrome.tabs.get(activeInfo.tabId);
              if (tab && tab.url) {
                // Flash quick coach chip to nudge user to analyze new active focus!
                const btnQuickCoach = document.getElementById('quick-coach-btn');
                if (btnQuickCoach) {
                  btnQuickCoach.classList.add('pulse-grow-reminder');
                  console.log('🏆 [quick-coach-btn] dynamic pulse active on tab focus activations!');
                }
                const btnAnalyze = document.getElementById('analyze-btn');
                if (btnAnalyze && btnAnalyze.disabled && btnAnalyze.textContent.includes('Finished')) {
                  btnAnalyze.disabled = false;
                  updateAnalyzeButtonLabel();
                }
              }
            } catch (e) {}
          }
        });
      }
    } catch (errTabs) {
      console.warn('Chrome tabs event bindings bypassed:', errTabs);
    }
  }

  // Bind runtime message listener for context selection coaching triggers safely
  if (chrome && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((message) => {
      if (message && message.type === 'SELECT_TEXT_NAV' && message.text) {
        console.log('🏆 Received live selected text trigger:', message.text);
        handleSelectedTextCoaching(message.text);
      }
    });
  }

  // Initial Deck Boot - dynamic idle generation on completely empty database
  setTimeout(async () => {
    // Check storage buffer on startup for any un-processed selection text from context menu
    if (chrome && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['selectedTextBuffer'], (result) => {
        if (result && result.selectedTextBuffer) {
          console.log('🏆 Found cached highlight text buffer on startup:', result.selectedTextBuffer);
          handleSelectedTextCoaching(result.selectedTextBuffer);
          return;
        }
      });
    }

    if (cardsList.length > 0) {
      const startupCard = cardsList[cardsList.length - 1];
      cardHistory = [startupCard];
      historyPointer = 0;
      loadCardIntoView(startupCard);
      updateDeckNavigationButtons();
      console.log('🎓 Initial Deck: Loaded latest study card from local storage!');
    } else {
      console.log('🎓 Initial Deck: Database is empty. Randomizing unpopulated card placeholders...');
      randomizeIdleCardMessages();
    }
  }, 450);

  console.log('Sensei on my Side: DOMContentLoaded bootstrap successfully complete! 🎉');
});

// Verify Prompt API
function checkApiAvailability() {
  const warningBanner = document.getElementById('api-warning');
  const analyzeBtn = document.getElementById('analyze-btn');
  if (!globalThis.LanguageModel && !globalThis.ai?.languageModel) {
    warningBanner.style.display = 'block';
    warningBanner.style.lineHeight = '1.5';
    warningBanner.style.padding = '10px 14px';
    warningBanner.style.fontSize = '11px';
    warningBanner.innerHTML = `
      <strong>⚠️ On-Device AI Coach is preparing!</strong><br>
      To load Sensei, please ensure these browser configurations are turned on:<br>
      1. Open a tab to <code>chrome://flags</code><br>
      2. Enable <strong>#prompt-api-for-gemini-nano</strong><br>
      3. Enable <strong>#optimization-guide-on-device-model</strong> (set status to <em>Enabled BypassPrefRequirement</em>)<br>
      4. Relaunch Chrome, visit <code>chrome://components</code>, and click <strong>Check for update</strong> next to <em>Optimization Guide On Device Model</em> to download Eiko's offline brain!
    `;
    if (analyzeBtn) analyzeBtn.disabled = true;
    console.warn('LanguageModel Prompt API is not available in this browser context.');
  } else {
    warningBanner.style.display = 'none';
    if (analyzeBtn) analyzeBtn.disabled = false;
  }
}

// Dynamically check on-device AI status
async function updateModelStatus() {
  const statusEl = document.getElementById('model-status-text');
  if (!statusEl) return;

  const api = globalThis.LanguageModel || globalThis.ai?.languageModel;
  if (!api) {
    statusEl.textContent = 'UNAVAILABLE ❌';
    statusEl.className = 'system-badge status-error';
    statusEl.style.color = '#dc2626';
    return;
  }

  statusEl.textContent = 'Checking API... ⏳';

  try {
    // 800ms safe timeout race to prevent FUSE/virtualization startup freezes
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), 800)
    );

    const supportedLang = ['en', 'es', 'ja', 'de', 'fr'].includes(settings.motherTongue) ? settings.motherTongue : 'en';

    const checkPromise = (async () => {
      if (typeof api.availability === 'function') {
        try {
          return await api.availability({
            expectedInputs: [{ type: 'text', languages: [supportedLang] }],
            expectedOutputs: [{ type: 'text', languages: [supportedLang] }]
          });
        } catch (e) {
          return await api.availability();
        }
      } else if (typeof api.capabilities === 'function') {
        const caps = await api.capabilities();
        return caps ? 'readily' : 'unavailable';
      }
      return 'readily';
    })();

    const availability = await Promise.race([checkPromise, timeoutPromise]);

    let extraDetails = '';
    try {
      const capsObj = typeof api.capabilities === 'function' ? await api.capabilities() : null;
      if (capsObj) {
        console.log('🛠️ Prompt API capabilities properties detected:', capsObj);
        if (capsObj.modelName) {
          extraDetails = ` (${capsObj.modelName})`;
        } else if (capsObj.version) {
          extraDetails = ` (Nano v${capsObj.version})`;
        } else if (capsObj.onDeviceModelVersion) {
          extraDetails = ` (v${capsObj.onDeviceModelVersion})`;
        }
      }
      // Console log the actual offline chronos paths for our Googler developer!
      console.log('ℹ️ OptGuideOnDeviceModel Component Path Context:');
      console.log('  - Chromebook: /home/chronos/LocalState or /home/chronos/OptGuideOnDeviceModel/');
      console.log('  - Linux workstation: ~/.config/google-chrome/component_source/OptimizationGuideOnDeviceModel/');
    } catch (errCaps) {
      console.warn('Metadata inspection skipped:', errCaps);
    }

    if (availability === 'readily' || availability === 'available') {
      statusEl.textContent = `READY 🟢${extraDetails || ' (Gemini Nano)'}`;
      statusEl.style.color = '#059669';
    } else if (availability === 'downloading') {
      statusEl.textContent = 'DOWNLOADING ⏳';
      statusEl.style.color = '#d97706';
    } else if (availability === 'downloadable') {
      statusEl.textContent = 'DOWNLOADABLE 📥';
      statusEl.style.color = '#2563eb';
    } else {
      statusEl.textContent = 'UNAVAILABLE ❌';
      statusEl.style.color = '#dc2626';
    }
  } catch (err) {
    console.warn('Availability check failed, using fallback:', err);
    statusEl.textContent = 'READY 🟢 (Gemini Nano)';
    statusEl.style.color = '#059669';
  }
}

// Detect language robustly using high-precision local browser AI CLD/TFLite detector, falling back to extension chrome.tabs API offline Failsafe
async function detectScrapedTextLanguage(text) {
  // 1. Try modern Chrome Built-in AI Translation/Language Detection API (Chrome 130+)
  try {
    const aiDetectorApi = globalThis.ai?.languageDetector || globalThis.translation;
    if (aiDetectorApi && typeof aiDetectorApi.createDetector === 'function') {
      const detector = await aiDetectorApi.createDetector();
      const results = await detector.detect(text.substring(0, 1500)); // Probe first 1500 chars for ultra-speed!
      if (results && results.length > 0) {
        const bestMatch = results[0].detectedLanguage;
        console.log(`🤖 Chrome AI Language Detector: matched '${bestMatch}' (Confidence: ${results[0].confidence})`);
        return bestMatch;
      }
    }
  } catch (e) {
    console.warn('Chrome translation.createDetector bypassed:', e);
  }

  // 2. Legacy Failsafe: Chrome Tabs native offline language recognition
  try {
    const tabLang = await new Promise((resolve) => {
      chrome.tabs.detectLanguage(null, (lang) => resolve(lang || 'en'));
    });
    console.log(`🌐 Fallback: tab native language matched '${tabLang}'`);
    return tabLang;
  } catch (e) {
    console.warn('chrome.tabs.detectLanguage failed:', e);
  }

  return 'en';
}

// Trigger Graded Prompts and Single-Call JSON parse compilation
async function runEnglishCoachingSession() {
  const analyzeBtn = document.getElementById('analyze-btn');
  const submitQuizBtn = document.getElementById('submit-quiz-btn');

  let summaryData = null;
  let vocabData = null;
  let idiomData = null;

  let activeTabTitle = 'this page';
  let activeTabUrl = 'Random (Gen)';
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
      if (tab.title) activeTabTitle = `"${tab.title}"`;
      if (tab.url) activeTabUrl = tab.url;
    }
  } catch (errTab) {
    console.warn('Failed to query active tab details:', errTab);
  }

  // Disable quiz submission on session start
  if (submitQuizBtn) {
    submitQuizBtn.disabled = true;
  }

  // Reset previous card contents to simple, highly friendly queued states
  ['words-card', 'expressions-card', 'quiz-card'].forEach(id => {
    const card = document.getElementById(id);
    if (card) card.classList.add('unpopulated');
  });

  document.getElementById('words-list').innerHTML = '<p style="color: #78716c; font-style: italic; margin: 4px 0;">Queued: Waiting for vocabulary words to load... ⏳</p>';
  document.getElementById('expressions-list').innerHTML = '<p style="color: #78716c; font-style: italic; margin: 4px 0;">Queued: Waiting for conversational expressions to build... ⏳</p>';
  document.getElementById('quiz-list').innerHTML = '<p style="color: #78716c; font-style: italic; margin: 4px 0;">Queued: Waiting for comprehension quiz items... ⏳</p>';

  // Hide old scoreboard
  const scoreBanner = document.getElementById('quiz-score-banner');
  if (scoreBanner) {
    scoreBanner.className = 'score-banner hidden';
    scoreBanner.innerHTML = '';
  }

  const chatHistoryContainer = document.getElementById('live-chat-history');
  let senseiChatBubble = null;
  let senseiMsgEl = null;

  if (chatHistoryContainer) {
    if (chatHistoryContainer.innerHTML.includes('Ask Sensei')) {
      chatHistoryContainer.innerHTML = '';
    }
    senseiChatBubble = appendLiveChatMessage(chatHistoryContainer, 'ai', 'Sensei', `Let me analyze ${activeTabTitle} for you... 💭`, '#f0fdf4');
    if (senseiChatBubble) {
      senseiMsgEl = senseiChatBubble.querySelector('.chat-msg');
    }
  }

  const updateSenseiBubble = (text) => {
    if (senseiMsgEl) {
      const escapedStr = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
      senseiMsgEl.innerHTML = escapedStr.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      chatHistoryContainer.scrollTop = chatHistoryContainer.scrollHeight;
    }
  };

  let senseiCurriculumBubble = null;
  let curriculumMsgEl = null;

  const updateCurriculumBubble = (text) => {
    if (curriculumMsgEl) {
      const escapedStr = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
      curriculumMsgEl.innerHTML = escapedStr.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      chatHistoryContainer.scrollTop = chatHistoryContainer.scrollHeight;
    }
  };

  if (analyzeBtn) {
    analyzeBtn.disabled = true;
    analyzeBtn.classList.add('coaching-active');
  }
  let activeCoachingStep = 0;
  let currentStatusIdx = 0;
  const statusInterval = setInterval(() => {
    currentStatusIdx = (currentStatusIdx + 1) % COACHING_STATUSES.length;
    const currentStatusText = COACHING_STATUSES[currentStatusIdx];
    let stepStr = '';
    if (activeCoachingStep === 0) stepStr = '(Scraping page...)';
    else if (activeCoachingStep === 1) stepStr = '(Summary 1/4)';
    else if (activeCoachingStep === 2) stepStr = '(Words 2/4)';
    else if (activeCoachingStep === 3) stepStr = '(Idioms 3/4)';
    else if (activeCoachingStep === 4) stepStr = '(Quiz 4/4)';
    
    if (analyzeBtn) analyzeBtn.textContent = `${currentStatusText} ⏳ ${stepStr}`;
  }, 2000);
  if (analyzeBtn) analyzeBtn.textContent = 'Scraping webpage... ⏳';
  updateSenseiBubble(`Sensei is gathering page content for ${activeTabTitle}... ⏳`);

  let pageTextCleaned = '';
  try {
    pageText = await scrapeActivePageContent();
    pageTextCleaned = pageText ? pageText.trim() : '';
    
    // Pre-execution heuristics: robust check for bad fragments, TOC-only, blank, or random letters:
    if (!pageTextCleaned || pageTextCleaned.length < 80 || /^[0-9\s\W_]+$/.test(pageTextCleaned)) {
      throw new Error('The webpage has insufficient or invalid text content to coach you on.');
    }
  } catch (err) {
    clearInterval(statusInterval);
    if (analyzeBtn) {
      analyzeBtn.classList.remove('coaching-active');
      analyzeBtn.disabled = false;
    }
    updateAnalyzeButtonLabel();

    // Display the error conversationally inside the bubble!
    updateSenseiBubble(`🥺 **I'm sorry, I couldn't find valid content to summarize!**\n\nReason: ${err.message}\n\nPlease navigate to a text-rich article or page and let's try again! ✨`);
    return;
  }

  const motherLangLabel = LANGUAGE_MAP[settings.motherTongue] || 'Japanese';
  // Language check using high-accuracy Local AI detector with fallbacks to abort early if language matches user's native tongue
  const detectedLang = await detectScrapedTextLanguage(pageTextCleaned);
  const motherLangPrefix = settings.motherTongue.toLowerCase().split('-')[0];
  const detectedPrefix = detectedLang.toLowerCase().split('-')[0];
  
  let isMotherTonguePage = false;
  if (detectedPrefix === motherLangPrefix) {
    isMotherTonguePage = true;
  }

  const api = globalThis.LanguageModel || globalThis.ai?.languageModel;
  if (!api) {
    clearInterval(statusInterval);
    if (analyzeBtn) {
      analyzeBtn.classList.remove('coaching-active');
      analyzeBtn.disabled = false;
    }
    updateAnalyzeButtonLabel();
    if (chatHistoryContainer) {
      if (chatHistoryContainer.lastChild && chatHistoryContainer.lastChild.classList.contains('system')) {
        chatHistoryContainer.lastChild.remove();
      }
      appendLiveChatMessage(chatHistoryContainer, 'ai', 'Sensei', `🥺 Local language model (Gemini Nano) is not configured or enabled in your browser flags. Please visit chrome://flags and enable Prompt API!`, '#f0fdf4');
    } else {
      alert('Local language model is unconfigured. Check flags.');
    }
    return;
  }

  // Map local languages
  const learnLangLabel = LANGUAGE_MAP[settings.learningLanguage || 'en'] || 'English';
  const supportedLang = ['en', 'es', 'ja', 'de', 'fr'].includes(settings.motherTongue) ? settings.motherTongue : 'en';

  try {
    const baseSystemPrompt = `You are Sensei on my Side, a patient and encouraging ${learnLangLabel} learning coach.
The target language the user is learning is ${learnLangLabel}.
The user is targeting active TOEIC/proficiency level score ${settings.level}.
The user's mother tongue is ${motherLangLabel}. Graded vocabulary definitions and idiom meanings MUST be in ${motherLangLabel}.

CRITICAL JSON SYNTAX INSTRUCTION: In your output JSON payload, all string values (definitions, idioms, sentences, examples) MUST be strictly enclosed in standard half-width double quotes (\"). You MUST NEVER use Japanese corner brackets (「 」) or semicolons (;) inside key-value mappings in place of double quotes or commas. All JSON syntax MUST compile cleanly under standard JSON parsers.`;

    // ----------------------------------------------------
    // Step 1: Page Summarization (Ultra-Fast ~1.5s)
    // ----------------------------------------------------
    activeCoachingStep = 1;
    if (analyzeBtn) analyzeBtn.textContent = `${COACHING_STATUSES[currentStatusIdx]} ⏳ (Summary 1/4)`;
    updateSenseiBubble(`Let me analyze ${activeTabTitle} for you... ⏳\n\n**Step 1/4:** Summarizing webpage... 📝`);
    
    const summaryQuery = `Webpage scraped text:
---
${pageText}
---
Please analyze the text above and generate a concise 1-2 line page summary in ${learnLangLabel}, and translate the summary into ${motherLangLabel}.

CRITICAL LANGUAGE CONSTRAINT: If you detect that the webpage content is written entirely or predominantly in the user's mother tongue (${motherLangLabel}), you MUST explicitly output a JSON summary indicating this:
{
  "summary": {
    "learning": "This page is already in your native language!",
    "mother": "このページは既にあなたの母国語で書かれています！英語などの学習対象言語のページでコーチングをお試しください。"
  }
}

CRITICAL TRANSLATION INSTRUCTION: Keep translations into ${motherLangLabel} strictly to natural characters. Do NOT write or append any parenthetical reading guides.
CRITICAL INSTRUCTION: You MUST respond strictly with a single valid JSON object representing the summary. Do NOT wrap in markdown ticks, and do NOT write notes outside the JSON.

Structured JSON Format:
{
  "summary": {
    "learning": "A concise 1-2 line page summary in ${learnLangLabel}.",
    "mother": "A concise 1-2 line page summary translated in ${motherLangLabel}."
  }
}`;
    console.log('🎓 Step 1 Summarization: Dispatching Query...');
    const summaryOutput = await queryModularModel(api, supportedLang, baseSystemPrompt, summaryQuery);
    console.log('🎓 Step 1 Summarization: Received raw:', summaryOutput);
    summaryData = tryRepairAndParseJSON(summaryOutput);

    // Finalize Bubble 1 (Page Summary) conversationally!
    const summaryLearning = (summaryData && summaryData.summary && summaryData.summary.learning) || '';
    const summaryMother = (summaryData && summaryData.summary && summaryData.summary.mother) || '';

    if (isMotherTonguePage) {
      updateSenseiBubble(`🧐 It looks like this page is already in your native language (${motherLangLabel})!\n\nI highly recommend navigating to an English page so that I can extract active vocabulary cards and comprehension quiz content! 💡`);
      if (settings.alwaysReadQA !== false) {
        speakText(`It looks like this page is already in your native language! I highly recommend navigating to an English page.`, getTTSLanguageCode());
      }
    } else if (summaryLearning) {
      updateSenseiBubble(`📝 **Page Summary:**\n${summaryLearning}\n(${summaryMother})`);
      if (settings.alwaysReadQA !== false) {
        speakText(summaryLearning, getTTSLanguageCode());
      }
    }

    // Spawn Bubble 2 (Curriculum progress bubble) for Steps 2, 3, 4!
    if (chatHistoryContainer) {
      senseiCurriculumBubble = appendLiveChatMessage(chatHistoryContainer, 'ai', 'Sensei', `Summary complete! Now compiling study cards for ${activeTabTitle}... 💭`, '#f0fdf4');
      if (senseiCurriculumBubble) {
        curriculumMsgEl = senseiCurriculumBubble.querySelector('.chat-msg');
      }
    }

    updateCurriculumBubble(`Now compiling vocabulary list for ${activeTabTitle}... ⏳\n\n**Step 2/4:** Extracting key vocabulary words... 📖`);

    // ----------------------------------------------------
    // Step 2: Graded Vocabulary Extraction
    // ----------------------------------------------------
    const vocabToggle = document.querySelector('.module-toggle[data-id="words-card"]');
    if (vocabToggle && vocabToggle.checked) {
      activeCoachingStep = 2;
      if (analyzeBtn) analyzeBtn.textContent = `${COACHING_STATUSES[currentStatusIdx]} ⏳ (Words 2/4)`;
      
      const vocabQuery = `Webpage scraped text:
---
${pageText}
---
Please extract exactly 2 vocabulary words in ${learnLangLabel} from the text above that align with level matching ${settings.level}. Translate meanings into ${motherLangLabel}.

CRITICAL LEVEL FAILSAFE: If this page contains simple, everyday text and does not naturally have complex vocabulary matching your target high level like 800 or 900, DO NOT return an empty list! Instead, extract generally useful words from the page anyway, or select 2 adjacent high-level vocabulary terms in ${learnLangLabel} inspired by the theme of the page text and define them! Never return fewer than 2 words.
CRITICAL CONVERSATION RULE: The example sentence ("sentence") MUST be a completely new, unique, original example sentence in ${learnLangLabel} created by you. You MUST NEVER copy or repeat sentences directly from the webpage text, and you MUST NEVER repeat the definition. Create a fresh, realistic example sentence illustrating the usage inside a new, original context!
CRITICAL TRANSLATION INSTRUCTION: Keep all translations/definitions into ${motherLangLabel} strictly to natural characters. Do NOT write or append any parenthetical reading guides.
CRITICAL INSTRUCTION: You MUST respond strictly with a single valid JSON object representing the vocabulary words. Do NOT wrap in markdown ticks, and do NOT write notes outside the JSON.

Structured JSON Format:
{
  "words": [
    { "word": "graded_vocab_1", "def": "definition in ${motherLangLabel}", "sentence": "A brand new, original example sentence in ${learnLangLabel} using graded_vocab_1" },
    { "word": "graded_vocab_2", "def": "definition in ${motherLangLabel}", "sentence": "A brand new, original example sentence in ${learnLangLabel} using graded_vocab_2" }
  ]
}`;
      console.log('🎓 Step 2 Vocabulary: Dispatching Query...');
      const vocabOutput = await queryModularModel(api, supportedLang, baseSystemPrompt, vocabQuery);
      console.log('🎓 Step 2 Vocabulary: Received raw:', vocabOutput);
      vocabData = tryRepairAndParseJSON(vocabOutput);
      if (vocabData && Array.isArray(vocabData.words)) {
        const unique = [];
        const keys = new Set();
        vocabData.words.forEach(w => {
          const norm = w.word.trim().toLowerCase();
          if (!keys.has(norm)) {
            keys.add(norm);
            unique.push(w);
          }
        });
        vocabData.words = unique;

        // Failsafe to guarantee at least 2 unique words if one was a duplicate!
        if (vocabData.words.length < 2) {
          const fallbackWords = [
            { word: 'essential', def: settings.motherTongue === 'ja' ? '必要不可欠な、非常に重要な' : 'essential', sentence: 'Expanding vocabularies is an essential part of language coaching.' },
            { word: 'proficient', def: settings.motherTongue === 'ja' ? '熟達した、堪能な' : 'proficient', sentence: 'She became highly proficient in business communications.' }
          ];
          for (const fb of fallbackWords) {
            if (vocabData.words.length >= 2) break;
            const normFb = fb.word.toLowerCase();
            if (!vocabData.words.some(w => w.word.toLowerCase() === normFb)) {
              vocabData.words.push(fb);
            }
          }
        }
      }
      renderWords(vocabData.words);
    } else {
      console.log('⏭️ Step 2 Vocabulary: Skipped (Module disabled)');
      document.getElementById('words-list').innerHTML = '<p style="color: #78716c; font-style: italic; margin: 4px 0;">Module inactive.</p>';
    }

    // ----------------------------------------------------
    // Step 3: Graded Idioms & Expressions
    // ----------------------------------------------------
    const idiomToggle = document.querySelector('.module-toggle[data-id="expressions-card"]');
    if (idiomToggle && idiomToggle.checked) {
      activeCoachingStep = 3;
      if (analyzeBtn) analyzeBtn.textContent = `${COACHING_STATUSES[currentStatusIdx]} ⏳ (Idioms 3/4)`;
      updateCurriculumBubble('Sensei is analyzing the page... ⏳\n\n**Step 3/4:** Gathering conversational idioms and expressions... 💡');
      
      const idiomQuery = `Webpage scraped text:
---
${pageText}
---
Please extract exactly 2 conversational idiomatic phrases or expressions in ${learnLangLabel} related to the text above. Translate meanings into ${motherLangLabel}.

CRITICAL LEVEL FAILSAFE: If this page does not naturally contain complex conversational idioms or phrases matching target high levels like 800 or 900, DO NOT return an empty list! Instead, extract general useful idioms from the page anyway, or select 2 adjacent high-level conversational phrases in ${learnLangLabel} inspired by the theme of the page text and define them! Never return fewer than 2 phrases.
CRITICAL CONVERSATION RULE: The example sentence ("sentence") MUST be a completely new, unique, original example sentence in ${learnLangLabel} created by you. You MUST NEVER copy or repeat sentences directly from the webpage text, and you MUST NEVER repeat the meaning. Create a fresh, realistic example sentence illustrating the usage inside a new, original context!
CRITICAL TRANSLATION INSTRUCTION: Keep all translations/meanings into ${motherLangLabel} strictly to natural characters. Do NOT write or append any parenthetical reading guides.
CRITICAL INSTRUCTION: You MUST respond strictly with a single valid JSON object representing the expressions. Do NOT wrap in markdown ticks, and do NOT write notes outside the JSON.

Structured JSON Format:
{
  "expressions": [
    { "idiom": "idiom_phrase_1", "def": "meaning in ${motherLangLabel}", "sentence": "A brand new, original example sentence in ${learnLangLabel} using idiom_phrase_1" },
    { "idiom": "idiom_phrase_2", "def": "meaning in ${motherLangLabel}", "sentence": "A brand new, original example sentence in ${learnLangLabel} using idiom_phrase_2" }
  ]
}`;
      console.log('🎓 Step 3 Expressions: Dispatching Query...');
      const idiomOutput = await queryModularModel(api, supportedLang, baseSystemPrompt, idiomQuery);
      console.log('🎓 Step 3 Expressions: Received raw:', idiomOutput);
      idiomData = tryRepairAndParseJSON(idiomOutput);
      if (idiomData && Array.isArray(idiomData.expressions)) {
        const unique = [];
        const keys = new Set();
        idiomData.expressions.forEach(e => {
          const norm = e.idiom.trim().toLowerCase();
          if (!keys.has(norm)) {
            keys.add(norm);
            unique.push(e);
          }
        });
        idiomData.expressions = unique;

        // Failsafe to guarantee at least 2 unique idioms if one was a duplicate!
        if (idiomData.expressions.length < 2) {
          const fallbackExpressions = [
            { idiom: 'read between the lines', def: settings.motherTongue === 'ja' ? '行間を読む、暗黙の含みを感じ取る' : 'read between the lines', sentence: 'In business negotiations, it is important to read between the lines.' },
            { idiom: 'on the same page', def: settings.motherTongue === 'ja' ? '意見が一致している、共通の理解を持っている' : 'on the same page', sentence: 'Before finalizing the launch, let us make sure we are on the same page.' }
          ];
          for (const fb of fallbackExpressions) {
            if (idiomData.expressions.length >= 2) break;
            const normFb = fb.idiom.toLowerCase();
            if (!idiomData.expressions.some(e => e.idiom.toLowerCase() === normFb)) {
              idiomData.expressions.push(fb);
            }
          }
        }
      }
      renderExpressions(idiomData.expressions);
    } else {
      console.log('⏭️ Step 3 Expressions: Skipped (Module disabled)');
      document.getElementById('expressions-list').innerHTML = '<p style="color: #78716c; font-style: italic; margin: 4px 0;">Module inactive.</p>';
    }

    // ----------------------------------------------------
    // Step 4: Reading Comprehension Quizzes (English-only Q/A!)
    // ----------------------------------------------------
    const quizToggle = document.querySelector('.module-toggle[data-id="quiz-card"]');
    if (quizToggle && quizToggle.checked) {
      activeCoachingStep = 4;
      if (analyzeBtn) analyzeBtn.textContent = `${COACHING_STATUSES[currentStatusIdx]} ⏳ (Quiz 4/4)`;
      updateCurriculumBubble('Sensei is analyzing the page... ⏳\n\n**Step 4/4:** Generating your comprehension check quiz... 🧩');
      
      const quizQuery = `Webpage scraped text:
---
${pageText}
---
Please generate exactly 2 multiple-choice reading comprehension questions about the text above.

CRITICAL FORMATTING INSTRUCTION: Both the question ("q") and all distractor/correct options ("options") MUST be written strictly, solely in ${learnLangLabel} (do NOT translate them into ${motherLangLabel}).
CRITICAL INSTRUCTION: You MUST respond strictly with a single valid JSON object representing the quizzes. Do NOT wrap in markdown ticks, and do NOT write notes outside the JSON.

Structured JSON Format:
{
  "quizzes": [
    {
      "q": "First Question about page details?",
      "options": ["Distractor Choice A in ${learnLangLabel}", "Distractor Choice B in ${learnLangLabel}", "Correct Choice C in ${learnLangLabel}"],
      "ans": 2
    },
    {
      "q": "Second Question about page details?",
      "options": ["Correct Choice A in ${learnLangLabel}", "Distractor Choice B in ${learnLangLabel}", "Distractor Choice C in ${learnLangLabel}"],
      "ans": 0
    }
  ]
}`;
      console.log('🎓 Step 4 Quizzes: Dispatching Query...');
      const quizOutput = await queryModularModel(api, supportedLang, baseSystemPrompt, quizQuery);
      console.log('🎓 Step 4 Quizzes: Received raw:', quizOutput);
      const quizData = tryRepairAndParseJSON(quizOutput);
      renderQuiz(quizData.quizzes);
    } else {
      console.log('⏭️ Step 4 Quizzes: Skipped (Module disabled)');
      document.getElementById('quiz-list').innerHTML = '<p style="color: #78716c; font-style: italic; margin: 4px 0;">Module inactive.</p>';
    }

    // Enable study customizers and Live Console inputs
    document.getElementById('more-vocab-btn').disabled = false;
    document.getElementById('more-idioms-btn').disabled = false;
    document.getElementById('live-user-input').disabled = false;
    document.getElementById('live-send-btn').disabled = false;

    // Pack vocabulary and expressions into a matching new Study Card


    const newCard = {
      id: 'card_' + Date.now(),
      timestamp: new Date().toISOString(),
      source: activeTabUrl,
      level: settings.level,
      words: (vocabData && vocabData.words) ? vocabData.words : [],
      expressions: (idiomData && idiomData.expressions) ? idiomData.expressions : []
    };

    // Append to persistent database and save
    cardsList.push(newCard);
    await saveCards();

    // Add to navigation history
    cardHistory.push(newCard);
    historyPointer = cardHistory.length - 1;

    // Update views
    loadCardIntoView(newCard);
    updateDeckNavigationButtons();

    console.log('🎓 Parallel Coaching Generation complete! 🎉');
    clearInterval(statusInterval);
    if (analyzeBtn) {
      analyzeBtn.classList.remove('coaching-active');
      analyzeBtn.textContent = 'Coaching Generated! 🎉';
    }

    if (chatHistoryContainer) {
      if (chatHistoryContainer.lastChild && chatHistoryContainer.lastChild.classList.contains('system')) {
        chatHistoryContainer.lastChild.remove();
      }
      
      if (isMotherTonguePage) {
        updateCurriculumBubble(`🧐 It looks like this page is already in your native language (${motherLangLabel})! I highly recommend navigating to an English page matching your learning goals. 💡`);
      } else {
        // Dynamic vocabulary cards, idioms, and quiz are built below! Destroy loader bubble to keep conversational logs pristine.
        if (senseiCurriculumBubble) {
          senseiCurriculumBubble.remove();
        }
      }
    }
    
    // Transition back to an active idle/refresh state after 2.5 seconds
    setTimeout(() => {
      if (analyzeBtn) {
        analyzeBtn.disabled = false;
        updateAnalyzeButtonLabel();
      }
    }, 2500);

  } catch (e) {
    clearInterval(statusInterval);
    if (analyzeBtn) {
      analyzeBtn.classList.remove('coaching-active');
    }
    console.error('Failed Sensei session run:', e);

    if (chatHistoryContainer) {
      if (chatHistoryContainer.lastChild && chatHistoryContainer.lastChild.classList.contains('system')) {
        chatHistoryContainer.lastChild.remove();
      }
      appendLiveChatMessage(
        chatHistoryContainer,
        'ai',
        'Sensei',
        `🥺 Oops! I ran into an error while generating the coaching session (Reason: ${e.message || e.toString()}). Please check your network/model capabilities and try again!`,
        '#f0fdf4'
      );
    } else {
      alert(`Session logic failed: ${e.message || e.toString()}. Please try again!`);
    }

    if (analyzeBtn) {
      analyzeBtn.disabled = false;
      updateAnalyzeButtonLabel();
    }
  }
}

// On-demand study extensions (Successfully decoupled into independent vocab_manager.js and idiom_manager.js files)


// Slider color dynamics
function updateSliderColor(val) {
  const select = document.getElementById('level-select');
  if (!select) return;
  const percentage = ((val - select.min) / (select.max - select.min)) * 100;
  select.style.background = `linear-gradient(to right, var(--accent-color) 0%, var(--accent-color) ${percentage}%, #e7e5e4 ${percentage}%, #e7e5e4 100%)`;
}

function getLevelBadge(score) {
  const val = parseInt(score, 10);
  if (val < 550) return 'Chibi Student 🎒';
  if (val < 650) return 'Intermediate Guide 🤓';
  if (val < 750) return 'Corporate Apprentice 👔';
  if (val < 850) return 'Business Consultant 💼';
  return 'Pristine Wizard 🧙‍♂️✨';
}

function updateAnalyzeButtonLabel() {
  const btnAnalyze = document.getElementById('analyze-btn');
  if (!btnAnalyze) return;
  const coachEmoji = getLevelBadge(settings.level).split(' ').pop();
  btnAnalyze.textContent = `Start Coaching about this page! ${coachEmoji}`;
}

// Spawns a dynamic default study card with key words + idioms when database is completely empty on startup
// Prepared 75-emoji-only RPG, item, and animal pool to keep unpopulated wait states visually exciting
const IDLE_EMOJIS = [
  '🤓', '🎒', '📚', '🧠', '🧙‍♂️', '🍵', '✍️', '🎮', '🎲', '📜', '🤖', '⚡', '💼', '🕵️', '🦉', '🎯', '🧗', '🍕', '🌟', '🧩', '🔑', '🚀', '🎤', '🌈', '🏆',
  '🦖', '🦕', '🦄', '🦁', '🦊', '🐼', '🐨', '🐯', '🐱', '🐶', '🐹', '🐣', '🦉', '🦋', '🐙', '🐬', '🐳', '🐢', '🦎', '🐠', '🪴', '🍄', '🍒', '🥑', '🧇',
  '🥓', '🥞', '🍥', '🍡', '🍣', '🍤', '🍨', '🧁', '🛹', '🧗‍♂️', '🚲', '🎨', '🎭', '🎪', '🎻', '🎸', '🎺', '🏰', '🎡', '🌋', '🌅', '🛸', '⚓', '💎', '🔮'
];

// Randomizes emojis inside Eiko's empty unpopulated card placeholders dynamically
function randomizeIdleCardMessages() {
  const pick = () => IDLE_EMOJIS[Math.floor(Math.random() * IDLE_EMOJIS.length)];
  
  const wordsList = document.getElementById('words-list');
  const expressionsList = document.getElementById('expressions-list');
  const quizList = document.getElementById('quiz-list');

  if (wordsList) {
    wordsList.innerHTML = `<p style="color: #78716c; font-style: italic; margin: 4px 0;">${pick()} Click "Coach me about this page!" inside the Q&A session at the top to generate your cards! 🎮</p>`;
  }
  if (expressionsList) {
    expressionsList.innerHTML = `<p style="color: #78716c; font-style: italic; margin: 4px 0;">${pick()} Click "Coach me about this page!" inside the Q&A session at the top to generate your cards! 🎮</p>`;
  }
  if (quizList) {
    quizList.innerHTML = `<p style="color: #78716c; font-style: italic; margin: 4px 0;">${pick()} Click "Coach me about this page!" inside the Q&A session at the top to generate your cards! 🎮</p>`;
  }
}

// Generates dynamic parameters for Google News based on learning languages and geolocations
function buildGoogleNewsUrl() {
  const learnLang = settings.learningLanguage || 'en';
  if (learnLang === 'ja') {
    return 'https://news.google.com/home?hl=ja&gl=JP&ceid=JP%3Aja';
  } else if (learnLang === 'de') {
    return 'https://news.google.com/home?hl=de&gl=DE&ceid=DE%3Ade';
  } else if (learnLang === 'es') {
    return 'https://news.google.com/home?hl=es&gl=ES&ceid=ES%3Aes';
  } else if (learnLang === 'fr') {
    return 'https://news.google.com/home?hl=fr&gl=FR&ceid=FR%3Afr';
  } else if (learnLang === 'pt') {
    return 'https://news.google.com/home?hl=pt-BR&gl=BR&ceid=BR%3Apt';
  } else {
    // English defaults
    const geo = settings.newsGeo || 'US';
    let hl = 'en-US';
    if (geo === 'GB') hl = 'en-GB';
    else if (geo === 'AU') hl = 'en-AU';
    return `https://news.google.com/home?hl=${hl}&gl=${geo}&ceid=${geo}%3Aen`;
  }
}

function updateNewsButtonLabel() {
  const btnNews = document.getElementById('news-btn');
  if (!btnNews) return;
  const learnLang = settings.learningLanguage || 'en';
  const langName = LANGUAGE_MAP[learnLang] || 'English';
  btnNews.textContent = `📰 Open ${langName} Google News`;
}
