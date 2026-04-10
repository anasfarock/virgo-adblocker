// Virgo Ad Blocker - Background Service Worker

const DEFAULT_SETTINGS = {
  enabled: true,
  blockAds: true,
  blockTrackers: true,
  blockPopups: true,
  whitelist: [],
  blockedCount: 0
};

// Initialize settings on install
chrome.runtime.onInstalled.addListener(async () => {
  const existing = await chrome.storage.local.get(DEFAULT_SETTINGS);
  const settings = { ...DEFAULT_SETTINGS, ...existing };
  await chrome.storage.local.set(settings);
  console.log('[Virgo Ad Blocker] Extension installed and initialized.');
  updateIcon(settings.enabled);
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_SETTINGS') {
    chrome.storage.local.get(DEFAULT_SETTINGS).then(sendResponse);
    return true;
  }

  if (message.type === 'UPDATE_SETTINGS') {
    chrome.storage.local.set(message.settings).then(async () => {
      const settings = await chrome.storage.local.get(DEFAULT_SETTINGS);
      updateIcon(settings.enabled);
      sendResponse({ success: true });
    });
    return true;
  }

  if (message.type === 'INCREMENT_BLOCKED') {
    chrome.storage.local.get(['blockedCount']).then(({ blockedCount = 0 }) => {
      chrome.storage.local.set({ blockedCount: blockedCount + 1 });
    });
    return true;
  }

  if (message.type === 'RESET_COUNT') {
    chrome.storage.local.set({ blockedCount: 0 }).then(() => sendResponse({ success: true }));
    return true;
  }

  if (message.type === 'GET_TAB_URL') {
    chrome.tabs.query({ active: true, currentWindow: true }).then(tabs => {
      if (tabs[0]) {
        sendResponse({ url: tabs[0].url });
      }
    });
    return true;
  }
});

// Update the extension icon based on enabled state
function updateIcon(enabled) {
  const suffix = enabled ? '' : '_disabled';
  chrome.action.setIcon({
    path: {
      16: `icons/icon16${suffix}.png`,
      32: `icons/icon32${suffix}.png`,
      48: `icons/icon48${suffix}.png`,
      128: `icons/icon128${suffix}.png`
    }
  }).catch(() => {
    // Icon files may not exist for disabled state, silently fail
  });
}

// Track blocked requests via declarativeNetRequest
chrome.declarativeNetRequest.onRuleMatchedDebug?.addListener((info) => {
  chrome.storage.local.get(['blockedCount']).then(({ blockedCount = 0 }) => {
    chrome.storage.local.set({ blockedCount: blockedCount + 1 });
  });
});
