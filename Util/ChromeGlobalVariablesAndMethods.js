
// Global reference to the tracker instance
let globalAmazonBrandTracker = null;


// Global manual refresh handler
async function handleManualRefresh() {
    console.log('🔄 GLOBAL DEBUG: Starting global manual refresh handler');
    
    try {
        // Step 1: Check if we have an existing tracker instance
        if (globalAmazonBrandTracker) {
            console.log('✅ GLOBAL DEBUG: Found existing tracker instance, using it');
            return await globalAmazonBrandTracker.manualRefreshComponent();
        }
        
        // Step 2: If no tracker instance, check if classes are available
        console.log('🔍 GLOBAL DEBUG: No existing tracker, checking if classes are available');
        
        if (typeof AmazonBrandTracker === 'undefined') {
            console.error('❌ GLOBAL DEBUG: AmazonBrandTracker class not available');
            return { 
                success: false, 
                message: 'Extension classes not loaded. Try reloading the page.' 
            };
        }
        
        // Step 3: Create a new tracker instance for manual refresh
        console.log('🔧 GLOBAL DEBUG: Creating new tracker instance for manual refresh');
        
        // Remove any existing components first
        await removeExistingComponents();
        
        // Create new tracker instance
        const tempTracker = new AmazonBrandTracker();
        globalAmazonBrandTracker = tempTracker;
        
        // Wait a bit for initialization
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Force the component insertion
        console.log('🚀 GLOBAL DEBUG: Forcing component insertion');
        await tempTracker.classifyWebpageExtractInfoAndUpdateDisplayWithCipherComponent();
        
        return { 
            success: true, 
            message: 'Component created and inserted successfully via manual refresh' 
        };
        
    } catch (error) {
        console.error('💥 GLOBAL DEBUG: Error in global manual refresh:', error);
        
        // Last resort: Try simple component creation and insertion
        try {
            console.log('🆘 GLOBAL DEBUG: Attempting last resort simple insertion');
            // Remove any existing components first
            await removeExistingComponents();
            await lastResortComponentInsertion();
            return { 
                success: true, 
                message: 'Component inserted via last resort method' 
            };
        } catch (lastResortError) {
            console.error('💥 GLOBAL DEBUG: Last resort also failed:', lastResortError);
            return { 
                success: false, 
                message: `All manual refresh attempts failed: ${error.message}` 
            };
        }
    }
}

// Function to remove existing components
async function removeExistingComponents() {
    console.log('🧹 GLOBAL DEBUG: Removing existing components');
    
    const selectors = [
        '.brand-owner-info',
        '.brand-owner-info-container', 
        '.tilt-ai-container',
        '.robust-fallback-insertion',
        '.price-fallback-insertion',
        '.title-fallback-insertion',
        '.centerCol-fallback-insertion',
        '.emergency-insertion',
        '[style*="border: 2px solid"]', // Debug border elements
        '[class*="fallback-insertion"]' // Any fallback insertion class
    ];
    
    let removedCount = 0;
    selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            element.remove();
            removedCount++;
        });
    });
    
    console.log(`🧹 GLOBAL DEBUG: Removed ${removedCount} existing components`);
}
