// Sensei on my Side - On-Device AI Engine & TTS Client

// Local Offline Text-To-Speech Pronunciation Utility
function speakText(text, lang = 'en-US') {
  if (!window.speechSynthesis) {
    console.warn('Offline TTS SpeechSynthesis is not supported in this browser.');
    return;
  }
  window.speechSynthesis.cancel(); // Stop any previous audio utterances immediately

  // Clean up all markdown formatting elements (**, *, `) to streamline and optimize text-to-speech delivery
  const cleanedText = text ? text.replace(/\*\*/g, '').replace(/\*/g, '').replace(/`/g, '').trim() : '';
  if (!cleanedText) return;

  const utterance = new SpeechSynthesisUtterance(cleanedText);
  utterance.lang = lang;

  // Safely query and select matching voice to prevent English fallback voices reading non-English text
  try {
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const targetLang = lang.toLowerCase();
      let matchingVoice = voices.find(v => v.lang.toLowerCase() === targetLang);
      if (!matchingVoice) {
        // Try loose matching prefix (e.g., prefix match like 'zh' for 'zh-CN')
        matchingVoice = voices.find(v => v.lang.toLowerCase().replace('_', '-').startsWith(targetLang.split('-')[0]));
      }
      if (matchingVoice) {
        utterance.voice = matchingVoice;
        console.log(`TTS: Active voice synced to: ${matchingVoice.name} (${matchingVoice.lang})`);
      }
    }
  } catch (e) {
    console.warn('Failed matching specific TTS voice context:', e);
  }

  utterance.rate = 0.92; // Pedagogically slightly slower rate for pristine clarity
  window.speechSynthesis.speak(utterance);
}

// Helper utility wrapper to handle individual Prompt API calls sequentially
async function queryModularModel(api, supportedLang, systemPrompt, queryText) {
  const session = await api.create({
    expectedInputs: [{ type: 'text', languages: [supportedLang] }],
    expectedOutputs: [{ type: 'text', languages: [supportedLang] }],
    initialPrompts: [{ role: 'system', content: systemPrompt }]
  });

  let output = '';
  const stream = session.promptStreaming(queryText);
  for await (const chunk of stream) {
    // Universal compatibility: dynamically support both incremental chunk streams and fully-accumulating streams!
    if (chunk.startsWith(output)) {
      output = chunk;
    } else {
      output += chunk;
    }
  }
  session.destroy();
  return output;
}

// Robust local AI JSON balancing and auto-repair parser logic
function tryRepairAndParseJSON(text) {
  let cleaned = text.trim();
  
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  cleaned = cleaned.trim();

  // Pre-process and normalize raw LLM Japanese string formatting errors
  cleaned = cleaned.replace(/\\(?!["\\\/bfntureu0-9])/gi, '\\\\'); // Escape illegal backslashes dynamically!
  cleaned = cleaned.replace(/：/g, ':');                // Replace all CJK full-width colons
  cleaned = cleaned.replace(/[“”]/g, '"');              // Replace all CJK typographic curly double quotes
  cleaned = cleaned.replace(/:\s*「/g, ': "');          // Replace open Japanese brackets with normal double quotes
  cleaned = cleaned.replace(/」\s*(?=,|\})/g, '"');      // Replace close Japanese brackets with normal double quotes
  cleaned = cleaned.replace(/」\s*;\s*/g, '", ');       // Replace brackets followed by semicolons with quotes + commas
  cleaned = cleaned.replace(/"\s*;\s*/g, '", ');        // Replace mismatched semicolons with commas

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.warn('Raw JSON parse failed. Attempting bracket-balancing recovery...', e);
    
    let repaired = cleaned;
    
    if (!repaired.startsWith('{')) {
      throw new Error('Invalid JSON start.');
    }

    let openBraces = (repaired.match(/\{/g) || []).length;
    let closeBraces = (repaired.match(/\}/g) || []).length;
    let openBrackets = (repaired.match(/\[/g) || []).length;
    let closeBrackets = (repaired.match(/\]/g) || []).length;

    if (openBraces > closeBraces) {
      const lastClosed = repaired.lastIndexOf('}');
      if (lastClosed !== -1) {
        repaired = repaired.substring(0, lastClosed + 1);
        openBraces = (repaired.match(/\{/g) || []).length;
        closeBraces = (repaired.match(/\}/g) || []).length;
        openBrackets = (repaired.match(/\[/g) || []).length;
        closeBrackets = (repaired.match(/\]/g) || []).length;
      }
    }

    // Seal bounds
    while (openBrackets > closeBrackets) {
      repaired += ']';
      closeBrackets++;
    }
    while (openBraces > closeBraces) {
      repaired += '}';
      closeBraces++;
    }

    try {
      return JSON.parse(repaired);
    } catch (errRef) {
      console.warn('Bracket balancing failed. Running RegEx parsing fallback...', errRef);
      return parseViaRegExp(cleaned);
    }
  }
}

// RegEx parser to extract partially written data fields when LLM output cuts off
function parseViaRegExp(text) {
  const fallback = {
    summary: { eng: 'Analysis complete.', mother: 'Analysis complete.' },
    words: [],
    expressions: [],
    quizzes: []
  };

  try {
    const engMatch = text.match(/"eng"\s*:\s*"([^"]+)"/);
    const motherMatch = text.match(/"mother"\s*:\s*"([^"]+)"/);
    if (engMatch) fallback.summary.eng = engMatch[1];
    if (motherMatch) fallback.summary.mother = motherMatch[1];

    const wordRegex = /\{\s*"word"\s*:\s*"([^"]+)"\s*,\s*"def"\s*:\s*"([^"]+)"\s*,\s*"sentence"\s*:\s*"([^"]+)"/g;
    let match;
    while ((match = wordRegex.exec(text)) !== null) {
      fallback.words.push({ word: match[1], def: match[2], sentence: match[3] });
    }

    const exprRegex = /\{\s*"idiom"\s*:\s*"([^"]+)"\s*,\s*"def"\s*:\s*"([^"]+)"\s*,\s*"sentence"\s*:\s*"([^"]+)"/g;
    while ((match = exprRegex.exec(text)) !== null) {
      fallback.expressions.push({ idiom: match[1], def: match[2], sentence: match[3] });
    }

    const quizRegex = /\{\s*"q"\s*:\s*"([^"]+)"\s*,\s*"options"\s*:\s*\[([^\]]+)\]\s*,\s*"ans"\s*:\s*(\d+)/g;
    while ((match = quizRegex.exec(text)) !== null) {
      const q = match[1];
      const optsRaw = match[2];
      const ans = parseInt(match[3], 10);
      const options = optsRaw.split(',').map(o => o.replace(/"/g, '').trim());
      fallback.quizzes.push({ q, options, ans });
    }
  } catch (e) {
    console.error('RegEx fallback extractor crashed:', e);
  }

  return fallback;
}
