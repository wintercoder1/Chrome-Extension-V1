// TODO: CLEAN UP THIS CODE!!!
// It works but we could make this look better tbh.

//LOLOLOL AI VIBE V+CODES LOLOL
// Enhanced content script approach that works even when initial insertion failed

// 1. FIRST - Add a global message listener that doesn't depend on the class instance
// Add this at the very top of your content.js file, outside of any class


// Global message listener that works even if the class failed to initialize
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('📨 GLOBAL DEBUG: Received message:', message);
    
    if (message.action === 'manualRefresh') {
        console.log('🔄 GLOBAL DEBUG: Processing manual refresh request');
        
        // Handle the case where the original instance failed
        handleManualRefresh()
            .then(result => {
                console.log('✅ GLOBAL DEBUG: Manual refresh result:', result);
                sendResponse(result);
            })
            .catch(error => {
                console.error('💥 GLOBAL DEBUG: Manual refresh error:', error);
                sendResponse({ 
                    success: false, 
                    message: `Manual refresh failed: ${error.message}` 
                });
            });
        
        // Return true to indicate we'll send a response asynchronously
        return true;
    }
});
