// Sensei on my Side - Browser Tab DOM Scraper

let pageText = ''; // Elevated globally to unblock on-demand study expansion queries!

// Scrape active tab DOM text parameters
async function scrapeActivePageContent() {
  console.log('⚡ scrapeActivePageContent: Locating active browser tab...');
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.id) {
    console.warn('⚡ scrapeActivePageContent: Active tab query returned undefined!');
    throw new Error('No active tab found.');
  }
  console.log('⚡ scrapeActivePageContent: Active tab located:', tab.url);

  if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('edge://') || tab.url.startsWith('about:'))) {
    console.warn('⚡ scrapeActivePageContent: Aborting scrape: built-in page context is blocked:', tab.url);
    throw new Error('Built-in system pages cannot be analyzed.');
  }

  // Dynamically request optional permission to target this single site securely on click!
  if (chrome.permissions && tab.url) {
    try {
      const urlObj = new URL(tab.url);
      const originPattern = `${urlObj.protocol}//${urlObj.hostname}/`;
      console.log('🔐 Privacy Guard: Requesting dynamic consent to access origin:', originPattern);
      
      const hasPermission = await new Promise((resolve) => {
        chrome.permissions.request({
          origins: [originPattern]
        }, (granted) => {
          resolve(granted);
        });
      });

      if (!hasPermission) {
        console.warn('🔐 Privacy Guard: Permission declined by user for origin:', originPattern);
        throw new Error(`Permission to access ${urlObj.hostname} was declined by the user.`);
      }
      console.log('🔓 Privacy Guard: Origin access granted successfully!');
    } catch (e) {
      throw new Error(`Privacy authorization failed: ${e.message}`);
    }
  }

  console.log('⚡ scrapeActivePageContent: Executing DOM scraping script injection...');
  const [result] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      // 1. Locate high-value article/semantic containers first
      const selectors = [
        'article', 
        'main', 
        '[role="main"]', 
        '#content', 
        '#main', 
        '.main-content', 
        '.content'
      ];
      
      let targetNode = null;
      for (const selector of selectors) {
        const el = document.querySelector(selector);
        if (el && el.innerText.trim().length > 200) {
          targetNode = el.cloneNode(true);
          break;
        }
      }
      
      // Fallback to standard body if no rich semantic elements are found
      if (!targetNode) {
        targetNode = document.body.cloneNode(true);
      }
      
      // 2. Aggressively prune noisy nodes (TOCs, menus, sidebars, modal overlays)
      const noiseSelectors = [
        'script', 'style', 'nav', 'footer', 'header', 'iframe', 'noscript', 'aside',
        '#toc', '.toc', '#sidebar', '.sidebar', '.table-of-contents',
        '[role="complementary"]', '[role="navigation"]', 'dialog', '.modal'
      ];
      
      targetNode.querySelectorAll(noiseSelectors.join(',')).forEach(el => el.remove());
      
      // 3. Extract clean text with a comfortable baseline reading buffer
      return targetNode.innerText.trim().substring(0, 1800);
    }
  });

  console.log('⚡ scrapeActivePageContent: Scraping complete. Text length compiled:', (result.result || '').length);
  return result.result || '';
}
