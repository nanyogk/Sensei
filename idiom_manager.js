// Sensei on my Side - Conversational Idioms Extension Manager
// Decoupled to maintain compact code health inside side_panel.js

async function queryMoreIdioms() {
  const container = document.getElementById('expressions-list');
  const btn = document.getElementById('more-idioms-btn');
  if (!pageText) return;

  btn.disabled = true;
  btn.textContent = 'Generating... ⏳';

  try {
    const api = globalThis.LanguageModel || globalThis.ai?.languageModel;
    if (!api) throw new Error('API unavailable.');

    const supportedLang = ['en', 'es', 'ja', 'de', 'fr'].includes(settings.motherTongue) ? settings.motherTongue : 'en';
    const motherLangLabel = LANGUAGE_MAP[settings.motherTongue] || 'Japanese';

    const activeCard = cardHistory[historyPointer];
    const existingIdiomsStr = (activeCard && activeCard.expressions.length > 0)
      ? `Do NOT select or include the following idioms/expressions which were already presented/generated: [${activeCard.expressions.map(e => e.idiom).join(', ')}].`
      : '';

    const systemPrompt = `You are Sensei on my Side, a TOEIC coach. Graded level: ${settings.level}. Mother tongue: ${motherLangLabel}.`;
    const queryText = ` Scraped text:
---
${pageText}
---
Generate exactly 2 additional, completely new, unique idioms/expressions from the page. ${existingIdiomsStr} Do NOT select the same expressions that were generated before. Meaning matches ${motherLangLabel}.

CRITICAL LEVEL FAILSAFE: If this page does not naturally contain complex conversational idioms or business phrases matching target high levels like 800 or 900, DO NOT return an empty list! Instead, extract general useful idioms from the page anyway, or select 2 adjacent high-level business/conversational phrases inspired by the theme of the page text and define them! Never return fewer than 2 phrases.
CRITICAL CONVERSATION RULE: The example sentence ("sentence") MUST be a completely new, unique, original English sentence created by you. You MUST NEVER copy or repeat sentences directly from the webpage text, and you MUST NEVER repeat the meaning. Create a fresh, realistic, TOEIC-style business English example sentence illustrating the usage inside a new, original context!
CRITICAL TRANSLATION INSTRUCTION: Keep all translations/meanings into ${motherLangLabel} strictly to natural CJK characters.
Structured JSON Format:
{
  "expressions": [
    { "idiom": "new_phrase_1", "def": "meaning in ${motherLangLabel}", "sentence": "New original business sentence using new_phrase_1" },
    { "idiom": "new_phrase_2", "def": "meaning in ${motherLangLabel}", "sentence": "New original business sentence using new_phrase_2" }
  ]
}`;

    const output = await queryModularModel(api, supportedLang, systemPrompt, queryText);
    const data = tryRepairAndParseJSON(output);
    
    if (data && Array.isArray(data.expressions)) {
      const unique = [];
      const keys = new Set();
      
      data.expressions.forEach(e => {
        const norm = e.idiom.trim().toLowerCase();
        if (!keys.has(norm)) {
          keys.add(norm);
          unique.push(e);
        }
      });
      data.expressions = unique;

      // Failsafe check to guarantee at least 2 new unique expressions
      if (data.expressions.length < 2) {
        const fallbackExpressions = [
          { idiom: 'read between the lines', def: settings.motherTongue === 'ja' ? '行間を読む、暗黙の含みを感じ取る' : 'read between the lines', sentence: 'In business negotiations, it is important to read between the lines.' },
          { idiom: 'on the same page', def: settings.motherTongue === 'ja' ? '意見が一致している、共通の理解を持っている' : 'on the same page', sentence: 'Before finalizing the launch, let us make sure we are on the same page.' }
        ];
        for (const fb of fallbackExpressions) {
          if (data.expressions.length >= 2) break;
          const normFb = fb.idiom.toLowerCase();
          if (!data.expressions.some(e => e.idiom.toLowerCase() === normFb)) {
            data.expressions.push(fb);
          }
        }
      }
 
       if (activeCard) {
         activeCard.expressions.push(...data.expressions);
         await saveCards();
         loadCardIntoView(activeCard);
 
         const chatHistoryContainer = document.getElementById('live-chat-history');
         if (chatHistoryContainer) {
           if (chatHistoryContainer.lastChild && chatHistoryContainer.lastChild.classList.contains('system')) {
             chatHistoryContainer.lastChild.remove();
           }
           appendLiveChatMessage(chatHistoryContainer, 'ai', 'Sensei', `💡 Success! I extracted 2 additional conversational idioms/expressions for you. Check them out in the updated list below! ✨`, '#f0fdf4');
         }
       }
     }
   } catch (err) {
     const chatHistoryContainer = document.getElementById('live-chat-history');
     if (chatHistoryContainer) {
       if (chatHistoryContainer.lastChild && chatHistoryContainer.lastChild.classList.contains('system')) {
         chatHistoryContainer.lastChild.remove();
       }
       appendLiveChatMessage(chatHistoryContainer, 'ai', 'Sensei', `🥺 I ran into an issue extracting extra idiomatic phrases (Reason: ${err.message}).`, '#f0fdf4');
     } else {
       alert('Failed to get more idioms: ' + err.message);
     }
   } finally {
     btn.disabled = false;
     const lang = settings.learningLanguage || 'en';
     btn.textContent = (DYNAMIC_UI_LOCALIZATIONS[lang] || DYNAMIC_UI_LOCALIZATIONS['en']).moreIdioms;
   }
}
