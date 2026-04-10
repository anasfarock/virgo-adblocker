// Virgo Ad Blocker - Content Script
// Runs at document_start to block ads before they render

(async () => {
  // Fetch settings
  const settings = await new Promise(resolve => {
    chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }, resolve);
  });

  if (!settings?.enabled) return;

  // Check if current domain is whitelisted
  const currentDomain = window.location.hostname.replace(/^www\./, '');
  if (settings.whitelist?.includes(currentDomain)) {
    console.log('[Virgo Ad Blocker] Domain is whitelisted:', currentDomain);
    return;
  }

  // ─── CSS Selectors for common ad elements ───────────────────────────────────
  const AD_SELECTORS = [
    // Generic ad containers
    '[id*="google_ads"]', '[id*="googlead"]', '[id*="google-ad"]',
    '[class*="google-ad"]', '[class*="googleAd"]', '[class*="googletag"]',
    '[id*="doubleclick"]', '[class*="doubleclick"]',
    '[id*="dfp-ad"]', '[class*="dfp-ad"]',
    '[id*="advert"]', '[class*="advert"]:not([class*="advertisement-label"])',
    '[id*="ad-slot"]', '[class*="ad-slot"]',
    '[id*="ad-unit"]', '[class*="ad-unit"]',
    '[id*="ad-banner"]', '[class*="ad-banner"]',
    '[id*="ad-container"]', '[class*="ad-container"]',
    '[id*="ad-wrapper"]', '[class*="ad-wrapper"]',
    '[id*="adsbygoogle"]', '[class*="adsbygoogle"]',
    '[id*="ad-frame"]', '[class*="ad-frame"]',
    '[id*="sponsor"]', '[class*="sponsored-content"]',
    '[class*="promoted-content"]', '[class*="promoted-post"]',
    // Specific ad networks
    'ins.adsbygoogle',
    'iframe[src*="doubleclick.net"]',
    'iframe[src*="googlesyndication.com"]',
    'iframe[src*="googleadservices.com"]',
    'iframe[src*="amazon-adsystem.com"]',
    'iframe[src*="ads.yahoo.com"]',
    'iframe[src*="adsystem.com"]',
    // Social media promoted content
    '[data-testid*="ad"]',
    '[aria-label="Sponsored"]',
    '[aria-label="Ad"]',
    // Common ad div patterns
    'div[id^="rc-widget"]',
    '.widget-area > .widget-ad',
    '.sidebar-ad',
    '.header-ad',
    '.footer-ad',
    '.leaderboard-ad',
    '.rectangle-ad',
    '.skyscraper-ad',
    '.interstitial-ad'
  ];

  // ─── Tracker / Annoyance Selectors ──────────────────────────────────────────
  const TRACKER_SELECTORS = [
    // Cookie consent popups
    '[id*="cookie-banner"]', '[class*="cookie-banner"]',
    '[id*="cookie-consent"]', '[class*="cookie-consent"]',
    '[id*="cookie-notice"]', '[class*="cookie-notice"]',
    '[id*="cookie-popup"]', '[class*="cookie-popup"]',
    '[id*="gdpr"]', '[class*="gdpr"]',
    // Newsletter popups
    '[id*="newsletter-popup"]', '[class*="newsletter-popup"]',
    '[class*="email-popup"]', '[id*="email-popup"]',
    // Chat widgets (optional)
    // '[id*="intercom"]', '[class*="intercom"]',
    // Push notification requests
    '[id*="push-notification"]', '[class*="push-notification"]',
    // Generic overlay / modal ads
    '.overlay-ad', '.modal-ad', '.popup-ad',
    '[class*="ad-overlay"]', '[id*="ad-overlay"]'
  ];

  let blockedCount = 0;

  // ─── Hide Elements ───────────────────────────────────────────────────────────
  function hideElements(selectors) {
    selectors.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          if (el.style.display !== 'none') {
            el.style.setProperty('display', 'none', 'important');
            el.style.setProperty('visibility', 'hidden', 'important');
            el.setAttribute('data-cleanview-blocked', 'true');
            blockedCount++;
          }
        });
      } catch (e) {
        // Invalid selector, skip
      }
    });
  }

  // ─── Inject CSS to hide ads faster ──────────────────────────────────────────
  function injectBlockingCSS() {
    const style = document.createElement('style');
    style.id = 'cleanview-blocking-css';
    const allSelectors = [
      ...AD_SELECTORS,
      ...(settings.blockTrackers ? TRACKER_SELECTORS : [])
    ];
    style.textContent = allSelectors.join(',\n') + ` {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }`;
    (document.head || document.documentElement).appendChild(style);
  }

  // ─── Block Popups ───────────────────────────────────────────────────────────
  if (settings.blockPopups) {
    window.open = function () { return null; };
    window.alert = function () {};
    // Prevent focus-stealing
    window.addEventListener('blur', (e) => {
      if (document.activeElement?.tagName === 'IFRAME') {
        document.activeElement.blur();
      }
    }, true);
  }

  // ─── Observer for dynamically injected ads ───────────────────────────────────
  function observeDOM() {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          if (settings.blockAds) hideElements(AD_SELECTORS);
          if (settings.blockTrackers) hideElements(TRACKER_SELECTORS);
        }
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  // ─── Initialize ─────────────────────────────────────────────────────────────
  injectBlockingCSS();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (settings.blockAds) hideElements(AD_SELECTORS);
      if (settings.blockTrackers) hideElements(TRACKER_SELECTORS);
      observeDOM();
    });
  } else {
    if (settings.blockAds) hideElements(AD_SELECTORS);
    if (settings.blockTrackers) hideElements(TRACKER_SELECTORS);
    observeDOM();
  }

  // Report blocked count to background
  if (blockedCount > 0) {
    chrome.runtime.sendMessage({ type: 'INCREMENT_BLOCKED', count: blockedCount });
  }

})();
