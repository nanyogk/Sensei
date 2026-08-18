/**
 * @fileoverview Background script/service worker for sidesensei Chrome Extension.
 */

chrome.runtime.onInstalled.addListener(() => {
  // Set behavior to open side panel when user clicks the toolbar icon.
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
      .catch((error) => console.error('Error setting panel behavior:', error));

  // Create targeted context menu item strictly on installed bootstrap
  chrome.contextMenus.create({
    id: "send-to-sidesensei",
    title: "Send to Sensei on my Side",
    contexts: ["selection"]
  });
});

// Listen to right-click selections triggers
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "send-to-sidesensei" && info.selectionText) {
    const selection = info.selectionText.trim();
    console.log('🌐 ContextMenu Clicked! Storing selection text buffer:', selection);
    
    // Open side panel synchronously strictly before any async tick to preserve user gesture context!
    if (chrome.sidePanel && chrome.sidePanel.open) {
      chrome.sidePanel.open({ windowId: tab.windowId }).catch(e => console.error('Error opening side panel:', e));
    }
    
    // Perform any storage buffered operations asynchronously
    (async () => {
      if (chrome && chrome.storage && chrome.storage.local) {
        await chrome.storage.local.set({ selectedTextBuffer: selection });
      }
      
      // Dispatch instant messaging trigger in case sidepanel is already active
      chrome.runtime.sendMessage({ type: 'SELECT_TEXT_NAV', text: selection }).catch(e => {
        // Ignore if side panel drawer is closed/inactive
      });
    })();
  }
});
