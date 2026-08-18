// Official Attested Languages
const LANGUAGE_MAP = {
  'en': 'English',
  'ja': 'Japanese',
  'de': 'German',
  'es': 'Spanish',
  'fr': 'French',
  'pt': 'Portuguese'
};

// Storage State
let settings = { level: '600', learningLanguage: 'en', motherTongue: 'ja', newsGeo: 'US', customPersonality: '', alwaysReadQA: true, userName: 'You' };
let cardsList = []; // Historical list of saved study cards (max 10,000)
let cardHistory = []; // Session history viewer stack for previous/next reviews
let historyPointer = -1; // Pointer index inside cardHistory stack

// Load settings from Storage
async function loadSettings() {
  return new Promise((resolve) => {
    console.log('🔑 loadSettings: Handshaking storage settings...');
    if (!chrome || !chrome.storage || !chrome.storage.local) {
      console.warn('🔑 loadSettings aborted: chrome.storage is unavailable.');
      resolve();
      return;
    }
    chrome.storage.local.get(['settings', 'cards'], (result) => {
      console.log('🔑 loadSettings: Storage record fetched:', result);
      if (result.settings) {
        settings = result.settings;
        if (settings.language && !settings.motherTongue) {
          settings.motherTongue = settings.language;
          delete settings.language;
        }
      }
      if (result.cards && Array.isArray(result.cards)) {
        cardsList = result.cards;
      }
      resolve();
    });
  });
}

// Save settings to Storage
async function saveSettings() {
  return new Promise((resolve) => {
    if (!chrome || !chrome.storage || !chrome.storage.local) {
      console.warn('saveSettings aborted: chrome.storage is unavailable.');
      resolve();
      return;
    }
    chrome.storage.local.set({ settings }, () => {
      console.log('🔑 saveSettings: Settings stored successfully:', settings);
      resolve();
    });
  });
}

// Save card deck changes to Storage
async function saveCards() {
  return new Promise((resolve) => {
    if (!chrome || !chrome.storage || !chrome.storage.local) {
      resolve();
      return;
    }
    // Safe persistent capacity cap - up to 10,000 items
    if (cardsList.length > 10000) {
      console.log('🧹 Cards registry exceeded 10,000. Pruning oldest entries to preserve storage quota...');
      while (cardsList.length > 10000) {
        cardsList.shift();
      }
    }
    chrome.storage.local.set({ cards: cardsList }, () => {
      console.log('🔑 saveCards: Cards saved securely. Count:', cardsList.length);
      resolve();
    });
  });
}

function getTTSLanguageCode() {
  const learnLang = settings.learningLanguage || 'en';
  if (learnLang === 'ja') return 'ja-JP';
  if (learnLang === 'de') return 'de-DE';
  if (learnLang === 'es') return 'es-ES';
  if (learnLang === 'fr') return 'fr-FR';
  if (learnLang === 'pt') return 'pt-BR';
  return 'en-US';
}

const DYNAMIC_UI_LOCALIZATIONS = {
  'en': {
    coachMe: "📖 Coach me about this page!",
    moreVocab: "➕ More Vocab",
    moreIdioms: "➕ More Idioms",
    hdrChat: "Talk to Sensei 💬",
    hdrVocab: "Vocabulary 📖",
    hdrIdiom: "Expressions & Idioms 💡",
    hdrQuiz: "Page Comprehension Quiz 🧩"
  },
  'ja': {
    coachMe: "📖 このページをコーチして！",
    moreVocab: "➕ 単語を追加",
    moreIdioms: "➕ イディオム追加",
    hdrChat: "英子先生とおしゃべり 💬",
    hdrVocab: "英単語学習カード 📖",
    hdrIdiom: "日常会話表現・類語 💡",
    hdrQuiz: "読解力チェックテスト 🧩"
  },
  'es': {
    coachMe: "📖 ¡Enséñame esta página!",
    moreVocab: "➕ Más Vocabulario",
    moreIdioms: "➕ Más Modismos",
    hdrChat: "Hablar con Sensei 💬",
    hdrVocab: "Tarjetas de Vocabulario 📖",
    hdrIdiom: "Modismos y Expresiones 💡",
    hdrQuiz: "Prueba de Comprensión 🧩"
  },
  'de': {
    coachMe: "📖 Trainiere mich auf dieser Seite!",
    moreVocab: "➕ Mehr Vokabeln",
    moreIdioms: "➕ Mehr Redewendungen",
    hdrChat: "Sprich mit Sensei 💬",
    hdrVocab: "Vokabelkarten nach Niveau 📖",
    hdrIdiom: "Umgangssprachliche Redewendungen 💡",
    hdrQuiz: "Verständnischeck-Quiz 🧩"
  },
  'fr': {
    coachMe: "📖 Entraîne-moi sur cette page !",
    moreVocab: "➕ Plus de Vocabulaire",
    moreIdioms: "➕ Plus d'Expressions",
    hdrChat: "Parler à Sensei 💬",
    hdrVocab: "Fiches de Vocabulaire 📖",
    hdrIdiom: "Expressions et Locutions 💡",
    hdrQuiz: "Quiz de Compréhension 🧩"
  },
  'pt': {
    coachMe: "📖 Ensine-me sobre esta página!",
    moreVocab: "➕ Mais Vocabulário",
    moreIdioms: "➕ Mais Expressões",
    hdrChat: "Falar com a Sensei 💬",
    hdrVocab: "Cartões de Vocabulário 📖",
    hdrIdiom: "Expressões e Frases Úteis 💡",
    hdrQuiz: "Quiz de Compreensão 🧩"
  }
};

function updateDynamicUiLanguages() {
  const lang = settings.learningLanguage || 'en';
  const dict = DYNAMIC_UI_LOCALIZATIONS[lang] || DYNAMIC_UI_LOCALIZATIONS['en'];
  
  const btnCoachMe = document.getElementById('quick-coach-btn');
  const btnMoreVocab = document.getElementById('more-vocab-btn');
  const btnMoreIdioms = document.getElementById('more-idioms-btn');

  const hdrChat = document.getElementById('hdr-chat');
  const hdrVocab = document.getElementById('hdr-vocab');
  const hdrIdiom = document.getElementById('hdr-idiom');
  const hdrQuiz = document.getElementById('hdr-quiz');

  if (btnCoachMe) btnCoachMe.textContent = dict.coachMe;
  if (btnMoreVocab) btnMoreVocab.textContent = dict.moreVocab;
  if (btnMoreIdioms) btnMoreIdioms.textContent = dict.moreIdioms;

  if (hdrChat) hdrChat.textContent = dict.hdrChat;
  if (hdrVocab) hdrVocab.textContent = dict.hdrVocab;
  if (hdrIdiom) hdrIdiom.textContent = dict.hdrIdiom;
  if (hdrQuiz) hdrQuiz.textContent = dict.hdrQuiz;
}
