/** comet Chrome Extension — Popup Script */

const DEFAULT_EDITOR_URL = 'https://your-comet-app.replit.app/editor';

const captureBtn   = document.getElementById('captureBtn');
const openEditorBtn = document.getElementById('openEditorBtn');
const previewImg   = document.getElementById('previewImg');
const placeholder  = document.getElementById('placeholder');
const previewBadge = document.getElementById('previewBadge');
const statusEl     = document.getElementById('status');
const settingsLink = document.getElementById('settingsLink');

function setStatus(msg, type = '') {
  statusEl.textContent = msg;
  statusEl.className = 'status ' + type;
}

function showPreview(dataUrl) {
  previewImg.src = dataUrl;
  previewImg.style.display = 'block';
  placeholder.style.display = 'none';
  previewBadge.style.display = 'block';
}

async function getEditorUrl() {
  try {
    const result = await chrome.storage.sync.get({ editorUrl: DEFAULT_EDITOR_URL });
    return result.editorUrl;
  } catch {
    return DEFAULT_EDITOR_URL;
  }
}

async function openEditorWithScreenshot(dataUrl) {
  // Store screenshot so the content bridge can pick it up
  await chrome.storage.session.set({ cometPendingScreenshot: dataUrl });

  const editorUrl = await getEditorUrl();
  const editorTab = await chrome.tabs.create({ url: editorUrl });

  // Inject bridge script once the editor tab is fully loaded
  chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
    if (tabId === editorTab.id && changeInfo.status === 'complete') {
      chrome.tabs.onUpdated.removeListener(listener);
      chrome.scripting.executeScript({
        target: { tabId: editorTab.id },
        files: ['content.js'],
      }).catch(() => {
        // If scripting fails (e.g. chrome:// pages), just open the editor normally
      });
    }
  });
}

// ── Capture current tab ──────────────────────────────────────────────────────
captureBtn.addEventListener('click', async () => {
  captureBtn.disabled = true;
  captureBtn.innerHTML = `<div class="spinner"></div> Capturing…`;
  setStatus('Taking screenshot…', 'loading');

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab || !tab.windowId) throw new Error('No active tab found');
    if (tab.url?.startsWith('chrome://') || tab.url?.startsWith('chrome-extension://')) {
      throw new Error("Can't capture browser internal pages");
    }

    const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, {
      format: 'png',
      quality: 100,
    });

    showPreview(dataUrl);
    setStatus('Captured! Opening editor…', 'success');

    await openEditorWithScreenshot(dataUrl);
    window.close();
  } catch (err) {
    setStatus(err.message || 'Capture failed. Try again.', 'error');
    captureBtn.disabled = false;
    captureBtn.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
        <circle cx="12" cy="13" r="4"/>
      </svg>
      Capture This Page`;
  }
});

// ── Open editor without capture ──────────────────────────────────────────────
openEditorBtn.addEventListener('click', async () => {
  const editorUrl = await getEditorUrl();
  await chrome.tabs.create({ url: editorUrl });
  window.close();
});

// ── Settings page ────────────────────────────────────────────────────────────
settingsLink.addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
  window.close();
});

// ── Restore any previously captured screenshot in the session ────────────────
chrome.storage.session.get('cometPendingScreenshot', ({ cometPendingScreenshot }) => {
  if (cometPendingScreenshot) {
    showPreview(cometPendingScreenshot);
    setStatus('Previous capture ready.', 'success');
  }
});
