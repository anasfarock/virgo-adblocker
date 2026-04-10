# 🛡 Virgo Ad Blocker — Chrome Extension

A powerful, privacy-first ad blocker Chrome extension built with Manifest V3.

---

## Features

- **Network-level blocking** — Blocks ad/tracker requests before they even load (via `declarativeNetRequest`)
- **DOM-level hiding** — Hides ad containers and sponsored content from the page
- **Tracker blocking** — Stops cross-site trackers (Google Analytics, Hotjar, Mixpanel, etc.)
- **Popup blocking** — Prevents `window.open()` popup abuse
- **Per-domain whitelist** — Easily whitelist specific sites to support their creators
- **Live stats** — See how many ads have been blocked

---

## Installation (Developer Mode)

1. Download or clone this project folder.
2. Open Chrome and go to: `chrome://extensions/`
3. Enable **Developer mode** (top-right toggle).
4. Click **"Load unpacked"**.
5. Select the `adblocker/` folder.
6. The extension is now active! Click the shield icon in your toolbar.

---

## File Structure

```
adblocker/
├── manifest.json        # Extension config (Manifest V3)
├── background.js        # Service worker: settings, state management
├── content.js           # DOM-level ad hiding + popup blocking
├── popup.html           # Popup UI
├── popup.js             # Popup logic
├── rules/
│   └── ad_rules.json    # declarativeNetRequest rules (network blocking)
└── icons/               # Extension icons (you need to add these)
    ├── icon16.png
    ├── icon32.png
    ├── icon48.png
    └── icon128.png
```

---

## Adding Icons

You need to add PNG icons to the `icons/` directory:
- `icon16.png` (16×16)
- `icon32.png` (32×32)
- `icon48.png` (48×48)
- `icon128.png` (128×128)

You can use any shield or blocker image. Free icons available at:
- https://www.flaticon.com
- https://icons8.com

---

## Extending the Blocker

### Add more blocked domains
Edit `rules/ad_rules.json` and add new rule objects:
```json
{
  "id": 99,
  "priority": 1,
  "action": { "type": "block" },
  "condition": {
    "urlFilter": "||yourad-network.com^",
    "resourceTypes": ["script", "image", "xmlhttprequest", "sub_frame"]
  }
}
```

### Add more CSS selectors
Edit `content.js` and add selectors to the `AD_SELECTORS` or `TRACKER_SELECTORS` arrays.

---

## Permissions Used

| Permission | Why |
|---|---|
| `declarativeNetRequest` | Network-level request blocking |
| `storage` | Save user settings & whitelist |
| `tabs` | Read current tab URL for whitelist feature |
| `activeTab` | Access current tab info |
| `<all_urls>` | Required for blocking on all sites |

---

## License

MIT — free to use, modify, and distribute.
