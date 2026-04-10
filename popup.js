// Virgo Ad Blocker - Popup Script

document.addEventListener('DOMContentLoaded', async () => {
  // ── Fetch current settings ─────────────────────────────────────────────────
  const settings = await new Promise(resolve =>
    chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }, resolve)
  );

  // ── Get current tab URL ───────────────────────────────────────────────────
  const tabData = await new Promise(resolve =>
    chrome.runtime.sendMessage({ type: 'GET_TAB_URL' }, resolve)
  );

  let currentDomain = '';
  if (tabData?.url) {
    try {
      currentDomain = new URL(tabData.url).hostname.replace(/^www\./, '');
    } catch (_) { currentDomain = 'unknown'; }
  }

  // ── DOM References ─────────────────────────────────────────────────────────
  const masterToggle   = document.getElementById('master-toggle');
  const toggleLabel    = document.getElementById('toggle-label');
  const blockedCount   = document.getElementById('blocked-count');
  const trackerStatus  = document.getElementById('tracker-status');
  const popupStatus    = document.getElementById('popup-status');
  const domainEl       = document.getElementById('current-domain');
  const domainDot      = document.getElementById('domain-dot');
  const whitelistBtn   = document.getElementById('whitelist-btn');
  const blockAds       = document.getElementById('block-ads');
  const blockTrackers  = document.getElementById('block-trackers');
  const blockPopups    = document.getElementById('block-popups');
  const resetBtn       = document.getElementById('reset-btn');
  const overlay        = document.getElementById('disabled-overlay');

  // ── Apply initial state ────────────────────────────────────────────────────
  masterToggle.checked    = settings.enabled;
  blockAds.checked        = settings.blockAds;
  blockTrackers.checked   = settings.blockTrackers;
  blockPopups.checked     = settings.blockPopups;

  blockedCount.textContent = settings.blockedCount ?? 0;
  updateStatusBadges();
  updateToggleUI(settings.enabled);

  // Domain
  domainEl.textContent = currentDomain || 'N/A';
  const isWhitelisted = (settings.whitelist || []).includes(currentDomain);
  updateWhitelistUI(isWhitelisted);

  // ── Master Toggle ──────────────────────────────────────────────────────────
  masterToggle.addEventListener('change', async () => {
    const enabled = masterToggle.checked;
    await saveSettings({ enabled });
    updateToggleUI(enabled);
  });

  function updateToggleUI(enabled) {
    toggleLabel.textContent = enabled ? 'ON' : 'OFF';
    overlay.classList.toggle('visible', !enabled);
  }

  // ── Option toggles ─────────────────────────────────────────────────────────
  blockAds.addEventListener('change', async () => {
    await saveSettings({ blockAds: blockAds.checked });
    updateStatusBadges();
  });

  blockTrackers.addEventListener('change', async () => {
    await saveSettings({ blockTrackers: blockTrackers.checked });
    updateStatusBadges();
  });

  blockPopups.addEventListener('change', async () => {
    await saveSettings({ blockPopups: blockPopups.checked });
    updateStatusBadges();
  });

  function updateStatusBadges() {
    trackerStatus.textContent = blockTrackers.checked ? 'ON' : 'OFF';
    trackerStatus.style.color = blockTrackers.checked
      ? 'var(--accent)' : 'var(--danger)';

    popupStatus.textContent = blockPopups.checked ? 'ON' : 'OFF';
    popupStatus.style.color = blockPopups.checked
      ? 'var(--accent)' : 'var(--danger)';
  }

  // ── Whitelist Toggle ───────────────────────────────────────────────────────
  whitelistBtn.addEventListener('click', async () => {
    const current = await new Promise(resolve =>
      chrome.runtime.sendMessage({ type: 'GET_SETTINGS' }, resolve)
    );

    let whitelist = current.whitelist || [];
    const idx = whitelist.indexOf(currentDomain);

    if (idx >= 0) {
      whitelist.splice(idx, 1);
      updateWhitelistUI(false);
    } else {
      whitelist.push(currentDomain);
      updateWhitelistUI(true);
    }

    await saveSettings({ whitelist });
  });

  function updateWhitelistUI(whitelisted) {
    whitelistBtn.textContent = whitelisted ? 'Remove' : 'Whitelist';
    whitelistBtn.classList.toggle('active', whitelisted);
    domainDot.classList.toggle('whitelisted', whitelisted);
  }

  // ── Reset Counter ──────────────────────────────────────────────────────────
  resetBtn.addEventListener('click', async () => {
    await new Promise(resolve =>
      chrome.runtime.sendMessage({ type: 'RESET_COUNT' }, resolve)
    );
    blockedCount.textContent = '0';
    animatePop(blockedCount);
  });

  // ── Helper: save settings ──────────────────────────────────────────────────
  function saveSettings(partial) {
    return new Promise(resolve =>
      chrome.runtime.sendMessage({
        type: 'UPDATE_SETTINGS',
        settings: partial
      }, resolve)
    );
  }

  // ── Animation helper ───────────────────────────────────────────────────────
  function animatePop(el) {
    el.style.transform = 'scale(1.3)';
    el.style.transition = 'transform 0.15s';
    setTimeout(() => {
      el.style.transform = 'scale(1)';
    }, 150);
  }
});
