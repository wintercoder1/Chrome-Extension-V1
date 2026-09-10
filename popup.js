// popup.js
document.addEventListener('DOMContentLoaded', async () => {
  const status              = document.getElementById('status');
  const categorySelect      = document.getElementById('categorySelect');
  const overlayDropdownToggle = document.getElementById('overlayDropdownToggle');

  // Load current settings
  const result = await chrome.storage.sync.get([
    'analysisCategory', 'showOverlayCategoryBtn',
    'highlightMode', 'displayMode', 'contentFontSize',
    'openInternetHighlightEnabled', 'amazonEnabled',
  ]);

  // Category dropdown
  categorySelect.value = result.analysisCategory || 'Political Leaning';
  categorySelect.addEventListener('change', async () => {
    const newCategory = categorySelect.value;
    await chrome.storage.sync.set({ analysisCategory: newCategory });
    showStatus(`Category set to "${newCategory}"`, 'success');
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.url && tab.url.includes('amazon.')) {
        chrome.tabs.sendMessage(tab.id, { action: 'categoryChanged', category: newCategory });
      }
    } catch (e) {}
  });

  // Overlay dropdown toggle
  overlayDropdownToggle.checked = result.showOverlayCategoryBtn === true;
  overlayDropdownToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ showOverlayCategoryBtn: overlayDropdownToggle.checked });
  });

  // Highlight mode radios
  const savedHighlight = result.highlightMode || 'companies';
  document.querySelectorAll('input[name="highlightMode"]').forEach(radio => {
    radio.checked = radio.value === savedHighlight;
    radio.addEventListener('change', () => {
      if (radio.checked) chrome.storage.sync.set({ highlightMode: radio.value });
    });
  });

  // Display mode radios
  const savedDisplay = result.displayMode || 'overlay';
  document.querySelectorAll('input[name="displayMode"]').forEach(radio => {
    radio.checked = radio.value === savedDisplay;
    radio.addEventListener('change', () => {
      if (radio.checked) chrome.storage.sync.set({ displayMode: radio.value });
    });
  });

  // Open internet highlight toggle (default: on)
  const openInternetHighlightToggle = document.getElementById('openInternetHighlightToggle');
  openInternetHighlightToggle.checked = result.openInternetHighlightEnabled === true;
  openInternetHighlightToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ openInternetHighlightEnabled: openInternetHighlightToggle.checked });
  });

  // Amazon enabled toggle (default: on)
  const amazonEnabledToggle = document.getElementById('amazonEnabledToggle');
  amazonEnabledToggle.checked = result.amazonEnabled !== false;
  amazonEnabledToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ amazonEnabled: amazonEnabledToggle.checked });
  });

  // Font size radios
  const savedFontSize = result.contentFontSize || 'md';
  document.querySelectorAll('input[name="contentFontSize"]').forEach(radio => {
    radio.checked = radio.value === savedFontSize;
    radio.addEventListener('change', () => {
      if (radio.checked) chrome.storage.sync.set({ contentFontSize: radio.value });
    });
  });

  function showStatus(message, type = 'success') {
    status.textContent = message;
    status.className = `status ${type}`;
    status.style.display = 'block';
    setTimeout(() => { status.style.display = 'none'; }, 4000);
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
