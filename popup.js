// // Updated popup.js - Direct script injection when content script fails

// document.addEventListener('DOMContentLoaded', async () => {
//   const layoutToggle = document.getElementById('layoutToggle');
//   const previewText = document.getElementById('previewText');
//   const status = document.getElementById('status');
//   const refreshButton = document.getElementById('refreshButton');
//   const debugSection = document.getElementById('debugSection');
//   const debugInfo = document.getElementById('debugInfo');
  
//   // Load current setting
//   const result = await chrome.storage.sync.get(['layoutMode']);
//   const layoutModeStr = result.layoutMode ? result.layoutMode.trim() : 'undefined';
//   const isProductDetails = (layoutModeStr === 'product-details' || layoutModeStr === 'undefined' || layoutModeStr === null);
//   updateToggleState(isProductDetails);
  
//   // Toggle click handler
//   layoutToggle.addEventListener('click', async () => {
//     const newMode = layoutToggle.classList.contains('active') ? 'buybox' : 'product-details';
    
//     await chrome.storage.sync.set({ layoutMode: newMode });
//     updateToggleState(newMode === 'product-details');
//     showStatus('Settings saved successfully!', 'success');
    
//     try {
//       const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//       if (tab && tab.url && tab.url.includes('amazon.')) {
//         chrome.tabs.reload(tab.id);
//       }
//     } catch (error) {
//       console.log('Could not refresh tab:', error);
//     }
//   });

//   // Enhanced manual refresh button handler
//   refreshButton.addEventListener('click', async () => {
//     try {
//       refreshButton.disabled = true;
//       refreshButton.textContent = '🔄 Refreshing...';
      
//       const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
//       if (!tab || !tab.url || !tab.url.includes('amazon.')) {
//         showStatus('Please navigate to an Amazon product page first', 'warning');
//         return;
//       }

//       debugSection.style.display = 'block';
//       debugInfo.textContent = 'Checking content script status...';

//       // First try to communicate with existing content script
//       try {
//         const response = await chrome.tabs.sendMessage(tab.id, { 
//           action: 'manualRefresh',
//           timestamp: Date.now()
//         });
        
//         if (response && response.success) {
//           showStatus('Component refresh successful!', 'success');
//           debugInfo.textContent = `Success via content script: ${response.message}`;
//           return;
//         }
//       } catch (messageError) {
//         console.log('Content script not responding, using direct injection');
//         debugInfo.textContent = 'Content script not found. Injecting extension directly...';
//       }

//       // If content script doesn't respond, inject our extension directly
//       await injectExtensionDirectly(tab.id);
      
//     } catch (error) {
//       console.error('Error in manual refresh:', error);
//       showStatus('Error during refresh attempt', 'error');
//       debugInfo.textContent = `Error: ${error.message}`;
//     } finally {
//       refreshButton.disabled = false;
//       refreshButton.textContent = '🔄 Force Refresh Component';
//     }
//   });

//   // Function to inject extension directly when content script fails
//   async function injectExtensionDirectly(tabId) {
//     try {
//       debugInfo.textContent = 'Injecting extension files directly...';
      
//       // Get the current layout mode for injection
//       const result = await chrome.storage.sync.get(['layoutMode']);
//       const layoutMode = result.layoutMode || 'product-details';
      
//       // Inject CSS first
//       try {
//         await chrome.scripting.insertCSS({
//           target: { tabId: tabId },
//           files: ['Components/tilt-ai-styles.css']
//         });
//         debugInfo.textContent = 'CSS injected successfully...';
//       } catch (cssError) {
//         console.log('CSS injection failed, continuing without it');
//       }

//       // Inject all required JavaScript files in order
//       const scriptFiles = [
//         'Modules/PageParser.js',
//         'Modules/BookPageParser.js', 
//         'Modules/NetworkManager.js',
//         'Modules/DisplayElementManager.js',
//         'Components/CompassAIComponent.js'
//       ];

//       for (const file of scriptFiles) {
//         try {
//           await chrome.scripting.executeScript({
//             target: { tabId: tabId },
//             files: [file]
//           });
//           debugInfo.textContent = `Injected ${file}...`;
//           await new Promise(resolve => setTimeout(resolve, 100)); // Small delay between files
//         } catch (fileError) {
//           console.error(`Failed to inject ${file}:`, fileError);
//           // Continue with other files
//         }
//       }

//       // Finally inject the main content script with manual execution
//       await chrome.scripting.executeScript({
//         target: { tabId: tabId },
//         func: initializeExtensionManually,
//         args: [layoutMode]
//       });

//       debugInfo.textContent = 'Extension injected and initialized successfully!';
//       showStatus('Extension injected successfully! Component should now appear.', 'success');
      
//     } catch (injectionError) {
//       console.error('Direct injection failed:', injectionError);
//       debugInfo.textContent = `Injection failed: ${injectionError.message}`;
//       showStatus('Direct injection failed. Try reloading the page.', 'error');
//     }
//   }
  
//   function updateToggleState(isProductDetails) {
//     if (isProductDetails) {
//       layoutToggle.classList.add('active');
//       previewText.textContent = 'Brand info will appear in the product details area (left side)';
//     } else {
//       layoutToggle.classList.remove('active');
//       previewText.textContent = 'Brand info will appear in the buy box (right side)';
//     }
//   }
  
//   function showStatus(message, type = 'success') {
//     status.textContent = message;
//     status.className = `status ${type}`;
//     status.style.display = 'block';
//     setTimeout(() => {
//       status.style.display = 'none';
//     }, 4000);
//   }
// });

// // Function that gets injected directly into the page to initialize the extension
// function initializeExtensionManually(layoutMode) {
//   console.log('🚀 DIRECT INJECTION: Initializing extension manually with layout mode:', layoutMode);
  
//   try {
//     // Remove any existing components first
//     const existingComponents = document.querySelectorAll(
//       '.brand-owner-info, .brand-owner-info-container, .tilt-ai-container, ' +
//       '[class*="fallback-insertion"], .emergency-insertion'
//     );
    
//     console.log(`🧹 DIRECT INJECTION: Removing ${existingComponents.length} existing components`);
//     existingComponents.forEach(component => component.remove());

//     // Check if required classes are available
//     if (typeof DisplayElementManager === 'undefined') {
//       console.error('❌ DIRECT INJECTION: DisplayElementManager not available');
//       createSimpleTestComponent('DisplayElementManager class not loaded');
//       return;
//     }

//     if (typeof TypicalProductPageParser === 'undefined') {
//       console.error('❌ DIRECT INJECTION: TypicalProductPageParser not available');
//       createSimpleTestComponent('TypicalProductPageParser class not loaded');
//       return;
//     }

//     // Create a minimal version of the extension
//     console.log('🔧 DIRECT INJECTION: Creating extension components...');
    
//     const pageParser = new TypicalProductPageParser();
//     const networkManager = new NetworkManager();
//     const displayManager = new DisplayElementManager(layoutMode);

//     // Extract brand info
//     let brandInfo = null;
//     try {
//       // Try manufacturer first
//       brandInfo = pageParser.extractManufacturerInfo();
//       if (!brandInfo || !brandInfo.manufacturer || brandInfo.manufacturer === 'information...') {
//         // Fall back to brand extraction
//         const brandName = pageParser.extractBrandName();
//         if (brandName) {
//           brandInfo = {
//             type: 'product_with_manufacturer',
//             brand: brandName,
//             manufacturer: brandName
//           };
//         }
//       }
//     } catch (extractionError) {
//       console.error('🔍 DIRECT INJECTION: Brand extraction failed:', extractionError);
//       brandInfo = 'no-info-found';
//     }

//     console.log('🔍 DIRECT INJECTION: Extracted brand info:', brandInfo);

//     // Create and insert component
//     if (typeof window.CompassAIComponent !== 'undefined') {
//       const loadingElement = displayManager.createDisplayElementWithComponentCompass(
//         brandInfo || 'no-info-found', 
//         null, 
//         true
//       );
      
//       // Try to insert with all our fallback methods
//       try {
//         displayManager.insertDisplayElement(loadingElement);
//         console.log('✅ DIRECT INJECTION: Component inserted successfully');
        
//         // If we have valid brand info, try to get political data
//         if (brandInfo && brandInfo !== 'no-info-found') {
//           const companyName = brandInfo.manufacturer || brandInfo.brand || brandInfo;
//           if (companyName && typeof companyName === 'string' && companyName !== 'Unknown Company') {
//             networkManager.fetchPoliticalLeaning(companyName)
//               .then(politicalData => {
//                 console.log('🌐 DIRECT INJECTION: Got political data:', politicalData);
//                 displayManager.updateDisplayElementCompass(brandInfo, null, politicalData);
//               })
//               .catch(networkError => {
//                 console.error('🌐 DIRECT INJECTION: Network error:', networkError);
//                 displayManager.updateDisplayElementCompass(brandInfo, null, null);
//               });
//           }
//         }
        
//       } catch (insertionError) {
//         console.error('💥 DIRECT INJECTION: Insertion failed:', insertionError);
//         createSimpleTestComponent(`Insertion failed: ${insertionError.message}`);
//       }
//     } else {
//       console.error('❌ DIRECT INJECTION: CompassAIComponent not available');
//       createSimpleTestComponent('CompassAIComponent not loaded');
//     }
    
//   } catch (overallError) {
//     console.error('💥 DIRECT INJECTION: Overall initialization failed:', overallError);
//     createSimpleTestComponent(`Initialization failed: ${overallError.message}`);
//   }

//   // Helper function to create a simple test component
//   function createSimpleTestComponent(message) {
//     const testComponent = document.createElement('div');
//     testComponent.style.cssText = `
//       position: fixed;
//       top: 100px;
//       right: 10px;
//       z-index: 9999;
//       background: #ff4444;
//       color: white;
//       padding: 15px;
//       border-radius: 8px;
//       max-width: 250px;
//       font-family: Arial, sans-serif;
//       box-shadow: 0 4px 8px rgba(0,0,0,0.3);
//     `;
//     testComponent.innerHTML = `
//       <div style="font-weight: bold; margin-bottom: 8px;">
//         🔧 Tilt AI - Direct Injection
//       </div>
//       <div style="font-size: 12px;">
//         ${message}
//         <br><br>
//         Time: ${new Date().toLocaleTimeString()}
//         <br>URL: ${window.location.hostname}
//       </div>
//     `;
    
//     document.body.appendChild(testComponent);
//     console.log('🆘 DIRECT INJECTION: Created simple test component');
    
//     // Auto-remove after 10 seconds
//     setTimeout(() => {
//       testComponent.remove();
//     }, 10000);
//   }
// }

// popup.js
document.addEventListener('DOMContentLoaded', async () => {
  const layoutToggle = document.getElementById('layoutToggle');
  const previewText = document.getElementById('previewText');
  const status = document.getElementById('status');
  const refreshButton = document.getElementById('refreshButton');
  const debugSection = document.getElementById('debugSection');
  const debugInfo = document.getElementById('debugInfo');
  
  // Load current setting
  const result = await chrome.storage.sync.get(['layoutMode']);
  // Handle states were the default layout mode gets intertreted as 'undefined'.
  const layoutModeStr = result.layoutMode ? result.layoutMode.trim() : 'undefined';
  const isProductDetails = (layoutModeStr  === 'product-details' || layoutModeStr === 'undefined' || layoutModeStr === null);
  // Set initial toggle state
  updateToggleState(isProductDetails);
  
  // Toggle click handler
  layoutToggle.addEventListener('click', async () => {
    const newMode = layoutToggle.classList.contains('active') ? 'buybox' : 'product-details';
    
    // Save to storage
    await chrome.storage.sync.set({ layoutMode: newMode });
    
    // Update UI
    updateToggleState(newMode === 'product-details');
    
    // Show success message
    showStatus('Settings saved successfully!', 'success');
    
    // Refresh current Amazon tab if it exists
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.url && tab.url.includes('amazon.')) {
        chrome.tabs.reload(tab.id);
      }
    } catch (error) {
      console.log('Could not refresh tab:', error);
    }
  });

  // Manual refresh button handler
  refreshButton.addEventListener('click', async () => {
    try {
      // Disable button and show loading state
      refreshButton.disabled = true;
      refreshButton.textContent = '🔄 Refreshing...';
      
      // Get current active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab || !tab.url || !tab.url.includes('amazon.')) {
        showStatus('Please navigate to an Amazon product page first', 'warning');
        return;
      }

      // Show debug section
      debugSection.style.display = 'block';
      debugInfo.textContent = 'Sending refresh command to content script...';

      // Send message to content script to manually refresh the component
      try {
        const response = await chrome.tabs.sendMessage(tab.id, { 
          action: 'manualRefresh',
          timestamp: Date.now()
        });
        
        if (response && response.success) {
          showStatus('Component refresh initiated successfully!', 'success');
          debugInfo.textContent = `Success: ${response.message || 'Component refreshed'}`;
        } else {
          showStatus('Refresh completed with warnings', 'warning');
          debugInfo.textContent = `Warning: ${response?.message || 'Unknown response'}`;
        }
      } catch (messageError) {
        console.error('Error sending message to content script:', messageError);
        showStatus('Could not communicate with page. Try reloading the page first.', 'error');
        debugInfo.textContent = `Error: ${messageError.message}`;
      }
      
    } catch (error) {
      console.error('Error in manual refresh:', error);
      showStatus('Error during refresh attempt', 'error');
      debugInfo.textContent = `Error: ${error.message}`;
    } finally {
      // Re-enable button
      refreshButton.disabled = false;
      refreshButton.textContent = '🔄 Force Refresh Component';
    }
  });
  
  function updateToggleState(isProductDetails) {
    if (isProductDetails) {
      layoutToggle.classList.add('active');
      previewText.textContent = 'Brand info will appear in the product details area (left side)';
    } else {
      layoutToggle.classList.remove('active');
      previewText.textContent = 'Brand info will appear in the buy box (right side)';
    }
  }
  
  function showStatus(message, type = 'success') {
    status.textContent = message;
    status.className = `status ${type}`;
    status.style.display = 'block';
    setTimeout(() => {
      status.style.display = 'none';
    }, 4000);
  }
});
