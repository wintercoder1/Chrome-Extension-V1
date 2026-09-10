// Rate Limiting Manager for Chrome Extension
class RateLimitManager {
  constructor() {
    this.DAILY_LIMIT = 2;// 10; //20; //10; //8; //2; // 8; //10;
    this.STORAGE_KEY = 'tilt_ai_usage_data';
  }

  // Get current date as YYYY-MM-DD string
  getCurrentDateString() {
    const now = new Date();
    return now.getFullYear() + '-' + 
           String(now.getMonth() + 1).padStart(2, '0') + '-' + 
           String(now.getDate()).padStart(2, '0');
  }

  // Get usage data from Chrome storage
  async getUsageData() {
    try {
      const result = await chrome.storage.local.get([this.STORAGE_KEY]);
      // console.log('result:')
      // console.log(result)
      // console.log('result[this.STORAGE_KEY]:')
      // console.log(result[this.STORAGE_KEY])
      // Note:result[this.STORAGE_KEY]  is in fact a dict
      return result[this.STORAGE_KEY] || {
        date: this.getCurrentDateString(),
        requestCount: 0
      };
    } catch (error) {
      console.error('Error getting usage data:', error);
      return {
        date: this.getCurrentDateString(),
        requestCount: 0
      };
    }
  }

  // Save usage data to Chrome storage
  async saveUsageData(usageData) {
    try {
      await chrome.storage.local.set({
        [this.STORAGE_KEY]: usageData
      });
    } catch (error) {
      console.error('Error saving usage data:', error);
    }
  }

  // Check if user has exceeded daily limit
  async hasExceededLimit() {
    // First check if user is a pro user - pro users have no limits
    if (this.isProUser()) {
      return false;
    }

    const usageData = await this.getUsageData();
    const currentDate = this.getCurrentDateString();

    // If it's a new day, reset the counter
    if (usageData.date !== currentDate) {
      return false;
    }
    console.log('usageData.requestCount:')
    console.log(usageData.requestCount)
    console.log('this.DAILY_LIMIT:')
    console.log(this.DAILY_LIMIT)
    return usageData.requestCount > this.DAILY_LIMIT;
  }

  // Check if user is a pro user (no rate limits)
  isProUser() {
    try {
      const proStatus = localStorage.getItem('tilt_ai_pro_status');
      return proStatus === 'active' || proStatus === 'purchased';
    } catch (error) {
      console.error('Error checking pro status:', error);
      return false;
    }
  }

  // Get remaining requests for today
  async getRemainingRequests() {
    const usageData = await this.getUsageData();
    const currentDate = this.getCurrentDateString();

    // If it's a new day, user gets full limit
    if (usageData.date !== currentDate) {
      return this.DAILY_LIMIT;
    }

    return Math.max(0, this.DAILY_LIMIT - usageData.requestCount);
  }

  // Increment the request counter (call this when a request is completed successfully)
  async incrementRequestCount() {
    const currentDate = this.getCurrentDateString();
    let usageData = await this.getUsageData();

    // If it's a new day, reset the counter
    if (usageData.date !== currentDate) {
      usageData = {
        date: currentDate,
        requestCount: 0
      };
    }

    // Increment the counter
    usageData.requestCount++;
    
    await this.saveUsageData(usageData);
    
    console.log(`Request count incremented to ${usageData.requestCount}/${this.DAILY_LIMIT} for ${currentDate}`);
    
    return usageData.requestCount;
  }

  // Reset usage data (useful for testing or admin functions)
  async resetUsageData() {
    const resetData = {
      date: this.getCurrentDateString(),
      requestCount: 0
    };
    await this.saveUsageData(resetData);
    console.log('Usage data reset');
  }

  // Get usage statistics for debugging
  async getUsageStats() {
    const usageData = await this.getUsageData();
    const remaining = await this.getRemainingRequests();
    const hasExceeded = await this.hasExceededLimit();
    
    return {
      date: usageData.date,
      requestCount: usageData.requestCount,
      remainingRequests: remaining,
      hasExceededLimit: hasExceeded,
      dailyLimit: this.DAILY_LIMIT
    };
  }
};

// Rate Limiting Manager for Chrome Extension
// class RateLimitManager {
//   constructor() {
//     this.DAILY_LIMIT = 2; //10;
//     this.STORAGE_KEY = 'tilt_ai_usage_data';
//   }

//   // Get current date as YYYY-MM-DD string
//   getCurrentDateString() {
//     const now = new Date();
//     return now.getFullYear() + '-' + 
//            String(now.getMonth() + 1).padStart(2, '0') + '-' + 
//            String(now.getDate()).padStart(2, '0');
//   }

//   // Get usage data from Chrome storage
//   async getUsageData() {
//     try {
//       const result = await chrome.storage.local.get([this.STORAGE_KEY]);
//       return result[this.STORAGE_KEY] || {
//         date: this.getCurrentDateString(),
//         requestCount: 0
//       };
//     } catch (error) {
//       console.error('Error getting usage data:', error);
//       return {
//         date: this.getCurrentDateString(),
//         requestCount: 0
//       };
//     }
//   }

//   // Save usage data to Chrome storage
//   async saveUsageData(usageData) {
//     try {
//       await chrome.storage.local.set({
//         [this.STORAGE_KEY]: usageData
//       });
//     } catch (error) {
//       console.error('Error saving usage data:', error);
//     }
//   }

//   // Check if user has exceeded daily limit
//   async hasExceededLimit() {
//     const usageData = await this.getUsageData();
//     const currentDate = this.getCurrentDateString();

//     // If it's a new day, reset the counter
//     if (usageData.date !== currentDate) {
//       return false;
//     }

//     return usageData.requestCount >= this.DAILY_LIMIT;
//   }

//   // Get remaining requests for today
//   async getRemainingRequests() {
//     const usageData = await this.getUsageData();
//     const currentDate = this.getCurrentDateString();

//     // If it's a new day, user gets full limit
//     if (usageData.date !== currentDate) {
//       return this.DAILY_LIMIT;
//     }

//     return Math.max(0, this.DAILY_LIMIT - usageData.requestCount);
//   }

//   // Increment the request counter (call this when a request is completed successfully)
//   async incrementRequestCount() {
//     const currentDate = this.getCurrentDateString();
//     let usageData = await this.getUsageData();

//     // If it's a new day, reset the counter
//     if (usageData.date !== currentDate) {
//       usageData = {
//         date: currentDate,
//         requestCount: 0
//       };
//     }

//     // Increment the counter
//     usageData.requestCount++;
    
//     await this.saveUsageData(usageData);
    
//     console.log(`Request count incremented to ${usageData.requestCount}/${this.DAILY_LIMIT} for ${currentDate}`);
    
//     return usageData.requestCount;
//   }

//   // Reset usage data (useful for testing or admin functions)
//   async resetUsageData() {
//     const resetData = {
//       date: this.getCurrentDateString(),
//       requestCount: 0
//     };
//     await this.saveUsageData(resetData);
//     console.log('Usage data reset');
//   }

//   // Get usage statistics for debugging
//   async getUsageStats() {
//     const usageData = await this.getUsageData();
//     const remaining = await this.getRemainingRequests();
//     const hasExceeded = await this.hasExceededLimit();
    
//     return {
//       date: usageData.date,
//       requestCount: usageData.requestCount,
//       remainingRequests: remaining,
//       hasExceededLimit: hasExceeded,
//       dailyLimit: this.DAILY_LIMIT
//     };
//   }
// }



// Updated AmazonBrandTracker class with rate limiting integration
// class AmazonBrandTracker {
//   constructor() {
//     this.brandInfo = null;
//     this.layoutDefaultMode = 'product-details';
//     this.layoutMode = this.layoutDefaultMode;
    
//     // Initialize rate limiting
//     this.rateLimitManager = new RateLimitManager();

//     this.pageParser = new TypicalProductPageParser();
//     this.bookPageParser = new BookPageParser();
//     this.networkManager = new NetworkManager();

//     globalAmazonBrandTracker = this;
//     this.initializeWithCSS();
//   }

//   // ... (keep all existing methods unchanged until classifyWebpageExtractInfoAndUpdateDisplayWithCipherComponent)

//   async classifyWebpageExtractInfoAndUpdateDisplayWithCipherComponent() {
//     // First check if user has exceeded daily limit
//     const hasExceededLimit = await this.rateLimitManager.hasExceededLimit();
    
//     if (hasExceededLimit) {
//       console.log('⚠️ RATE LIMIT: User has exceeded daily limit, showing paygate');
      
//       // Create and show the paygate component immediately
//       const displayInfo = {'type': 'paygate'};
//       const paygateElement = this.displayElementManager.createDisplayElementWithComponentCipher(displayInfo, null, true);
//       paygateElement.classList.add('paygate');
//       this.displayElementManager.insertDisplayElement(paygateElement);
      
//       // Update with paygate UI
//       setTimeout(() => {
//         this.displayElementManager.updateDisplayElementWithPayGateCipher();
//       }, 300);
      
//       return;
//     }

//     // Show remaining requests for debugging (remove in production)
//     const remainingRequests = await this.rateLimitManager.getRemainingRequests();
//     console.log(`📊 RATE LIMIT: ${remainingRequests} requests remaining today`);

//     // First we create the component. It will initially be in its loading state.
//     console.log('Now displaying extension component...');
//     const displayInfo = {'type': 'product_with_manufacturer'};
//     const loadingElement = this.displayElementManager.createDisplayElementWithComponentCipher(displayInfo, null, true);
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
//             this.displayElementManager.updateDisplayElementCipher(productPageInfo, null, politicalData);
            
//         } catch (error) {
//             console.error('Error in political leaning flow:', error);
//             // NOTE: We don't increment counter on API failures
//             console.log('⚠️ RATE LIMIT: Request failed, not incrementing counter');
            
//             // Fallback to showing basic company info
//             setTimeout(() => {
//                 this.displayElementManager.updateDisplayElementCipher(companyName, null, null);
//             }, 800);
//         }
//     } else {
//         // If no valid company name, show error state (don't increment counter)
//         console.log('No valid company name found, showing error state');
//         console.log('⚠️ RATE LIMIT: No valid company, not incrementing counter');
//         setTimeout(() => {
//             this.displayElementManager.updateDisplayElementCipher('no-info-found', null, null);
//         }, 800);
//     }
//   }

//   // Add utility methods for rate limit management
//   async getRateLimitStatus() {
//     return await this.rateLimitManager.getUsageStats();
//   }

//   async resetRateLimit() {
//     await this.rateLimitManager.resetUsageData();
//     console.log('Rate limit reset by user/admin');
//   }
// }

