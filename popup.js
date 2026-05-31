// popup.js
document.addEventListener('DOMContentLoaded', async () => {
  const status = document.getElementById('status');
  const refreshButton = document.getElementById('refreshButton');
  const overlayButton = document.getElementById('overlayButton');
  const debugSection = document.getElementById('debugSection');
  const debugInfo = document.getElementById('debugInfo');
  const categorySelect = document.getElementById('categorySelect');

  // Load current settings
  const result = await chrome.storage.sync.get(['analysisCategory']);

  // Set initial category dropdown value
  categorySelect.value = result.analysisCategory || 'Political Leaning';

  // Category change handler
  categorySelect.addEventListener('change', async () => {
    const newCategory = categorySelect.value;
    await chrome.storage.sync.set({ analysisCategory: newCategory });
    showStatus(`Category set to "${newCategory}"`, 'success');

    // Notify the active Amazon tab to re-run with the new category
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.url && tab.url.includes('amazon.')) {
        chrome.tabs.sendMessage(tab.id, { action: 'categoryChanged', category: newCategory });
      }
    } catch (error) {
      console.log('Could not notify tab of category change:', error);
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

  // NEW: Overlay button handler
  overlayButton.addEventListener('click', async () => {
    try {
      // Disable button and show loading state
      overlayButton.disabled = true;
      overlayButton.textContent = '🖼️ Creating Overlay...';
      
      // Get current active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab || !tab.url || !tab.url.includes('amazon.')) {
        showStatus('Please navigate to an Amazon product page first', 'warning');
        return;
      }

      // Show debug section
      debugSection.style.display = 'block';
      debugInfo.textContent = 'Creating overlay display...';

      // Send message to content script to create overlay
      try {
        const response = await chrome.tabs.sendMessage(tab.id, { 
          action: 'forceOverlay',
          timestamp: Date.now()
        });
        
        if (response && response.success) {
          showStatus('Overlay display created successfully!', 'success');
          debugInfo.textContent = `Success: ${response.message || 'Overlay created'}`;
        } else {
          showStatus('Overlay creation completed with warnings', 'warning');
          debugInfo.textContent = `Warning: ${response?.message || 'Unknown response'}`;
        }
      } catch (messageError) {
        console.error('Error sending overlay message to content script:', messageError);
        showStatus('Could not communicate with page. Try reloading the page first.', 'error');
        debugInfo.textContent = `Error: ${messageError.message}`;
      }
      
    } catch (error) {
      console.error('Error in overlay creation:', error);
      showStatus('Error during overlay creation', 'error');
      debugInfo.textContent = `Error: ${error.message}`;
    } finally {
      // Re-enable button
      overlayButton.disabled = false;
      overlayButton.textContent = '🖼️ Force Overlay Display';
    }
  });
  
  function showStatus(message, type = 'success') {
    status.textContent = message;
    status.className = `status ${type}`;
    status.style.display = 'block';
    setTimeout(() => {
      status.style.display = 'none';
    }, 4000);
  }

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
    });
  });
});
