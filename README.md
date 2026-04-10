# 🛡️ Virgo Ad Blocker

**Virgo Ad Blocker** is a sleek, ultra-premium, privacy-first ad blocker for Google Chrome. Built on the modern Manifest V3 architecture, it is designed to be lightning fast and remarkably efficient at keeping you safe from intrusive ads, popups, and cross-site trackers.

---

## 🌟 Why Virgo?

- **Network & DOM Level Shielding**: Kills ads internally before they load, while sweeping away empty ad banners from the page layout so browser pages look perfect.
- **Privacy First, Always**: Stops major third-party trackers in their tracks, preventing them from harvesting your browsing habits.
- **Modern Glassmorphic UI**: Enjoy managing your settings through a beautiful, dark-vibrant frosted glass interface. 
- **Popup Destroyer**: Suppresses sneaky popup windows and prevents them from stealing your focus.
- **Lightweight**: Optimized to ensure it has virtually zero impact on your browser's speed and system memory.

---

## 🚀 How to Install

Installing Virgo directly from GitHub only takes a few seconds!

1. Go to the **Releases** page on the right side of this repository and download the latest **`.zip`** file.
2. Extract the ZIP file into a folder on your computer.
3. Open Google Chrome and type `chrome://extensions/` into your URL bar.
4. Turn on the **Developer mode** toggle in the top right corner.
5. Click the **Load unpacked** button in the top left.
6. Select the folder you extracted in Step 2.
7. **You're done!** Pin the Virgo Shield 🛡️ to your Chrome toolbar for easy access.

---

## 📖 How to Use

Virgo Ad Blocker works automatically in the background, but gives you completely granular control over how you want to browse:

### The Dashboard
Click the Virgo Shield icon in your toolbar to open the dashboard. You will immediately see live stats on how many ads, trackers, and popup attempts have been aggressively blocked.

### Supporting Your Favorite Sites (Whitelisting)
If you are on a website belonging to an independent creator you want to support:
1. Open the Virgo dashboard while on their website.
2. Click the **Whitelist** button next to the website's domain name.
3. Virgo will instantly pause ad-blocking on this specific site so your favorite creators can earn ad revenue! Click **Remove** at any time to turn the shield back on.

### Granular Controls
You can toggle specific types of protection on or off safely without breaking the rest of the blocker:
- **Block Ads:** Disables the visual removal of ads.
- **Block Trackers:** Want to unconditionally allow analytical/cookie trackers? Toggle this off.
- **Block Popups:** occasionally, a professional site you trust might need to open a legitimate popup window. Toggle this off temporarily to allow it.

### Master Kill-Switch
If a website completely breaks and you suspect the ad-blocker is the main culprit, simply click the **Master Toggle** at the very top of the extension. This will put the entire protection system offline and allow the site to load naturally.

---

## 🛠️ For Developers

Virgo is completely open source! Feel free to clone the repository to learn about advanced `declarativeNetRequest` caching and dynamically-injected DOM-mutation observers for Manifest V3 extensions!

### Adding Custom Filters
If you want to add your own CSS filters or block heavily obfuscated domains:
1. Identify the domain and add a new network rule object in `rules/ad_rules.json`.
2. For specific div elements, inject the class inside the `AD_SELECTORS` array in `content.js`.
3. Reload the extension in `chrome://extensions/` for the new rules to compile!

## License
MIT — free to use, modify, and distribute.
