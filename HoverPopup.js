(function () {
  if (window.location.hostname.includes('amazon.')) return;

  // ---------------------------------------------------------------------------
  // Styles
  // ---------------------------------------------------------------------------
  const STYLE = `
    /* ── Floating overlay container ──────────────────────────── */
    #cipher-hover-popup {
      position: fixed;
      z-index: 2147483647;
      width: 360px;
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.18);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      display: none;
    }
    #cipher-hover-popup .chp-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      background: #fff;
      border-bottom: 1px solid #e0e0e0;
      cursor: grab;
      user-select: none;
    }
    #cipher-hover-popup .chp-header.dragging { cursor: grabbing; }
    /* Popup-specific: category menu floats absolutely */
    #cipher-hover-popup .chp-cat-menu {
      display: none;
      position: absolute;
      right: -1px;
      width: 70%;
      background: #fff;
      border: 1px solid #e0e0e0;
      border-top: none;
      border-radius: 0 0 8px 8px;
      box-shadow: 0 6px 14px rgba(0,0,0,0.12);
      z-index: 10;
    }

    /* ── Shared content styles (popup + sidebar) ─────────────── */
    .chp-icon {
      width: 22px;
      height: 22px;
      border-radius: 4px;
      object-fit: contain;
      pointer-events: none;
      flex-shrink: 0;
    }
    .chp-brand {
      font-size: 15px;
      font-weight: 600;
      color: #333;
      flex: 1;
      pointer-events: none;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .chp-close, .chp-cat-btn {
      background: none;
      border: none;
      font-size: 15px;
      color: #aaa;
      cursor: pointer;
      padding: 0 3px;
      line-height: 1;
      flex-shrink: 0;
    }
    .chp-close:hover, .chp-cat-btn:hover { color: #333; }
    .chp-cat-btn { font-size: 11px; }
    .chp-cat-opt {
      padding: 9px 14px;
      font-size: 13px;
      color: #333;
      cursor: pointer;
      user-select: none;
    }
    .chp-cat-opt:hover { background: #f5f5f5; }
    .chp-cat-opt.active {
      color: #1976d2;
      font-weight: 600;
      background: #f0f7ff;
    }
    .chp-body {
      padding: 16px;
      user-select: text;
    }
    .chp-loading {
      font-size: 13px;
      color: #888;
      font-style: italic;
      text-align: center;
      padding: 12px 0;
    }
    .chp-overview-title {
      font-size: 15px;
      font-weight: 600;
      color: #333;
      margin-bottom: 14px;
      line-height: 1.4;
    }
    .chp-lean-row {
      display: flex;
      align-items: baseline;
      gap: 10px;
      margin-bottom: 14px;
      flex-wrap: wrap;
    }
    .chp-lean-label, .chp-rating-label {
      font-size: 13px;
      color: #888;
      font-weight: 500;
    }
    .chp-lean-value {
      font-size: 22px;
      font-weight: 700;
      color: #222;
      flex: 1;
    }
    .chp-rating-value {
      font-size: 32px;
      font-weight: 700;
      color: #222;
    }
    .chp-description {
      font-size: 13px;
      line-height: 1.6;
      color: #444;
      margin-bottom: 14px;
    }
    .chp-citations {
      border-top: 1px solid #eee;
      padding-top: 10px;
      margin-bottom: 10px;
      font-size: 12px;
    }
    .chp-citations-label {
      font-weight: 600;
      color: #555;
      margin-right: 6px;
    }
    .chp-citation-link {
      color: #1976d2;
      text-decoration: none;
      font-size: 12px;
    }
    .chp-citation-link:hover { text-decoration: underline; }
    .chp-footer {
      border-top: 1px solid #eee;
      padding-top: 10px;
      display: flex;
      justify-content: flex-end;
    }
    .chp-open-btn {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 5px 12px;
      font-size: 12px;
      font-weight: 500;
      color: #555;
      background: transparent;
      border: 1px solid #d0d0d0;
      border-radius: 20px;
      cursor: pointer;
      font-family: inherit;
      transition: border-color 0.15s, color 0.15s;
    }
    .chp-open-btn:hover { border-color: #888; color: #222; }

    .cipher-company-noun, .cipher-subject-noun { cursor: pointer; }

    /* ── Font size modifiers (applied to the panel container) ─── */
    .chp-size-sm .chp-overview-title { font-size: 13px; }
    .chp-size-sm .chp-description,
    .chp-size-sm .chp-loading { font-size: 11px; }
    .chp-size-sm .chp-rating-value { font-size: 26px; }
    .chp-size-sm .chp-lean-value  { font-size: 18px; }
    .chp-size-sm .chp-citations,
    .chp-size-sm .chp-citation-link { font-size: 11px; }

    .chp-size-lg .chp-overview-title { font-size: 17px; }
    .chp-size-lg .chp-description,
    .chp-size-lg .chp-loading { font-size: 15px; }
    .chp-size-lg .chp-rating-value { font-size: 38px; }
    .chp-size-lg .chp-lean-value  { font-size: 26px; }
    .chp-size-lg .chp-citations,
    .chp-size-lg .chp-citation-link { font-size: 13px; }

    .chp-size-xl .chp-overview-title { font-size: 19px; }
    .chp-size-xl .chp-description,
    .chp-size-xl .chp-loading { font-size: 17px; }
    .chp-size-xl .chp-rating-value { font-size: 44px; }
    .chp-size-xl .chp-lean-value  { font-size: 30px; }
    .chp-size-xl .chp-citations,
    .chp-size-xl .chp-citation-link { font-size: 14px; }

    /* ── Sidebar panel ────────────────────────────────────────── */
    #cipher-sidebar {
      position: fixed;
      z-index: 2147483646;
      top: 0;
      right: 0;
      width: 340px;
      height: 100%;
      background: #fff;
      border-left: 1px solid #e0e0e0;
      box-shadow: -4px 0 20px rgba(0,0,0,0.13);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      display: flex;
      flex-direction: column;
      transition: transform 0.22s ease;
    }
    #cipher-sidebar.chs-collapsed { transform: translateX(304px); }
    #cipher-sidebar .chs-collapse-btn {
      flex-shrink: 0;
      width: 36px;
      height: 36px;
      background: none;
      border: none;
      border-right: 1px solid #e8e8e8;
      font-size: 14px;
      color: #888;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      margin-right: 8px;
    }
    #cipher-sidebar .chs-collapse-btn:hover { color: #333; background: #f5f5f5; }
    #cipher-sidebar .chp-header {
      display: flex;
      align-items: center;
      padding: 10px 14px 10px 0;
      background: #fff;
      border-bottom: 1px solid #e0e0e0;
      user-select: none;
      flex-shrink: 0;
      gap: 8px;
      cursor: default;
    }
    /* Sidebar body scrolls; overrides the shared static padding */
    #cipher-sidebar .chp-body {
      flex: 1;
      overflow-y: auto;
    }
    #cipher-sidebar .chp-empty {
      font-size: 13px;
      color: #bbb;
      font-style: italic;
      text-align: center;
      margin-top: 32px;
    }
    /* Sidebar cat-menu is inline, not floating */
    #cipher-sidebar .chp-cat-menu {
      position: static;
      width: 100%;
      border-radius: 0;
      box-shadow: none;
      border-top: 1px solid #e8e8e8;
      border-bottom: 1px solid #e0e0e0;
      border-left: none;
      border-right: none;
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = STYLE;
  document.head.appendChild(styleEl);

  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------
  const BASE_API   = 'https://compass-ai-internal-api.com';
  const ICON_URL   = chrome.runtime.getURL('icons/cipher_logo@128.png');

  // LRU cache — keyed by "term\x00category", max 20 entries across all categories.
  const MAX_CACHE = 40;
  const CACHE = new Map();
  function cacheGet(key) {
    if (!CACHE.has(key)) return undefined;
    const val = CACHE.get(key);
    CACHE.delete(key);  // move to most-recently-used position
    CACHE.set(key, val);
    return val;
  }
  function cacheSet(key, val) {
    if (CACHE.has(key)) CACHE.delete(key);
    else if (CACHE.size >= MAX_CACHE) CACHE.delete(CACHE.keys().next().value); // evict oldest
    CACHE.set(key, val);
  }

  const ENDPOINT_MAP = {
    'Political Leaning':       'getPoliticalLeaning',
    'DEI Friendliness':        'getDEIFriendlinessScore',
    'Wokeness':                'getWokenessScore',
    'Environmental Impact':    'getEnvironmentalImpactScore',
    'Immigration Support':     'getImmigrationSupportScore',
    'Technology Innovation':   'getTechnologyInnovationScore',
    'Financial Contributions': 'getPoliticalLeaningWithCitation',
  };

  let currentCategory   = 'Political Leaning';
  let displayMode       = 'overlay'; // 'overlay' | 'sidebar'
  let contentFontSize   = 'md';      // 'sm' | 'md' | 'lg' | 'xl'
  let isDragging        = false;
  let didJustDrag       = false;
  let currentController = null; // AbortController for the in-flight fetch
  let lastTarget        = null; // the span that last triggered the popup

  const FONT_SIZE_CLASSES = ['chp-size-sm', 'chp-size-lg', 'chp-size-xl'];

  function applyFontSize() {
    const cls = contentFontSize === 'md' ? null : `chp-size-${contentFontSize}`;
    ['cipher-hover-popup', 'cipher-sidebar'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.remove(...FONT_SIZE_CLASSES);
      if (cls) el.classList.add(cls);
    });
  }

  // Load persisted settings and keep them in sync globally
  chrome.storage.sync.get(['analysisCategory', 'displayMode', 'contentFontSize'], result => {
    if (result.analysisCategory) currentCategory = result.analysisCategory;
    if (result.displayMode)      displayMode     = result.displayMode;
    if (result.contentFontSize)  { contentFontSize = result.contentFontSize; applyFontSize(); }
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'sync') return;
    if (changes.analysisCategory) {
      currentCategory = changes.analysisCategory.newValue;
    }
    if (changes.displayMode) {
      displayMode = changes.displayMode.newValue;
      // Close whichever panel is currently open so the user starts fresh in the new mode
      const popup   = document.getElementById('cipher-hover-popup');
      const sidebar = document.getElementById('cipher-sidebar');
      if (popup)   popup.style.display = 'none';
      if (sidebar) sidebar.classList.add('chs-collapsed');
    }
    if (changes.contentFontSize) {
      contentFontSize = changes.contentFontSize.newValue;
      applyFontSize();
    }
    if (changes.showOverlayCategoryBtn) {
      const show = changes.showOverlayCategoryBtn.newValue === true;
      [
        document.querySelector('#cipher-hover-popup .chp-cat-btn'),
        document.querySelector('#cipher-sidebar .chp-cat-btn'),
      ].forEach(btn => { if (btn) btn.style.display = show ? '' : 'none'; });
    }
  });

  // ---------------------------------------------------------------------------
  // Popup element (singleton, built once)
  // ---------------------------------------------------------------------------
  function buildPopup() {
    const popup = document.createElement('div');
    popup.id = 'cipher-hover-popup';

    // Build the category menu options from ENDPOINT_MAP keys
    const optionsHtml = Object.keys(ENDPOINT_MAP)
      .map(cat => `<div class="chp-cat-opt" data-cat="${cat}">${cat}</div>`)
      .join('');

    popup.innerHTML = `
      <div class="chp-header">
        <img class="chp-icon" src="${ICON_URL}" alt="Cipher AI">
        <span class="chp-brand">Cipher AI</span>
        <button class="chp-cat-btn" title="Change analysis category">&#9660;</button>
        <button class="chp-close" title="Close">✕</button>
      </div>
      <div class="chp-cat-menu">${optionsHtml}</div>
      <div class="chp-body">
        <div class="chp-loading">Loading analysis…</div>
        <div class="chp-content"></div>
      </div>
    `;

    // Position the category menu directly below the header
    function openCatMenu() {
      const menu   = popup.querySelector('.chp-cat-menu');
      const header = popup.querySelector('.chp-header');
      menu.style.top = header.offsetHeight + 'px';
      // Refresh active state
      menu.querySelectorAll('.chp-cat-opt').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.cat === currentCategory);
      });
      menu.style.display = 'block';
    }
    function closeCatMenu() {
      popup.querySelector('.chp-cat-menu').style.display = 'none';
    }

    popup.querySelector('.chp-cat-btn').addEventListener('click', e => {
      e.stopPropagation();
      const menu = popup.querySelector('.chp-cat-menu');
      menu.style.display === 'none' ? openCatMenu() : closeCatMenu();
    });

    // Each option saves to storage and immediately re-fetches with the new category
    popup.querySelectorAll('.chp-cat-opt').forEach(opt => {
      opt.addEventListener('click', e => {
        e.stopPropagation();
        currentCategory = opt.dataset.cat;
        chrome.storage.sync.set({ analysisCategory: currentCategory });
        closeCatMenu();
        if (lastTarget) showPopup(lastTarget); // re-fetch for the same term
      });
    });

    popup.querySelector('.chp-close').addEventListener('click', e => {
      e.stopPropagation();
      closeCatMenu();
      popup.style.display = 'none';
    });

    // Close the category menu when clicking the popup body (but stay open on popup)
    popup.querySelector('.chp-body').addEventListener('click', () => closeCatMenu());

    // Close menu when starting a drag
    popup.querySelector('.chp-header').addEventListener('mousedown', e => {
      if (!e.target.classList.contains('chp-cat-btn')) closeCatMenu();
    });

    makeDraggable(popup, popup.querySelector('.chp-header'));

    // Clicks inside the popup don't propagate to the document close-on-click handler
    popup.addEventListener('click', e => e.stopPropagation());

    // Apply initial visibility of the category button from settings
    chrome.storage.sync.get(['showOverlayCategoryBtn'], result => {
      const show = result.showOverlayCategoryBtn === true; // default: hidden
      popup.querySelector('.chp-cat-btn').style.display = show ? '' : 'none';
    });

    document.body.appendChild(popup);
    applyFontSize();
    return popup;
  }

  function getPopup() {
    return document.getElementById('cipher-hover-popup') || buildPopup();
  }

  // ---------------------------------------------------------------------------
  // Sidebar panel (singleton, built once)
  // ---------------------------------------------------------------------------
  function buildCatMenuHandlers(container) {
    const menu = container.querySelector('.chp-cat-menu');
    function openCatMenu() {
      menu.querySelectorAll('.chp-cat-opt').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.cat === currentCategory);
      });
      menu.style.display = 'block';
    }
    function closeCatMenu() { menu.style.display = 'none'; }

    container.querySelector('.chp-cat-btn').addEventListener('click', e => {
      e.stopPropagation();
      menu.style.display === 'none' ? openCatMenu() : closeCatMenu();
    });
    container.querySelectorAll('.chp-cat-opt').forEach(opt => {
      opt.addEventListener('click', e => {
        e.stopPropagation();
        currentCategory = opt.dataset.cat;
        chrome.storage.sync.set({ analysisCategory: currentCategory });
        closeCatMenu();
        if (lastTarget) showPopup(lastTarget);
      });
    });
    container.querySelector('.chp-body').addEventListener('click', () => closeCatMenu());
    return closeCatMenu;
  }

  function buildSidebar() {
    const sidebar = document.createElement('div');
    sidebar.id = 'cipher-sidebar';
    sidebar.classList.add('chs-collapsed'); // start collapsed until first analysis

    const optionsHtml = Object.keys(ENDPOINT_MAP)
      .map(cat => `<div class="chp-cat-opt" data-cat="${cat}">${cat}</div>`)
      .join('');

    sidebar.innerHTML = `
      <div class="chp-header">
        <button class="chs-collapse-btn" title="Collapse / expand panel">&#10094;</button>
        <img class="chp-icon" src="${ICON_URL}" alt="Cipher AI">
        <span class="chp-brand">Cipher AI</span>
        <button class="chp-cat-btn" title="Change analysis category">&#9660;</button>
      </div>
      <div class="chp-cat-menu" style="display:none">${optionsHtml}</div>
      <div class="chp-body">
        <div class="chp-empty">Click any highlighted term to see analysis</div>
        <div class="chp-loading" style="display:none">Loading analysis…</div>
        <div class="chp-content"></div>
      </div>
    `;

    const collapseBtn = sidebar.querySelector('.chs-collapse-btn');
    collapseBtn.addEventListener('click', e => {
      e.stopPropagation();
      const collapsed = sidebar.classList.toggle('chs-collapsed');
      collapseBtn.innerHTML = collapsed ? '&#10095;' : '&#10094;';
    });

    // Clicking the strip (collapsed state) expands the sidebar
    sidebar.querySelector('.chp-header').addEventListener('click', e => {
      if (e.target === collapseBtn) return;
      if (sidebar.classList.contains('chs-collapsed')) {
        sidebar.classList.remove('chs-collapsed');
        collapseBtn.innerHTML = '&#10094;';
      }
    });

    buildCatMenuHandlers(sidebar);
    sidebar.addEventListener('click', e => e.stopPropagation());

    chrome.storage.sync.get(['showOverlayCategoryBtn'], result => {
      const show = result.showOverlayCategoryBtn === true;
      sidebar.querySelector('.chp-cat-btn').style.display = show ? '' : 'none';
    });

    document.body.appendChild(sidebar);
    applyFontSize();
    return sidebar;
  }

  function getSidebar() {
    return document.getElementById('cipher-sidebar') || buildSidebar();
  }

  function expandSidebar(sidebar) {
    sidebar.classList.remove('chs-collapsed');
    sidebar.querySelector('.chs-collapse-btn').innerHTML = '&#10094;';
    sidebar.querySelector('.chp-empty').style.display = 'none';
  }

  // ---------------------------------------------------------------------------
  // Shared: populate a panel (popup or sidebar) with fetched analysis
  // ---------------------------------------------------------------------------
  function loadIntoPanel(term, panel, afterRender) {
    panel.querySelector('.chp-loading').style.display = '';
    panel.querySelector('.chp-content').innerHTML = '';

    const controller = new AbortController();
    currentController = controller;

    fetchAnalysis(term, controller.signal)
      .then(data => {
        currentController = null;
        renderContent(panel, term, data);
        if (afterRender) afterRender();
      })
      .catch(() => {});
  }

  // ---------------------------------------------------------------------------
  // Term normalization — strip possessives, trailing punctuation, whitespace
  // ---------------------------------------------------------------------------
  function normalizeTerm(raw) {
    return raw
      .trim()
      .replace(/[''']s$/i, '')       // 's  /  's  possessive
      .replace(/[.,!?;:)\]'"]+$/, '') // trailing punctuation
      .trim();
  }

  // ---------------------------------------------------------------------------
  // Show analysis — routes to floating overlay OR fixed sidebar based on displayMode
  // targetEl: Element or DOMRect; termOverride: optional string
  // ---------------------------------------------------------------------------
  function showPopup(targetEl, termOverride) {
    if (currentController) { currentController.abort(); currentController = null; }

    lastTarget = (targetEl instanceof Element) ? targetEl : null;
    const term = normalizeTerm(
      termOverride || (targetEl instanceof Element ? targetEl.textContent : '')
    );
    if (!term) return;

    if (displayMode === 'sidebar') {
      const sidebar = getSidebar();
      expandSidebar(sidebar);
      loadIntoPanel(term, sidebar);
    } else {
      const popup = getPopup();
      popup.style.display = 'block';
      positionNear(popup, targetEl);
      loadIntoPanel(term, popup, () => positionNear(popup, targetEl));
    }
  }

  // targetOrRect: an Element or a DOMRect
  function positionNear(popup, targetOrRect) {
    const rect = (targetOrRect instanceof Element)
      ? targetOrRect.getBoundingClientRect()
      : targetOrRect;
    const pw = popup.offsetWidth  || 360;
    const ph = popup.offsetHeight || 50;

    // Try above first
    let top  = rect.top - ph - 10;
    let left = rect.left;

    if (top < 8) top = rect.bottom + 10; // flip below

    // Clamp horizontally
    if (left + pw > window.innerWidth - 8) left = window.innerWidth - pw - 8;
    if (left < 8) left = 8;

    // Clamp vertically
    if (top + ph > window.innerHeight - 8) top = window.innerHeight - ph - 8;
    if (top < 8) top = 8;

    popup.style.top  = top  + 'px';
    popup.style.left = left + 'px';
  }

  // ---------------------------------------------------------------------------
  // Context-menu "Analyze with Cipher AI" handler
  // ---------------------------------------------------------------------------
  const SELECTION_CLASS = 'cipher-user-selection';

  function analyzeSelection(rawText) {
    const term = normalizeTerm(rawText);
    if (!term) return;

    const sel = window.getSelection();
    let anchor = null;

    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);

      // Shrink range end to exclude stripped trailing chars (possessives, punctuation)
      const trailingStripped = rawText.trim().length - term.length;
      if (trailingStripped > 0 && range.endContainer.nodeType === Node.TEXT_NODE) {
        try {
          range.setEnd(
            range.endContainer,
            Math.max(range.startOffset, range.endOffset - trailingStripped)
          );
        } catch (e) {}
      }

      const selRect = range.getBoundingClientRect();
      const span = document.createElement('span');
      span.className = SELECTION_CLASS;

      try {
        range.surroundContents(span);
        sel.removeAllRanges();
        anchor = span;         // Element — used for positioning + lastTarget
      } catch (e) {
        sel.removeAllRanges();
        anchor = selRect;      // DOMRect fallback for cross-element selections
      }
    }

    if (anchor) showPopup(anchor, term);
  }

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === 'analyzeSelection' && msg.text) {
      analyzeSelection(msg.text);
    }
  });

  // ---------------------------------------------------------------------------
  // API + cache
  // ---------------------------------------------------------------------------
  async function fetchAnalysis(term, signal) {
    const cacheKey = term + '\x00' + currentCategory;
    const cached = cacheGet(cacheKey);
    if (cached !== undefined) return cached;
    try {
      const endpoint = ENDPOINT_MAP[currentCategory] || 'getPoliticalLeaning';
      const res = await fetch(
        `${BASE_API}/${endpoint}/${encodeURIComponent(term)}`,
        { method: 'GET', headers: { 'Content-Type': 'application/json' }, signal }
      );
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const raw = await res.json();
      const id = raw.id ?? raw.response?.id ?? null;
      const data = {
        lean:         String(raw.lean    ?? raw.response?.lean    ?? 'Unknown'),
        score:        String(raw.rating  ?? raw.response?.rating  ?? 'N/A'),
        description:  String(raw.context ?? raw.response?.context ?? 'No information available.'),
        withFinancial: !!(raw.created_with_financial_contributions_info
                        ?? raw.response?.created_with_financial_contributions_info),
        id:           id != null ? String(id) : null,
      };
      cacheSet(cacheKey, data);
      return data;
    } catch (err) {
      if (err.name === 'AbortError') throw err; // let showPopup's .catch handle it; don't cache
      const fallback = { lean: 'Unknown', score: 'N/A', description: 'Analysis unavailable for this term.', withFinancial: false, id: null };
      cacheSet(cacheKey, fallback);
      return fallback;
    }
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  function escHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function renderContent(popup, term, data) {
    const category = currentCategory;
    const slug     = category.toLowerCase().replace(/\s+/g, '_');
    const content  = popup.querySelector('.chp-content');
    content.innerHTML = `
      <div class="chp-overview-title">${escHtml(category)} Overview for <strong>${escHtml(term)}</strong></div>
      <div class="chp-lean-row">
        ${category === 'Political Leaning' ? `
          <span class="chp-lean-label">Lean:</span>
          <span class="chp-lean-value">${escHtml(data.lean)}</span>
        ` : ''}
        <span class="chp-rating-label">Rating:</span>
        <span class="chp-rating-value">${escHtml(data.score)}</span>
      </div>
      <div class="chp-description">${escHtml(data.description)}</div>
      ${data.withFinancial ? `
        <div class="chp-citations">
          <span class="chp-citations-label">Citations:</span>
          <a href="#" class="chp-citation-link">Financial Contributions Data for ${escHtml(term)}</a>
        </div>` : ''}
      <div class="chp-footer">
        <button class="chp-open-btn" title="Open on Cipher AI">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </button>
      </div>
    `;

    const idSuffix = data.id ? `?id=${encodeURIComponent(data.id)}` : '';

    content.querySelector('.chp-open-btn').addEventListener('click', e => {
      e.preventDefault();
      window.open(`https://cipher-ai.io/organization/${slug}/${encodeURIComponent(term)}${idSuffix}`, '_blank');
    });

    const citLink = content.querySelector('.chp-citation-link');
    if (citLink) {
      citLink.addEventListener('click', e => {
        e.preventDefault();
        window.open(`https://cipher-ai.io/organization/financial_contributions/${encodeURIComponent(term)}${idSuffix}`, '_blank');
      });
    }

    popup.querySelector('.chp-loading').style.display = 'none';
  }

  // ---------------------------------------------------------------------------
  // Draggable
  // ---------------------------------------------------------------------------
  function makeDraggable(el, handle) {
    let startX, startY, startLeft, startTop;

    handle.addEventListener('mousedown', e => {
      if (e.target.classList.contains('chp-close')) return;
      isDragging = true;
      startX    = e.clientX;
      startY    = e.clientY;
      startLeft = parseInt(el.style.left) || 0;
      startTop  = parseInt(el.style.top)  || 0;
      handle.classList.add('dragging');
      e.preventDefault();
    });

    document.addEventListener('mousemove', e => {
      if (!isDragging) return;
      el.style.left = (startLeft + e.clientX - startX) + 'px';
      el.style.top  = (startTop  + e.clientY - startY) + 'px';
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging  = false;
        didJustDrag = true;
        handle.classList.remove('dragging');
        // Clear the flag AFTER the stray click event that follows mouseup has fired
        setTimeout(() => { didJustDrag = false; }, 0);
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Click delegation — open on click, close on outside click
  // ---------------------------------------------------------------------------
  const HIGHLIGHT_CLASSES = new Set(['cipher-company-noun', 'cipher-subject-noun', 'cipher-user-selection']);

  document.addEventListener('click', e => {
    if (isDragging || didJustDrag) return;

    const el    = e.target;
    const popup = document.getElementById('cipher-hover-popup');

    // Clicked a highlighted span — open popup
    if (el.classList && HIGHLIGHT_CLASSES.has(el.className)) {
      showPopup(el);
      return;
    }

    // Clicked anywhere inside the popup (buttons, links, SVG children…) — leave it open
    if (popup && popup.contains(el)) return;

    // Clicked outside — close popup
    if (popup && popup.style.display !== 'none') {
      popup.style.display = 'none';
    }
  }, true); // capture phase so we see it before the page's own handlers

})();
