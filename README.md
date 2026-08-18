# 🎓 Sensei on my Side (横居英子は英語教師なの): On-Device AI English Coach

`Sensei on my Side` is a secure, 100% offline-first browser extension that serves as an English learning coach in your side panel, utilizing Chrome's **built-in Prompt API (Gemini Nano)** under the hood. 

To Japanese users, the app presents itself as **「横居英子は英語教師なの」** (Yokoie Eiko is indeed an English Teacher!)—a playful triple-pun on her name (英子 / English tutor), her side panel home (横居 / sitting right beside you / on your side!), and the local offline LLM engine (なの / Gemini Nano!) that orchestrates her brain under the hood!

---

## 🚀 Key Features

### 1. Dynamic Study Card Deck (Anki-style Active Recall) ◀ ▶
* **Launch Zero-Stress Seeding**: On open, automatically queries a fallback boot catcher (`generateIdleStudyCard`) to populate key terms right away if your profile database is empty!
* **History Deck Cues**: Displays active card study dates in localized `[YY.MM.DD]` labels so you can look back and track how far you have come in your lexicon journey.
* **Domain Origin Mapping**: Tracks and maps the original URLs that study glossaries were generated from. Click the domain tags to dynamically navigate active tabs back to your source URL!

### 2. Compact Curriculum Progress HUD ⏱️
* The primary coaching action button displays modular, step-by-step progress checkpoints during active compile:
  `(Webpage Summary 1/4)` ➡️ `(Graded Vocab 2/4)` ➡️ `(Phrases 3/4)` ➡️ `(Reading Quizzes 4/4)`

### 3. Dynamic RPG Level Avatars 🤓👔🧙‍♂️
* Adjust your target TOEIC score slider dynamically to evolve your coach's visual status:
  - `TOEIC 500` ➡️ **Chibi Student 🎒**
  - `TOEIC 600` ➡️ **Intermediate Guide 🤓**
  - `TOEIC 700` ➡️ **Corporate Apprentice 👔**
  - `TOEIC 800` ➡️ **Business Consultant 💼**
  - `TOEIC 900` ➡️ **Pristine Wizard 🧙‍♂️✨**

### 4. Responsive Emoji Loops in Q&A (`idle` ➡️ `working/sweat` ➡️ `happy` ➡️ `idle`)
* Eiko-sensei reacts dynamically inside active Q&A speaker capsules:
  - **Thinking/Sweating (`💭` / `💦`)**: Cycles visually at 400ms intervals while the local AI model streams its chat response chunks.
  - **Happy Reward (`✨` / `🎉`)**: Sparkles on successful response resolution.
  - **Idle (`🤓` / `🧙‍♂️`)**: Transitions back to your active level avatar after 2 seconds.

### 5. Smart Contextual Dictionary (Highlight 1-3 words)
* Right-click and highlight single terms or short idioms on any webpage:
  - If the selection is a full sentence/paragraph, it runs the standard **Article Summary** layout.
  - If it is **1-3 words**, it automatically redirects to **Dictionary & Synonyms Mode**, outputting definition keys, related business synonyms, and two TOEIC-style example sentences.

---

## 🧠 How to Enable & Force-Download Gemini Nano Locally

Since `Sensei on my Side` operates 100% offline on your local hardware, it requires the Gemini Nano model database to be loaded onto your local drive. If the system status footer displays **`DOWNLOADABLE 📥`** or **`DOWNLOADING ⏳`** but is idling, follow these steps to force Chrome to fetch the model instantly:

### 1. Turn on Chrome Flags
Open a new tab and set the following configurations in Chrome:
* **`chrome://flags/#optimization-guide-on-device-model`** ➡️ Set to **`Enabled BypassPrefRequirement`** *(Crucial! Tells Chrome to ignore default battery and machine specs checks)*.
* **`chrome://flags/#prompt-api-for-gemini-nano`** ➡️ Set to **`Enabled`**.
* Click **Relaunch** to restart Chrome.

### 2. Trigger Active Downloads via DevTools Console
Open Chrome DevTools console (`F12` or right-click inspect) on any tab and execute:
```javascript
// This forces the Optimization Guide components worker to start downloading the model immediately!
await ai.languageModel.create();
```

### 3. Check Component Status & Force Updates
1. Navigate to **`chrome://components`** in a new browser tab.
2. Scroll down to locate **`Optimization Guide On Device Model`**.
3. Click **`Check for update`**.
4. The status will shift to *`Downloading`*. Wait a few minutes until it displays *`Component updated`*—your offline brain is now loaded on your machine!
5. Reload Eiko-sensei inside the side panel—the System Status Card will now display a gorgeous, green **`READY 🟢`**!

---

## 🛠️ Development & Sync Cycle (Chromebook Setup)

To support quick local iteration on Chromebooks without standard git syncing on development partitions, `sidesensei` includes a local high-observability synchronizer console **(`installer_sensei.html`)**.

### Step-by-Step Local Alignment:
1. **Link Workspaces**:
   - Launch `installer_sensei.html` on Web servers/Chrome.
   - Click **Link Local Chromebook Folder** and pick your target unpacked extension folder on your local Chromebook filesystem.
2. **Synchronize Loop**:
   - The synchronizer runs a persistent heartbeat loop (every 1500ms).
   - It checks remote Citc workspace files and automatically handles recursive directory creations (such as nesting your `_locales/en` and `_locales/ja` paths successfully).
3. **Bypass Caches**:
   - The synchronizer queries base path buffers using randomized timestamps `?t=timestamp` and explicit `Pragma: no-cache` headers to enforce pristine, actual sync runs.
4. **V3 Serviceworker Reload**:
   - Once synced, go to **`chrome://extensions`**.
   - **CRITICAL**: You must manually click the circular **Reload** button on the `sidesensei` card to re-bootstrap the background MV3 service worker, which caches old scripting loops!