/** comet — Service Worker (Background Script) */

const DEFAULT_EDITOR_URL = 'https://your-comet-app.replit.app/editor';

async function getEditorUrl() {
  try {
    const result = await chrome.storage.sync.get({ editorUrl: DEFAULT_EDITOR_URL });
    return result.editorUrl;
  } catch {
    return DEFAULT_EDITOR_URL;
  }
}

async function captureAndOpen(windowId) {
  const dataUrl = await chrome.tabs.captureVisibleTab(windowId, {
    format: 'png',
    quality: 100,
  });

  await chrome.storage.session.set({ cometPendingScreenshot: dataUrl });

  const editorUrl = await getEditorUrl();
  const editorTab = await chrome.tabs.create({ url: editorUrl });

  chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
    if (tabId === editorTab.id && changeInfo.status === 'complete') {
      chrome.tabs.onUpdated.removeListener(listener);
      chrome.scripting.executeScript({
        target: { tabId: editorTab.id },
        files: ['content.js'],
      }).catch(() => {});
    }
  });
}

// ── Install: register context menu ──────────────────────────────────────────
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'comet-capture',
    title: 'Beautify with comet ✨',
    contexts: ['page'],
  });

  chrome.contextMenus.create({
    id: 'comet-capture-image',
    title: 'Edit this image in comet',
    contexts: ['image'],
  });
});

// ── Context menu click ───────────────────────────────────────────────────────
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab) return;

  if (info.menuItemId === 'comet-capture') {
    await captureAndOpen(tab.windowId);
  }

  if (info.menuItemId === 'comet-capture-image' && info.srcUrl) {
    // Pass the image src URL via storage; content bridge will fetch & inject it
    await chrome.storage.session.set({ cometImageUrl: info.srcUrl });
    const editorUrl = await getEditorUrl();
    const editorTab = await chrome.tabs.create({ url: editorUrl });

    chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
      if (tabId === editorTab.id && changeInfo.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(listener);
        chrome.scripting.executeScript({
          target: { tabId: editorTab.id },
          files: ['content.js'],
        }).catch(() => {});
      }
    });
  }
});
