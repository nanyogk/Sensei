// Sensei on my Side - DOM View UI Renderer & Drag Coordinators



function formatCardDate(timestamp) {
  if (!timestamp) return '';
  try {
    const d = new Date(timestamp);
    if (isNaN(d.getTime())) return '';
    const yy = String(d.getFullYear()).slice(-2);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yy}.${mm}.${dd}`;
  } catch (e) {
    return '';
  }
}

function loadCardIntoView(card) {
  if (!card) return;

  // Trigger visual lavender glow flash effect
  const wordsCard = document.getElementById('words-card');
  const exprCard = document.getElementById('expressions-card');
  
  if (wordsCard) {
    wordsCard.classList.remove('card-flash');
    void wordsCard.offsetWidth; // Trigger reflow
    wordsCard.classList.add('card-flash');
  }
  if (exprCard) {
    exprCard.classList.remove('card-flash');
    void exprCard.offsetWidth; // Trigger reflow
    exprCard.classList.add('card-flash');
  }

  // Render dynamic source labels on both footers parallelly
  const vocabSource = document.getElementById('vocab-deck-source-label');
  const idiomSource = document.getElementById('idiom-deck-source-label');
  
  const dbIndex = cardsList.indexOf(card);
  const indexSuffix = dbIndex !== -1 ? ` (MEM #${dbIndex + 1})` : '';
  const cardDate = formatCardDate(card.timestamp);
  const datePrefix = cardDate ? `[${cardDate}] ` : '';

  [vocabSource, idiomSource].forEach(sourceEl => {
    if (!sourceEl) return;

    // Determine if source is an active HTTP origin URL to enable pointer click navigations!
    const isHttp = (card.source && card.source.startsWith('http') && !card.source.includes('chrome://') && !card.source.includes('about:'));
    
    sourceEl.style.cursor = isHttp ? 'pointer' : 'default';
    sourceEl.style.textDecoration = isHttp ? 'underline' : 'none';
    
    sourceEl.onclick = () => {
      if (isHttp) {
        console.log('🌐 Navigating active browser tab to card source URL memory:', card.source);
        chrome.tabs.update({ url: card.source }).catch(err => {
          console.warn('🌐 Tab navigation bypassed:', err);
        });
      }
    };

    if (card.source === 'Random (Gen)') {
      sourceEl.textContent = `${datePrefix}🎲 RANDOM VOCAB (New Tab) (${card.level || '600'})${indexSuffix}`;
      sourceEl.title = 'Randomly generated study card because no scraping context was active!';
    } else {
      try {
        const parsedUrl = new URL(card.source);
        // Format built-in Chrome System pages clearly
        if (card.source.includes('chrome://') || card.source.includes('about:')) {
          sourceEl.textContent = `${datePrefix}🎲 RANDOM VOCAB (New Tab) (${card.level || '600'})${indexSuffix}`;
          sourceEl.style.cursor = 'default';
          sourceEl.style.textDecoration = 'none';
          sourceEl.onclick = null;
        } else {
          sourceEl.textContent = `${datePrefix}📖 FROM: ${parsedUrl.hostname.replace('www.', '')}${indexSuffix}`;
          sourceEl.title = card.source;
        }
      } catch (e) {
        sourceEl.textContent = `${datePrefix}📖 SOURCE MEMORY LINK${indexSuffix}`;
        sourceEl.title = card.source;
      }
    }
  });

  // Render vocabulary & expressions segments
  renderWords(card.words);
  renderExpressions(card.expressions);
}

function updateDeckNavigationButtons() {
  const vPrev = document.getElementById('vocab-deck-prev-btn');
  const iPrev = document.getElementById('idiom-deck-prev-btn');
  const vNext = document.getElementById('vocab-deck-next-btn');
  const iNext = document.getElementById('idiom-deck-next-btn');
  
  const isPrevDisabled = (historyPointer <= 0);
  const isNextDisabled = (cardsList.length === 0 && historyPointer >= cardHistory.length - 1);

  [vPrev, iPrev].forEach(btn => btn && (btn.disabled = isPrevDisabled));
  [vNext, iNext].forEach(btn => btn && (btn.disabled = isNextDisabled));
}

// Renders Summary department
function renderSummary(summaryData) {
  if (!summaryData) return;
  const card = document.getElementById('summary-card');
  if (card) card.classList.remove('unpopulated');
  const textEng = document.getElementById('summary-text-eng');
  const textMother = document.getElementById('summary-text-mother');
  const playBtn = document.getElementById('play-summary-btn');

  const mainText = summaryData.learning || summaryData.eng || '';
  textEng.textContent = mainText;
  textMother.textContent = summaryData.mother || '';

  // Bind TTS audio playback
  if (playBtn) {
    playBtn.onclick = () => speakText(mainText, getTTSLanguageCode());
  }
}

// Renders Graded Words department
function renderWords(wordsArray) {
  const card = document.getElementById('words-card');
  if (card) card.classList.remove('unpopulated');
  const container = document.getElementById('words-list');
  container.innerHTML = '';

  // Resilient list normalizer safeguard
  let normalized = [];
  if (Array.isArray(wordsArray)) {
    normalized = wordsArray;
  } else if (wordsArray && typeof wordsArray === 'object') {
    if (Array.isArray(wordsArray.words)) {
      normalized = wordsArray.words;
    } else if (Array.isArray(wordsArray.vocab)) {
      normalized = wordsArray.vocab;
    } else if (Array.isArray(wordsArray.vocabulary)) {
      normalized = wordsArray.vocabulary;
    } else if (wordsArray.word && wordsArray.def) {
      normalized = [wordsArray];
    }
  }

  if (normalized.length === 0) {
    container.innerHTML = '<p style="color: #78716c; font-style: italic; margin: 4px 0;">No vocabulary words extracted from local AI analysis.</p>';
    return;
  }

  normalized.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'word-item';
    div.innerHTML = `
      <div class="item-word-row">
        <span class="word-capsule">${item.word}</span>
        <button class="tts-play-btn play-word-btn" title="Pronounce Word">🔊 Pronounce</button>
      </div>
      <p class="item-definition">${item.def}</p>
      <div class="more-details">
        <div class="example-sentence-row">
          <div class="example-sentence-content">
            <span class="detail-label">Example Sentence:</span>
            <p class="detail-sentence">${item.sentence}</p>
          </div>
          <button class="tts-play-btn play-sentence-btn" title="Listen to Sentence">🔊 Listen</button>
        </div>
      </div>
    `;

    // Play Pronunciation binding
    div.querySelector('.play-word-btn').onclick = () => speakText(item.word, getTTSLanguageCode());

    // Play Sample sentence binding
    div.querySelector('.play-sentence-btn').onclick = () => speakText(item.sentence, getTTSLanguageCode());

    container.appendChild(div);
  });
}

// Renders Expressions & Idioms department
function renderExpressions(exprArray) {
  const card = document.getElementById('expressions-card');
  if (card) card.classList.remove('unpopulated');
  const container = document.getElementById('expressions-list');
  container.innerHTML = '';

  // Resilient list normalizer safeguard
  let normalized = [];
  if (Array.isArray(exprArray)) {
    normalized = exprArray;
  } else if (exprArray && typeof exprArray === 'object') {
    if (Array.isArray(exprArray.expressions)) {
      normalized = exprArray.expressions;
    } else if (Array.isArray(exprArray.idioms)) {
      normalized = exprArray.idioms;
    } else if (exprArray.idiom && exprArray.def) {
      normalized = [exprArray];
    }
  }

  if (normalized.length === 0) {
    container.innerHTML = '<p style="color: #78716c; font-style: italic; margin: 4px 0;">No conversational expressions extracted from local AI analysis.</p>';
    return;
  }

  normalized.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'expression-item';
    div.innerHTML = `
      <div class="item-word-row">
        <span class="word-capsule" style="background-color: #e6fbf0; color: #047857; border-color: #a7f3d0;">${item.idiom}</span>
        <button class="tts-play-btn play-expr-btn" title="Pronounce Phrase">🔊 Pronounce</button>
      </div>
      <p class="item-definition">${item.def}</p>
      <div class="more-details">
        <div class="example-sentence-row">
          <div class="example-sentence-content">
            <span class="detail-label">Example Sentence:</span>
            <p class="detail-sentence">${item.sentence}</p>
          </div>
          <button class="tts-play-btn play-sentence-btn" title="Listen to Sentence">🔊 Listen</button>
        </div>
      </div>
    `;

    // Play Pronunciation
    div.querySelector('.play-expr-btn').onclick = () => speakText(item.idiom, getTTSLanguageCode());

    // Play sentence
    div.querySelector('.play-sentence-btn').onclick = () => speakText(item.sentence, getTTSLanguageCode());

    container.appendChild(div);
  });
}

// Renders Quiz department (Instant click check enabled!)
function renderQuiz(quizzesArray) {
  const card = document.getElementById('quiz-card');
  if (card) card.classList.remove('unpopulated');
  const container = document.getElementById('quiz-list');
  container.innerHTML = '';
  activeQuizAnswers = []; // Reset grading array

  // Resilient list normalizer safeguard
  let normalized = [];
  if (Array.isArray(quizzesArray)) {
    normalized = quizzesArray;
  } else if (quizzesArray && typeof quizzesArray === 'object') {
    if (Array.isArray(quizzesArray.quizzes)) {
      normalized = quizzesArray.quizzes;
    } else if (Array.isArray(quizzesArray.quiz)) {
      normalized = quizzesArray.quiz;
    } else if (quizzesArray.q && quizzesArray.options) {
      normalized = [quizzesArray];
    }
  }

  // Reset Quiz score banner
  const scoreBanner = document.getElementById('quiz-score-banner');
  if (scoreBanner) {
    scoreBanner.className = 'score-banner hidden';
    scoreBanner.innerHTML = '';
  }

  if (normalized.length === 0) {
    container.innerHTML = '<p style="color: #78716c; font-style: italic; margin: 4px 0;">No checkup quiz generated from local AI analysis.</p>';
    return;
  }

  normalized.forEach((item, qIdx) => {
    activeQuizAnswers.push(item.ans); // Cache correct options

    const div = document.createElement('div');
    div.className = 'quiz-item';
    div.id = `quiz-q-${qIdx}`;

    let optionsHtml = '';
    item.options.forEach((opt, oIdx) => {
      optionsHtml += `
        <label class="quiz-option" id="opt-q-${qIdx}-o-${oIdx}">
          <input type="radio" name="quiz-ans-${qIdx}" value="${oIdx}">
          <span>${opt}</span>
        </label>
      `;
    });

    div.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
        <p class="quiz-question" style="margin: 0;">${qIdx + 1}. ${item.q}</p>
        <button class="tts-play-btn play-quiz-q-btn" title="Listen to Question">🔊 Listen</button>
      </div>
      <div class="quiz-options-box" style="margin-top: 8px;">
        ${optionsHtml}
      </div>
    `;

    // Play Quiz Question audio trigger
    const listenBtn = div.querySelector('.play-quiz-q-btn');
    if (listenBtn) {
      listenBtn.onclick = (e) => {
        e.stopPropagation();
        speakText(item.q, getTTSLanguageCode());
      };
    }

    // Handlers to check and grade correct/incorrect answer dynamically on click instantly!
    div.querySelectorAll('.quiz-option').forEach((opt, oIdx) => {
      opt.onclick = () => {
        if (div.classList.contains('answered')) return; // Only allow single attempt
        div.classList.add('answered');

        // Disable radio elements in this block
        div.querySelectorAll('input').forEach(i => i.disabled = true);

        const correctAnsIdx = item.ans;

        if (oIdx === correctAnsIdx) {
          opt.classList.add('correct');
        } else {
          opt.classList.add('incorrect');
          // Highlight correct option in green dynamically
          const correctLabel = div.querySelector(`#opt-q-${qIdx}-o-${correctAnsIdx}`);
          if (correctLabel) correctLabel.classList.add('correct');

          // Trigger interactive conversational coaching explanation in Q&A pane!
          try {
            const selectedText = opt.querySelector('span').textContent.trim();
            const correctText = correctLabel ? correctLabel.querySelector('span').textContent.trim() : 'Correct Answer';
            if (typeof triggerQuizIncorrectCoaching === 'function') {
              triggerQuizIncorrectCoaching(qIdx + 1, item.q, selectedText, correctText);
            }
          } catch (errQuiz) {
            console.warn('Failed to dispatch quiz coaching request:', errQuiz);
          }
        }
      };
    });

    container.appendChild(div);
  });
}
