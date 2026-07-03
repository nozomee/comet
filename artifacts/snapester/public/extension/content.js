/**
 * comet — Content Bridge Script
 *
 * Injected by the extension into the editor tab once it's loaded.
 * Reads the pending screenshot from chrome.storage.session and
 * posts it to the page via window.postMessage so React can pick it up.
 */
(async () => {
  try {
    const result = await chrome.storage.session.get([
      'cometPendingScreenshot',
      'cometImageUrl',
    ]);

    if (result.cometPendingScreenshot) {
      // Dispatch the screenshot data URL to the page
      window.postMessage(
        { type: 'COMET_SCREENSHOT', dataUrl: result.cometPendingScreenshot },
        '*'
      );
      await chrome.storage.session.remove('cometPendingScreenshot');
      return;
    }

    if (result.cometImageUrl) {
      // Fetch the external image and convert to a data URL
      try {
        const res = await fetch(result.cometImageUrl);
        const blob = await res.blob();
        const reader = new FileReader();
        reader.onload = () => {
          window.postMessage(
            { type: 'COMET_SCREENSHOT', dataUrl: reader.result },
            '*'
          );
        };
        reader.readAsDataURL(blob);
        await chrome.storage.session.remove('cometImageUrl');
      } catch (fetchErr) {
        console.warn('[comet] Failed to fetch image:', fetchErr);
      }
    }
  } catch (err) {
    console.warn('[comet] Content bridge error:', err);
  }
})();
