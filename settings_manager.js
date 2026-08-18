// Sensei on my Side - Settings & Customizer UI Manager
// Decoupled to maintain compact code health inside side_panel.js


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
function enforceLanguageComboGuard(changedSource) {
  const learnSelect = document.getElementById('learn-lang-select');
  const langSelect = document.getElementById('lang-select');
  if (!learnSelect || !langSelect) return;

  if (learnSelect.value === langSelect.value) {
    console.log('⚠️ Language collision guard triggered! Auto-shifting other selection...');
    if (changedSource === 'learn') {
      langSelect.value = (learnSelect.value === 'en') ? 'ja' : 'en';
      settings.motherTongue = langSelect.value;
    } else {
      learnSelect.value = (langSelect.value === 'en') ? 'ja' : 'en';
      settings.learningLanguage = learnSelect.value;
    }
  }
}
function initializeSettingsUIListeners() {
  console.log('⚙️ settings_manager: Initializing Settings & Modal UI binders...');
  const levelSelect = document.getElementById('level-select');
  const levelVal = document.getElementById('level-val');
  const langSelect = document.getElementById('lang-select');
  const learnLangSelect = document.getElementById('learn-lang-select');
  
  const modal = document.getElementById('settings-modal');
  const modalOpenBtn = document.getElementById('modal-open-btn');
  const modalCloseX = document.getElementById('modal-close-x');
  const modalSaveBtn = document.getElementById('modal-save-btn');
  const personalityInput = document.getElementById('personality-input');
  const alwaysReadQACheckbox = document.getElementById('always-read-qa-checkbox');
  const usernameInput = document.getElementById('username-input');

  // Restore Learning Language Select
  if (learnLangSelect) {
    learnLangSelect.value = settings.learningLanguage || 'en';
    learnLangSelect.addEventListener('change', async (e) => {
      settings.learningLanguage = e.target.value;
      enforceLanguageComboGuard('learn');
      await saveSettings();
      console.log('🏆 [learn-lang-select] changed. Learning language synced to:', settings.learningLanguage);
      updateNewsButtonLabel();
      updateLiveChatPlaceholder();
      if (typeof updateDynamicUiLanguages === 'function') updateDynamicUiLanguages();
    });
    console.log('[learn-lang-select] initialized.');
  }
  
  // Restore Your Language Select
  if (langSelect) {
    langSelect.value = settings.motherTongue || 'ja';
    langSelect.addEventListener('change', async (e) => {
      settings.motherTongue = e.target.value;
      enforceLanguageComboGuard('mother');
      await saveSettings();
      console.log('🏆 [lang-select] changed. Mother tongue synced to:', settings.motherTongue);
      updateLiveChatPlaceholder();
      if (typeof updateDynamicUiLanguages === 'function') updateDynamicUiLanguages();
      const btnAnalyze = document.getElementById('analyze-btn');
      if (btnAnalyze) {
        btnAnalyze.disabled = false;
        updateAnalyzeButtonLabel();
      }
    });
    console.log('[lang-select] initialized.');
  }

  // Function to load settings values straight into Modal inputs
  const loadSettingsIntoModal = () => {
    if (levelSelect) {
      levelSelect.value = settings.level || '650';
      if (levelVal) {
        levelVal.textContent = `${levelSelect.value} - ${getLevelBadge(levelSelect.value)}`;
        updateSliderColor(levelSelect.value);
      }
    }
    
    // Restore news geolocation radio buttons
    const activeGeo = settings.newsGeo || 'US';
    const radioInput = document.querySelector(`input[name="news-geo"][value="${activeGeo}"]`);
    if (radioInput) {
      radioInput.checked = true;
      // Un-select all cards
      document.querySelectorAll('.radio-card').forEach(lbl => lbl.classList.remove('selected'));
      // Select matching card
      const parentLabel = document.getElementById(`lbl-geo-${activeGeo}`);
      if (parentLabel) parentLabel.classList.add('selected');
    }

    // Restore personality textarea
    if (personalityInput) {
      personalityInput.value = settings.customPersonality || '';
    }

    // Restore checkbox check state
    if (alwaysReadQACheckbox) {
      alwaysReadQACheckbox.checked = (settings.alwaysReadQA !== false);
    }

    // Restore username nickname input
    if (usernameInput) {
      usernameInput.value = settings.userName || 'You';
    }
  };

  // Bind slider events inside modal
  if (levelSelect) {
    levelSelect.addEventListener('input', (e) => {
      if (levelVal) {
        levelVal.textContent = `${e.target.value} - ${getLevelBadge(e.target.value)}`;
        updateSliderColor(e.target.value);
      }
    });
  }

  // Bind card-style radio buttons change visual selection states
  const radioInputs = document.querySelectorAll('input[name="news-geo"]');
  radioInputs.forEach(radio => {
    radio.addEventListener('change', (e) => {
      document.querySelectorAll('.radio-card').forEach(lbl => lbl.classList.remove('selected'));
      const parentLabel = document.getElementById(`lbl-geo-${e.target.value}`);
      if (parentLabel) parentLabel.classList.add('selected');
    });
  });

  // Modal Open Trigger
  if (modalOpenBtn && modal) {
    modalOpenBtn.addEventListener('click', () => {
      loadSettingsIntoModal();
      modal.classList.remove('hidden');
      console.log('⚙️ Settings Modal Opened.');
    });
  }

  // Save and Close settings handler
  const saveAndCloseSettings = async () => {
    if (modal) {
      // Save level
      if (levelSelect) {
        settings.level = levelSelect.value;
      }
      
      // Save selected news geo
      const selectedRadio = document.querySelector('input[name="news-geo"]:checked');
      if (selectedRadio) {
        settings.newsGeo = selectedRadio.value;
      }

      // Save personality textarea
      if (personalityInput) {
        settings.customPersonality = personalityInput.value.trim();
      }

      // Save Q&A autoplay setting
      if (alwaysReadQACheckbox) {
        settings.alwaysReadQA = alwaysReadQACheckbox.checked;
      }

      // Save custom nickname setting
      if (usernameInput) {
        settings.userName = usernameInput.value.trim() || 'You';
      }

      await saveSettings();
      console.log('⚙️ Customizer configuration saved securely:', settings);

      // Clear active cached chat session to apply new guidelines instantly!
      if (typeof clearChatSession === 'function') clearChatSession();

      // Re-activate Analyze button if settings altered
      const btnAnalyze = document.getElementById('analyze-btn');
      if (btnAnalyze) {
        btnAnalyze.disabled = false;
        updateAnalyzeButtonLabel();
      }

      modal.classList.add('hidden');
      console.log('⚙️ Settings Modal Closed and Saved Successfully.');
    }
  };

  if (modalSaveBtn) {
    modalSaveBtn.addEventListener('click', saveAndCloseSettings);
  }

  if (modalCloseX) {
    modalCloseX.addEventListener('click', () => {
      if (modal) modal.classList.add('hidden');
    });
  }

  // Close modal when clicking anywhere outside the window backdrop
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  }

  // Initialize on startup
  loadSettingsIntoModal();
}
