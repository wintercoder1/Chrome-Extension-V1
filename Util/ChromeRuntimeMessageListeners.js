// TODO: CLEAN UP THIS CODE!!!
// It works but we could make this look better tbh.

//LOLOLOL AI VIBE V+CODES LOLOL
// Enhanced content script approach that works even when initial insertion failed

// 1. FIRST - Add a global message listener that doesn't depend on the class instance
// Add this at the very top of your content.js file, outside of any class


// Handles categoryChanged only — manualRefresh and forceOverlay are handled by OverlayPopupManager.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'categoryChanged') {
        console.log('🔄 Category changed to:', message.category);
        const refreshPromise = globalAmazonBrandTracker
            ? globalAmazonBrandTracker.refreshWithCategory(message.category)
            : handleManualRefresh();
        refreshPromise
            .then(result => sendResponse(result))
            .catch(error => sendResponse({ success: false, message: error.message }));
        return true;
    }
});
