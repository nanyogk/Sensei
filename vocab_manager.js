// Sensei on my Side - Vocabulary Extension Manager
// Decoupled to maintain compact code health inside side_panel.js

async function queryMoreVocabulary() {
  const container = document.getElementById('words-list');
  const btn = document.getElementById('more-vocab-btn');
  if (!pageText) return;

  btn.disabled = true;
  btn.textContent = 'Generating... ⏳';

  try {
    const api = globalThis.LanguageModel || globalThis.ai?.languageModel;
    if (!api) throw new Error('API unavailable.');

    const supportedLang = ['en', 'es', 'ja', 'de', 'fr'].includes(settings.motherTongue) ? settings.motherTongue : 'en';
    const motherLangLabel = LANGUAGE_MAP[settings.motherTongue] || 'Japanese';

    const activeCard = cardHistory[historyPointer];
    const existingWordsStr = (activeCard && activeCard.words.length > 0)
      ? `Do NOT select or include the following words which were already presented/generated: [${activeCard.words.map(w => w.word).join(', ')}].`
      : '';

    const systemPrompt = `You are Sensei on my Side, a TOEIC coach. Graded level: ${settings.level}. Mother tongue: ${motherLangLabel}.`;
    const queryText = ` Scraped text:
---
${pageText}
---
Generate exactly 2 additional, completely new, unique vocabulary words from the page. ${existingWordsStr} Do NOT select the same words that were generated before. Meaning matches ${motherLangLabel}.

CRITICAL LEVEL FAILSAFE: If this page does not naturally have complex vocabulary matching your target high TOEIC level like 800 or 900, DO NOT return an empty list! Instead, extract generally useful words from the page anyway, or select 2 adjacent high-level business vocabulary terms inspired by the theme of the page text and define them! Never return fewer than 2 words.
CRITICAL CONVERSATION RULE: The example sentence ("sentence") MUST be a completely new, unique, original English sentence created by you. You MUST NEVER copy or repeat sentences directly from the webpage text, and you MUST NEVER repeat the definition. Create a fresh, realistic, TOEIC-style business English example sentence illustrating the usage inside a new, original context!
CRITICAL TRANSLATION INSTRUCTION: Keep all translations/definitions into ${motherLangLabel} strictly to natural CJK characters.
Structured JSON Format:
{
  "words": [
    { "word": "new_vocab_1", "def": "definition in ${motherLangLabel}", "sentence": "New original business sentence using new_vocab_1" },
    { "word": "new_vocab_2", "def": "definition in ${motherLangLabel}", "sentence": "New original business sentence using new_vocab_2" }
  ]
}`;

    const output = await queryModularModel(api, supportedLang, systemPrompt, queryText);
    const data = tryRepairAndParseJSON(output);
    
    if (data && Array.isArray(data.words)) {
      const unique = [];
      const keys = new Set();
      
      // Keep only unique words
      data.words.forEach(w => {
        const norm = w.word.trim().toLowerCase();
        if (!keys.has(norm)) {
          keys.add(norm);
          unique.push(w);
        }
      });
      data.words = unique;

      // Failsafe to guarantee at least 2 clean words
      if (data.words.length < 2) {
        const fallbackWords = [
          { word: 'significant', def: settings.motherTongue === 'ja' ? '極めて重要な、著しい' : 'significant', sentence: 'There is a significant difference in performance under discrete GPUs.' },
          { word: 'advocate', def: settings.motherTongue === 'ja' ? '提唱する、支持する' : 'advocate', sentence: 'Eiko-sensei acts as a persistent advocate for local AI integration.' }
        ];
        for (const fb of fallbackWords) {
          if (data.words.length >= 2) break;
          const normFb = fb.word.toLowerCase();
          if (!data.words.some(w => w.word.toLowerCase() === normFb)) {
            data.words.push(fb);
          }
        }
      }
 
       // Append to card in navigation history
       if (activeCard) {
         activeCard.words.push(...data.words);
         // Save deck changes
         await saveCards();
         loadCardIntoView(activeCard);
 
         const chatHistoryContainer = document.getElementById('live-chat-history');
         if (chatHistoryContainer) {
           if (chatHistoryContainer.lastChild && chatHistoryContainer.lastChild.classList.contains('system')) {
             chatHistoryContainer.lastChild.remove();
           }
           appendLiveChatMessage(chatHistoryContainer, 'ai', 'Sensei', `📖 Success! I extracted 2 additional vocabulary words for you. Check them out in the updated list below! ✨`, '#f0fdf4');
         }
       }
     }
   } catch (err) {
     const chatHistoryContainer = document.getElementById('live-chat-history');
     if (chatHistoryContainer) {
       if (chatHistoryContainer.lastChild && chatHistoryContainer.lastChild.classList.contains('system')) {
         chatHistoryContainer.lastChild.remove();
       }
       appendLiveChatMessage(chatHistoryContainer, 'ai', 'Sensei', `🥺 I ran into an issue extracting extra vocab terms (Reason: ${err.message}).`, '#f0fdf4');
     } else {
       alert('Failed to get more vocabulary: ' + err.message);
     }
   } finally {
     btn.disabled = false;
     const lang = settings.learningLanguage || 'en';
     btn.textContent = (DYNAMIC_UI_LOCALIZATIONS[lang] || DYNAMIC_UI_LOCALIZATIONS['en']).moreVocab;
   }
}
