chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'analyze-cipher-ai',
    title: 'Analyze with Cipher AI',
    contexts: ['selection'],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== 'analyze-cipher-ai') return;
  if (!tab || !tab.id) return;
  if (tab.url && tab.url.includes('cipher-ai.io')) return;

  const text = (info.selectionText || '').trim();
  if (!text) return;

  chrome.tabs.sendMessage(tab.id, { action: 'analyzeSelection', text }).catch(() => {});
});
