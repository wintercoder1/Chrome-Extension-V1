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

// NEW: Global overlay handler
async function handleForceOverlay() {
    console.log('🖼️ GLOBAL DEBUG: Starting global overlay handler');
    
    try {
        // Remove any existing overlay first
        if (currentOverlay) {
            currentOverlay.remove();
            currentOverlay = null;
        }
        
        // Get brand/company information from the current page
        let companyName = '';
        let brandInfo = null;
        
        // Try to get info from existing tracker instance
        if (globalAmazonBrandTracker) {
            console.log('✅ OVERLAY DEBUG: Found existing tracker instance');
            brandInfo = globalAmazonBrandTracker.classifyProductAndExtractBrandInfo();
        } else {
            console.log('🔧 OVERLAY DEBUG: No tracker instance, creating temporary one');
            // Create temporary instance for extraction
            const tempTracker = new AmazonBrandTracker();
            brandInfo = tempTracker.classifyProductAndExtractBrandInfo();
        }
        
        // Extract company name for API call
        if (brandInfo === 'no-info-found') {
            companyName = 'Unknown Company';
        } else if (brandInfo && brandInfo.type === 'product_with_manufacturer' && 
                   brandInfo.brand !== brandInfo.manufacturer) {
            companyName = brandInfo.manufacturer;
        } else if (brandInfo && brandInfo.type === 'book') {
            companyName = brandInfo.publisher || 'Unknown Publisher';
        } else if (brandInfo && brandInfo.manufacturer && brandInfo.manufacturer !== 'information...') {
            companyName = brandInfo.manufacturer || brandInfo.brand || 'Unknown Company';
        } else if (brandInfo && brandInfo.brand) {
            companyName = brandInfo.brand;
        } else {
            companyName = 'Unknown Company';
        }
        
        console.log('🔍 OVERLAY DEBUG: Extracted company name:', companyName);
        
        // Create and show the overlay
        await globalAmazonBrandTracker.displayElementManager.createOverlayWithComponent(companyName, brandInfo);
        
        return { 
            success: true, 
            message: `Overlay created successfully for ${companyName}` 
        };
        
    } catch (error) {
        console.error('💥 OVERLAY DEBUG: Error in overlay creation:', error);
        return { 
            success: false, 
            message: `Overlay creation failed: ${error.message}` 
        };
    }
}