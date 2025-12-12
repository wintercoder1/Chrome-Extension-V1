// Amazon Brand Owner Tracker - Content Script
class AmazonBrandTracker {

  constructor() {
    this.brandInfo = null;
    // this.layoutDefaultMode = 'buybox'; // Default fallback
    this.layoutDefaultMode = 'product-details'; // Default fallback
    this.layoutMode = this.layoutDefaultMode

    this.pageParser = new TypicalProductPageParser();
    this.bookPageParser= new BookPageParser();
    this.networkManager = new NetworkManager();
    this.rateLimitManager = new RateLimitManager();

    // Set global reference so manual refresh can find this instance
    globalAmazonBrandTracker = this;

    // // Call this when your extension initializes
    // Inject CSS first, then initialize
    this.initializeWithCSS();
  }

  injectCSS() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = chrome.runtime.getURL('Components/tilt-ai-styles.css');
    document.head.appendChild(link);
  };

  async initializeWithCSS() {
    try {
      // Try to inject CSS from file first
      this.injectCSS();
    } catch (error) {
      console.warn('Failed to load CSS file, falling back to inline CSS:', error);
      // Fallback to inline CSS
      injectCSSInline();
    }
    
    // Now that CSS is loaded, initialize the rest
    this.init();
  }

  async init() {
    // Load layout preference from storage
    try {
      const result = await chrome.storage.sync.get(['layoutMode']);
      this.layoutMode = result.layoutMode || this.layoutDefaultMode;
      console.log('Loaded layout mode:', this.layoutMode);
    } catch (error) {
      console.log('Could not load layout preference, using default:', error);
    }

    // This is init here to correctly load the user toggled setting (if set).
    this.displayElementManager = new DisplayElementManager(this.layoutMode);

    // // / Add this debug test
    // setTimeout(() => {
    //     this.testDisplayElementManager();
    // }, 2000);


    // Wait for page to load and then extract brand info
    if (document.readyState === 'loading') {
      console.log('Page loading...')
      document.addEventListener('DOMContentLoaded', () => this.classifyWebpageExtractInfoAndUpdateDisplayWithCompassComponent());
    } else {
      console.log('Will now classify webpage and insert component in correct location:');
      this.classifyWebpageExtractInfoAndUpdateDisplayWithCompassComponent();
    }
  }

  classifyProductAndExtractBrandInfo() {
      console.log('Starting product classification and brand extraction...');
      
      // First check if this is a book page (books have different structure)
      const isBookPage = this.isBookPage();
      if (isBookPage) {
          console.log('Detected book page, using book parser...');
          const bookInfo = this.bookPageParser.extractBrandName();
          if (bookInfo) {
              console.log('Found book info:', bookInfo);
              return bookInfo;
          }
      }
      
      // PRIORITY 1: Try to extract explicit manufacturer from product details
      console.log('Attempting to extract explicit manufacturer info...');
      let productPageInfo = this.pageParser.extractManufacturerInfo();
      console.log('Found manufacturuer info? : ', productPageInfo);
      
      if (productPageInfo && productPageInfo.manufacturer && productPageInfo.manufacturer !== 'information...') {
          console.log('Successfully found explicit manufacturer info:', productPageInfo);
          return productPageInfo;
      }
      
      // PRIORITY 2: If no explicit manufacturer found, try enhanced brand extraction methods
      console.log('No explicit manufacturer found, trying enhanced brand extraction...');
      const brandName = this.pageParser.extractBrandName();
      
      if (brandName) {
          console.log('Successfully extracted brand name:', brandName);
          // Return in the expected format
          return {
              type: 'product_with_manufacturer',
              brand: brandName,
              manufacturer: brandName
          };
      }
      
      // Final fallback - return no info found
      console.log('No brand or manufacturer information could be extracted');
      return 'no-info-found';
  }

  // Helper method to detect if this is a book page
  
  isBookPage() {
      // Check for book-specific indicators
      const bookIndicators = [
          () => document.querySelector('[data-feature-name="bylineInfo"]')?.textContent?.includes('Author'),
          () => document.querySelector('#bylineInfo')?.textContent?.includes('Author'),
          () => document.querySelector('.author')?.textContent?.length > 0,
          () => document.querySelector('[data-feature-name="bookDescription"]'),
          () => document.querySelector('#bookDescription_feature_div'),
          () => document.title?.toLowerCase().includes('book'),
          () => document.querySelector('.kindle-price'),
          () => document.querySelector('[data-feature-name="formats"]')
      ];
      
      return bookIndicators.some(check => {
          try {
              return check();
          } catch (error) {
              return false;
          }
      });
  }

  ///
  //
  //
//   async classifyWebpageExtractInfoAndUpdateDisplayWithCompassComponent() {
//     // First we create the component. It will initially be in its loading state.
//     console.log('Now displaying extension component...');
//     const displayInfo = {'type': 'product_with_manufacturer'};
//     const loadingElement = this.displayElementManager.createDisplayElementWithComponentCompass(displayInfo, null, true);
//     loadingElement.classList.add('loading');
//     this.displayElementManager.insertDisplayElement(loadingElement);
    
//     // Classify the webpage and extract brand info
//     const productPageInfo = this.classifyProductAndExtractBrandInfo();
    
//     // Logic to take the correct brand and manufacturer info from the product info dict.
//     let companyName = '';
//     let brandName = null;
//     // Extract the actual company name from brandInfo object
//     if (productPageInfo === 'no-info-found') {
//         companyName = 'Unknown Company';
//     } else if (productPageInfo && productPageInfo.type === 'product_with_manufacturer' && 
//                 productPageInfo.brand !== productPageInfo.manufacturer) {
//         // This is one of the most common cases likely. 
//         // The product will have a brand, but the contribution info will be from the parent company.
//         brandName = productPageInfo.brand;
//         companyName = productPageInfo.manufacturer;
//     } else if (productPageInfo && productPageInfo.type === 'book') {
//         companyName = productPageInfo.publisher || 'Unknown Publisher';
//     } else if (productPageInfo && productPageInfo.type === 'product_with_manufacturer' && productPageInfo.manufacturer !== 'information...') {
//         companyName = productPageInfo.manufacturer || productPageInfo.brand || 'Unknown Company';
//     } else if (ownerInfo && ownerInfo.owning_company_name && ownerInfo.owning_company_name !== productPageInfo) {
//         companyName = ownerInfo.owning_company_name;
//     } else if (productPageInfo && typeof productPageInfo === 'string') {
//         // If productPageInfo is already a string
//         companyName = productPageInfo;
//     } else if (productPageInfo && productPageInfo.brand) {
//         // If productPageInfo is an object with a brand property
//         companyName = productPageInfo.brand;
//     } else if (productPageInfo && productPageInfo.manufacturer) {
//         // If productPageInfo is an object with a manufacturer property
//         companyName = productPageInfo.manufacturer;
        
//     } else {
//         companyName = 'Unknown Company';
//     }
//     // console.log('^^Extracted brand name:', brandName);
//     // console.log('^^Extracted company name:', companyName);

//     // Weird corner case that comes up. Occasionally the company name gets read completely wrong.
//     // That is obviouslt
//     // TODO: Fix the product page info extraction logic to make this corner case check unnecessary.
//     const company_comp_str = companyName.trim().toLocaleLowerCase();
//     // console.log('^^ company_comp_str: ', company_comp_str);
//     if (company_comp_str === 'no' || company_comp_str === 'no.') {
//         companyName = productPageInfo.brand;
//         productPageInfo.manufacturer = companyName;
//         console.log('Weird \'No\' corner case. Changing company/manufacturer name to brand name.')
//         // console.log('^^Extracted company name UPDATED:', companyName);
        
//     }

//     console.log('Extracted company name for API call:', companyName);

//     // If we have a valid company name, fetch political leaning data
//     if (companyName && companyName !== 'Unknown Company' && companyName !== 'no-info-found') {
//         try {
//             // Call the Compass AI political leaning endpoint
//             console.log('Political leaning data fetch initiated:');
//             const politicalData = await this.networkManager.fetchPoliticalLeaning(companyName);
//             console.log('Network call complete!!!');
//             // console.log('Political leaning data received:', politicalData);
            
//             // Update the component with the API data
//             console.log('Will update component now.');
//             this.displayElementManager.updateDisplayElementCompass(productPageInfo, null, politicalData);
            
//         } catch (error) {
//             console.error('Error in political leaning flow:', error);
//             // Fallback to showing basic company info
//             setTimeout(() => {
//                 this.displayElementManager.updateDisplayElementCompass(companyName, null, null);
//             }, 800);
//         }
//     } else {
//         // If no valid company name, show error state
//         console.log('No valid company name found, showing error state');
//         setTimeout(() => {
//             this.displayElementManager.updateDisplayElementCompass('no-info-found', null, null);
//         }, 800);
//     }
//   }

//   async classifyWebpageExtractInfoAndUpdateDisplayWithCompassComponent() {
//     // First check if user has exceeded daily limit
//     const hasExceededLimit = await this.rateLimitManager.hasExceededLimit();
    
//     if (hasExceededLimit) {
//       console.log('⚠️ RATE LIMIT: User has exceeded daily limit, showing paygate');
      
//       // Create and show the paygate component immediately
//       const displayInfo = {'type': 'paygate'};
//       const paygateElement = this.displayElementManager.createDisplayElementWithComponentCompass(displayInfo, null, true);
//       paygateElement.classList.add('paygate');
//       this.displayElementManager.insertDisplayElement(paygateElement);
      
//       // Update with paygate UI
//       setTimeout(() => {
//         this.displayElementManager.updateDisplayElementWithPayGateCompass();
//       }, 300);
      
//       return;
//     }

//     // Show remaining requests for debugging (remove in production)
//     const remainingRequests = await this.rateLimitManager.getRemainingRequests();
//     console.log(`📊 RATE LIMIT: ${remainingRequests} requests remaining today`);

//     // First we create the component. It will initially be in its loading state.
//     console.log('Now displaying extension component...');
//     const displayInfo = {'type': 'product_with_manufacturer'};
//     const loadingElement = this.displayElementManager.createDisplayElementWithComponentCompass(displayInfo, null, true);
//     loadingElement.classList.add('loading');
//     this.displayElementManager.insertDisplayElement(loadingElement);
    
//     // Classify the webpage and extract brand info
//     const productPageInfo = this.classifyProductAndExtractBrandInfo();
    
//     // Logic to take the correct brand and manufacturer info from the product info dict.
//     let companyName = '';
//     let brandName = null;
    
//     // ... (keep all the existing company name extraction logic unchanged)
//     if (productPageInfo === 'no-info-found') {
//         companyName = 'Unknown Company';
//     } else if (productPageInfo && productPageInfo.type === 'product_with_manufacturer' && 
//                 productPageInfo.brand !== productPageInfo.manufacturer) {
//         brandName = productPageInfo.brand;
//         companyName = productPageInfo.manufacturer;
//     } else if (productPageInfo && productPageInfo.type === 'book') {
//         companyName = productPageInfo.publisher || 'Unknown Publisher';
//     } else if (productPageInfo && productPageInfo.type === 'product_with_manufacturer' && productPageInfo.manufacturer !== 'information...') {
//         companyName = productPageInfo.manufacturer || productPageInfo.brand || 'Unknown Company';
//     } else if (ownerInfo && ownerInfo.owning_company_name && ownerInfo.owning_company_name !== productPageInfo) {
//         companyName = ownerInfo.owning_company_name;
//     } else if (productPageInfo && typeof productPageInfo === 'string') {
//         companyName = productPageInfo;
//     } else if (productPageInfo && productPageInfo.brand) {
//         companyName = productPageInfo.brand;
//     } else if (productPageInfo && productPageInfo.manufacturer) {
//         companyName = productPageInfo.manufacturer;
//     } else {
//         companyName = 'Unknown Company';
//     }

//     const company_comp_str = companyName.trim().toLocaleLowerCase();
//     if (company_comp_str === 'no' || company_comp_str === 'no.') {
//         companyName = productPageInfo.brand;
//         productPageInfo.manufacturer = companyName;
//         console.log('Weird \'No\' corner case. Changing company/manufacturer name to brand name.');
//     }

//     console.log('Extracted company name for API call:', companyName);

//     // If we have a valid company name, fetch political leaning data
//     if (companyName && companyName !== 'Unknown Company' && companyName !== 'no-info-found') {
//         try {
//             console.log('Political leaning data fetch initiated:');
//             const politicalData = await this.networkManager.fetchPoliticalLeaning(companyName);
//             console.log('Network call complete!!!');
            
//             // 🎯 CRITICAL: Increment request counter ONLY on successful API response
//             const newRequestCount = await this.rateLimitManager.incrementRequestCount();
//             console.log(`✅ RATE LIMIT: Request completed successfully (${newRequestCount}/10)`);
            
//             // Check if this was the last free request
//             if (newRequestCount >= this.rateLimitManager.DAILY_LIMIT) {
//                 console.log('🚨 RATE LIMIT: User has reached daily limit after this request');
//                 // You could show a notification here about reaching the limit
//             }
            
//             // Update the component with the API data
//             console.log('Will update component now.');
//             this.displayElementManager.updateDisplayElementCompass(productPageInfo, null, politicalData);
            
//         } catch (error) {
//             console.error('Error in political leaning flow:', error);
//             // NOTE: We don't increment counter on API failures
//             console.log('⚠️ RATE LIMIT: Request failed, not incrementing counter');
            
//             // Fallback to showing basic company info
//             setTimeout(() => {
//                 this.displayElementManager.updateDisplayElementCompass(companyName, null, null);
//             }, 800);
//         }
//     } else {
//         // If no valid company name, show error state (don't increment counter)
//         console.log('No valid company name found, showing error state');
//         console.log('⚠️ RATE LIMIT: No valid company, not incrementing counter');
//         setTimeout(() => {
//             this.displayElementManager.updateDisplayElementCompass('no-info-found', null, null);
//         }, 800);
//     }
//   }

  async classifyWebpageExtractInfoAndUpdateDisplayWithCompassComponent() {
    // First check if user has exceeded daily limit
    const hasExceededLimit = await this.rateLimitManager.hasExceededLimit();
    
    // Show remaining requests for debugging (remove in production)
    const remainingRequests = await this.rateLimitManager.getRemainingRequests();
    console.log(`📊 RATE LIMIT: ${remainingRequests} requests remaining today`);

    if (hasExceededLimit) {
      console.log('⚠️ RATE LIMIT: User has exceeded daily limit, showing paygate');
      
      // Create and show the paygate component immediately
      const displayInfo = {'type': 'paygate'};
    //   const paygateElement = this.displayElementManager.createDisplayElementWithComponentCompass(displayInfo, null, true);
    //   paygateElement.classList.add('paygate');
    //   this.displayElementManager.insertDisplayElement(paygateElement);
      // ^^^^ This is the code that actually displays on the page.

      // Update with paygate UI
    //   setTimeout(() => {
        // console.log('Updating to paygate UI');
        // this.displayElementManager.updateDisplayElementWithPayGateCompass();
        // this.displayElementManager.updateDisplayElementWithPayGateCompass();
    //   }, 300);
      
        // this.displayElementManager.createDisplayElementWithPaygate(brandInfo, ownerInfo = null, isLoading = false, isProUser = false)
        // console.log('Will update component now.');
        // this.displayElementManager.updateDisplayElementCompass(productPageInfo, null, politicalData);
            


        // When user hits the paywall - free user needs to upgrade
        const paygateElement = this.displayElementManager.createDisplayElementWithPaygate(displayInfo, null, false, false);
        this.displayElementManager.insertDisplayElement(paygateElement);

      return;
    }

    
    // First we create the component. It will initially be in its loading state.
    console.log('Now displaying extension component...');
    const displayInfo = {'type': 'product_with_manufacturer'};
    const loadingElement = this.displayElementManager.createDisplayElementWithComponentCompass(displayInfo, null, true);
    loadingElement.classList.add('loading');
    this.displayElementManager.insertDisplayElement(loadingElement);
    
    // Classify the webpage and extract brand info
    const productPageInfo = this.classifyProductAndExtractBrandInfo();
    
    // Logic to take the correct brand and manufacturer info from the product info dict.
    let companyName = '';
    let brandName = null;
    
    // ... (keep all the existing company name extraction logic unchanged)
    if (productPageInfo === 'no-info-found') {
        companyName = 'Unknown Company';
    } else if (productPageInfo && productPageInfo.type === 'product_with_manufacturer' && 
                productPageInfo.brand !== productPageInfo.manufacturer) {
        brandName = productPageInfo.brand;
        companyName = productPageInfo.manufacturer;
    } else if (productPageInfo && productPageInfo.type === 'book') {
        companyName = productPageInfo.publisher || 'Unknown Publisher';
    } else if (productPageInfo && productPageInfo.type === 'product_with_manufacturer' && productPageInfo.manufacturer !== 'information...') {
        companyName = productPageInfo.manufacturer || productPageInfo.brand || 'Unknown Company';
    } else if (ownerInfo && ownerInfo.owning_company_name && ownerInfo.owning_company_name !== productPageInfo) {
        companyName = ownerInfo.owning_company_name;
    } else if (productPageInfo && typeof productPageInfo === 'string') {
        companyName = productPageInfo;
    } else if (productPageInfo && productPageInfo.brand) {
        companyName = productPageInfo.brand;
    } else if (productPageInfo && productPageInfo.manufacturer) {
        companyName = productPageInfo.manufacturer;
    } else {
        companyName = 'Unknown Company';
    }

    const company_comp_str = companyName.trim().toLocaleLowerCase();
    if (company_comp_str === 'no' || company_comp_str === 'no.') {
        companyName = productPageInfo.brand;
        productPageInfo.manufacturer = companyName;
        console.log('Weird \'No\' corner case. Changing company/manufacturer name to brand name.');
    }

    console.log('Extracted company name for API call:', companyName);

    // If we have a valid company name, fetch political leaning data
    if (companyName && companyName !== 'Unknown Company' && companyName !== 'no-info-found') {
        try {
            console.log('Political leaning data fetch initiated:');
            const politicalData = await this.networkManager.fetchPoliticalLeaning(companyName);
            console.log('Network call complete!!!');
            
            // 🎯 CRITICAL: Increment request counter ONLY on successful API response
            // But only if user is not a pro user
            if (!this.rateLimitManager.isProUser()) {
                const newRequestCount = await this.rateLimitManager.incrementRequestCount();
                console.log(`✅ RATE LIMIT: Request completed successfully (${newRequestCount}/10)`);
                
                // Check if this was the last free request
                if (newRequestCount >= this.rateLimitManager.DAILY_LIMIT) {
                    console.log('🚨 RATE LIMIT: User has reached daily limit after this request');
                    // You could show a notification here about reaching the limit
                    // TODO: Do things here. / THIS is only the warning case NOT the out of requests case.
                }
            } else {
                console.log('✅ PRO USER: Request completed, no rate limit applied');
            }
            
            // Update the component with the API data
            // THIS IS WHAT INITIALLY INSERTS THE COMPONENT ON THE PRODUCT PAGE.
            console.log('Will update component now.');
            this.displayElementManager.updateDisplayElementCompass(productPageInfo, null, politicalData);
            
        } catch (error) {
            console.error('Error in political leaning flow:', error);
            // NOTE: We don't increment counter on API failures
            console.log('⚠️ RATE LIMIT: Request failed, not incrementing counter');
            
            // Fallback to showing basic company info
            setTimeout(() => {
                this.displayElementManager.updateDisplayElementCompass(companyName, null, null);
            }, 800);
        }
    } else {
        // If no valid company name, show error state (don't increment counter)
        console.log('No valid company name found, showing error state');
        console.log('⚠️ RATE LIMIT: No valid company, not incrementing counter');
        setTimeout(() => {
            this.displayElementManager.updateDisplayElementCompass('no-info-found', null, null);
        }, 800);
    }
  }

  // Also add this debug method to test the DisplayElementManager
  testDisplayElementManager() {
    console.log('🧪 DEBUG: Testing DisplayElementManager...');
    
    try {
        console.log('🔍 DEBUG: DisplayElementManager exists:', !!this.displayElementManager);
        console.log('🔍 DEBUG: DisplayElementManager methods:');
        console.log('  - createDisplayElementWithComponentCompass:', typeof this.displayElementManager.createDisplayElementWithComponentCompass);
        console.log('  - insertDisplayElement:', typeof this.displayElementManager.insertDisplayElement);
        console.log('  - updateDisplayElementCompass:', typeof this.displayElementManager.updateDisplayElementCompass);
        
        // Test creating a simple element
        const testElement = document.createElement('div');
        testElement.textContent = 'Test Element';
        testElement.style.cssText = 'background: blue; color: white; padding: 10px;';
        
        console.log('🧪 DEBUG: Testing insertDisplayElement with simple element...');
        this.displayElementManager.insertDisplayElement(testElement);
        
        // Check if it was inserted
        setTimeout(() => {
            const isInDOM = document.contains(testElement);
            console.log('🔍 DEBUG: Test element is in DOM:', isInDOM);
            if (isInDOM) {
                testElement.remove();
                console.log('🧹 DEBUG: Test element removed');
            }
        }, 1000);
        
    } catch (error) {
        console.error('💥 DEBUG: Error testing DisplayElementManager:', error);
    }
  }

  

  // ENHANCED manualRefreshComponent method for the class
  async manualRefreshComponent() {
      console.log('🔄 CLASS DEBUG: Manual refresh triggered from instance');
      
      try {
          // Remove any existing components first
          await removeExistingComponents();

          // Reset the display element
          if (this.displayElementManager) {
              this.displayElementManager.displayElement = null;
          }

        // Wait a bit for DOM to settle
          await new Promise(resolve => setTimeout(resolve, 500));

          // Check if required components exist
          if (!this.displayElementManager) {
              console.log('🔧 CLASS DEBUG: Re-creating DisplayElementManager');
              this.displayElementManager = new DisplayElementManager(this.layoutMode);
          }

          // Force re-initialization with current layout mode
          console.log('🔄 CLASS DEBUG: Re-initializing with layout mode:', this.layoutMode);
          
          // Re-run the main component insertion logic
          await this.classifyWebpageExtractInfoAndUpdateDisplayWithCompassComponent();
          
          console.log('✅ CLASS DEBUG: Manual refresh completed successfully');
          return { success: true, message: 'Component refreshed successfully via class instance' };
          
      } catch (error) {
          console.error('💥 CLASS DEBUG: Error during manual refresh:', error);
          
          // Fall back to global last resort method
          try {
              await this.displayElementManager.lastResortComponentInsertion();
              return { success: true, message: 'Component inserted via fallback method' };
          } catch (fallbackError) {
              return { success: false, message: `Error: ${error.message}` };
          }
      }
  }

  
  // Add utility methods for rate limit management
  async getRateLimitStatus() {
    return await this.rateLimitManager.getUsageStats();
  }

  async resetRateLimit() {
    await this.rateLimitManager.resetUsageData();
    console.log('Rate limit reset by user/admin');
  }
}

// 4. Add a debug function to test manual refresh from console
// Add this for console testing
window.testManualRefresh = function() {
    console.log('🧪 CONSOLE DEBUG: Testing manual refresh from console');
    handleManualRefresh()
        .then(result => console.log('✅ CONSOLE DEBUG: Result:', result))
        .catch(error => console.error('💥 CONSOLE DEBUG: Error:', error));
};

// // Console debugging functions
// window.checkRateLimit = async function() {
//     if (globalAmazonBrandTracker && globalAmazonBrandTracker.rateLimitManager) {
//         const stats = await globalAmazonBrandTracker.getRateLimitStatus();
//         console.table(stats);
//         return stats;
//     } else {
//         console.log('Rate limit manager not available');
//         return null;
//     }
// };

// window.resetRateLimit = async function() {
//     if (globalAmazonBrandTracker) {
//         await globalAmazonBrandTracker.resetRateLimit();
//         console.log('✅ Rate limit reset successfully');
//     } else {
//         console.log('❌ AmazonBrandTracker not available');
//     }
// };

// Console debugging functions
window.checkRateLimit = async function() {
    if (globalAmazonBrandTracker && globalAmazonBrandTracker.rateLimitManager) {
        const stats = await globalAmazonBrandTracker.getRateLimitStatus();
        console.table(stats);
        return stats;
    } else {
        console.log('Rate limit manager not available');
        return null;
    }
};

window.resetRateLimit = async function() {
    if (globalAmazonBrandTracker) {
        await globalAmazonBrandTracker.resetRateLimit();
        console.log('✅ Rate limit reset successfully');
    } else {
        console.log('❌ AmazonBrandTracker not available');
    }
};

// Initialize the tracker
new AmazonBrandTracker();