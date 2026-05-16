// Global overlay management
let currentOverlay = null;

// Enhanced global message listener (UPDATE the existing one)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('📨 GLOBAL DEBUG: Received message:', message);
    
    if (message.action === 'manualRefresh') {
        console.log('🔄 GLOBAL DEBUG: Processing manual refresh request');
        
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
        
        return true;
    }
    
    // NEW: Handle overlay creation
    if (message.action === 'forceOverlay') {
        console.log('🖼️ GLOBAL DEBUG: Processing force overlay request');
        
        handleForceOverlay()
            .then(result => {
                console.log('✅ GLOBAL DEBUG: Force overlay result:', result);
                sendResponse(result);
            })
            .catch(error => {
                console.error('💥 GLOBAL DEBUG: Force overlay error:', error);
                sendResponse({ 
                    success: false, 
                    message: `Overlay creation failed: ${error.message}` 
                });
            });
        
        return true;
    }
});

// Global overlay handler
async function handleForceOverlay() {
    console.log('🖼️ GLOBAL DEBUG: Starting global overlay handler');

    try {
        if (!globalAmazonBrandTracker) {
            return { success: false, message: 'Extension not initialized. Try reloading the page.' };
        }

        // Remove any existing overlay first
        if (currentOverlay) {
            currentOverlay.remove();
            currentOverlay = null;
        }

        // Use already-stored company name from the initial page analysis
        let companyName = globalAmazonBrandTracker.companyName;
        let brandInfo = {
            type: 'product_with_manufacturer',
            brand: globalAmazonBrandTracker.brandName || companyName,
            manufacturer: companyName
        };

        // Fall back to re-parsing if we don't have a stored name yet
        if (!companyName) {
            console.log('🔍 OVERLAY DEBUG: No stored company name, re-parsing page');
            const parsed = globalAmazonBrandTracker.classifyProductAndExtractBrandInfo();
            if (parsed === 'no-info-found' || !parsed) {
                return { success: false, message: 'Could not determine company from this page.' };
            }
            brandInfo = parsed;
            companyName = parsed.manufacturer || parsed.brand || parsed.publisher || 'Unknown Company';
        }

        console.log('🔍 OVERLAY DEBUG: Creating overlay for:', companyName);

        await globalAmazonBrandTracker.displayElementManager.createOverlayWithComponent(companyName, brandInfo);

        return { success: true, message: `Overlay created for ${companyName}` };

    } catch (error) {
        console.error('💥 OVERLAY DEBUG: Error in overlay creation:', error);
        return { success: false, message: `Overlay creation failed: ${error.message}` };
    }
}