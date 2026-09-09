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
    /* Popup-specific: category menu floats absolutely, full width */
    #cipher-hover-popup .chp-cat-menu {
      display: none;
      position: absolute;
      left: -1px;
      right: -1px;
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
    .chp-cat-section-hdr {
      font-size: 10px;
      font-weight: 700;
      color: #aaa;
      letter-spacing: 0.7px;
      text-transform: uppercase;
      padding: 10px 14px 4px;
      user-select: none;
    }
    .chp-cat-section-divider {
      border-top: 1px solid #e8e8e8;
      margin: 4px 0;
    }
    .chp-cat-opt {
      padding: 9px 14px;
      font-size: 13px;
      color: #333;
      cursor: pointer;
      user-select: none;
    }
    .chp-cat-opt:hover { background: #f5f5f5; }
    .chp-cat-opt.active {
      font-weight: 700;
      color: #1a1a1a;
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
    /* Sidebar cat-menu overlays the body, same as the popup */
    #cipher-sidebar .chp-cat-menu {
      position: absolute;
      left: 0;
      right: 0;
      background: #fff;
      border-top: 1px solid #e8e8e8;
      border-bottom: 1px solid #e0e0e0;
      box-shadow: 0 6px 14px rgba(0,0,0,0.12);
      z-index: 10;
    }

    /* ── Leadership Demographics ──────────────────────────────── */
    .chp-demo-caveat {
      font-size: 11px;
      color: #999;
      margin-bottom: 12px;
      font-style: italic;
      line-height: 1.4;
    }
    .chp-demo-chart-area {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 14px;
    }
    .chp-demo-legend { flex: 1; min-width: 0; }
    .chp-demo-legend-row {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 5px;
    }
    .chp-demo-swatch {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 2px;
      flex-shrink: 0;
    }
    .chp-demo-group-name {
      flex: 1;
      font-size: 12px;
      color: #444;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .chp-demo-pct {
      font-size: 12px;
      font-weight: 600;
      color: #222;
      flex-shrink: 0;
    }
    .chp-demo-team-size {
      font-size: 11px;
      color: #888;
      margin-bottom: 10px;
    }

    /* ── Financial Contributions ──────────────────────────────── */
    .chp-contrib-stats { margin-bottom: 2px; }
    .chp-contrib-stat-line {
      font-size: 13px;
      color: #333;
      margin-bottom: 6px;
      line-height: 1.4;
    }
    .chp-contrib-bar {
      height: 38px;
      border-radius: 20px;
      overflow: hidden;
      display: flex;
      margin: 14px 0 10px;
    }
    .chp-contrib-bar-dem {
      background: #6495ed;
      height: 100%;
    }
    .chp-contrib-bar-rep {
      flex: 1;
      height: 100%;
      background: #e05c5c;
    }
    .chp-contrib-legend {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: #333;
      margin-bottom: 12px;
    }
    .chp-contrib-legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .chp-contrib-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .chp-contrib-preview {
      font-size: 12px;
      color: #555;
      line-height: 1.5;
      margin-bottom: 12px;
      padding-left: 10px;
      border-left: 3px solid #e0e0e0;
    }
    .chp-contrib-note {
      font-size: 12px;
      color: #888;
      font-style: italic;
      line-height: 1.4;
      margin-bottom: 10px;
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = STYLE;
  document.head.appendChild(styleEl);

  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------
  // Toggle for local development vs production
  // const BASE_API = 'http://localhost:8000';
  const BASE_API   = 'https://compass-ai-internal-api.com';

  // Guard against "Extension context invalidated" after an extension reload
  function isContextValid() {
    try { return !!chrome.runtime.id; } catch (e) { return false; }
  }
  function safeGet(keys, cb) {
    try { safeGet(keys, cb); } catch (e) {}
  }
  function safeSet(obj) {
    try { safeSet(obj); } catch (e) {}
  }

  let ICON_URL = '';
  try { ICON_URL = chrome.runtime.getURL('icons/cipher_logo@128.png'); } catch (e) {}

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
    'Political Leaning':        'getPoliticalLeaning',
    'DEI Friendliness':         'getDEIFriendlinessScore',
    'Wokeness':                 'getWokenessScore',
    'Environmental Impact':     'getEnvironmentalImpactScore',
    'Immigration Support':      'getImmigrationSupportScore',
    'Technology Innovation':    'getTechnologyInnovationScore',
    'Financial Contributions':  'getFinancialContributionsOverview',
    'Leadership Demographics':  'getLeadershipDemographics',
  };

  const CAT_SECTIONS = [
    {
      label: 'IMPORTANT ANALYSES',
      cats: ['Financial Contributions', 'Leadership Demographics'],
    },
    {
      label: 'FOR FUN ANALYSES',
      cats: ['Political Leaning', 'DEI Friendliness', 'Wokeness', 'Environmental Impact', 'Immigration Support', 'Technology Innovation'],
    },
  ];

  function buildCatMenuHtml() {
    return CAT_SECTIONS.map((section, i) =>
      (i > 0 ? '<div class="chp-cat-section-divider"></div>' : '') +
      `<div class="chp-cat-section-hdr">${section.label}</div>` +
      section.cats.map(cat => `<div class="chp-cat-opt" data-cat="${cat}">${cat}</div>`).join('')
    ).join('');
  }

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
  safeGet(['analysisCategory', 'displayMode', 'contentFontSize'], result => {
    if (result.analysisCategory) currentCategory = result.analysisCategory;
    if (result.displayMode)      displayMode     = result.displayMode;
    if (result.contentFontSize)  { contentFontSize = result.contentFontSize; applyFontSize(); }
  });
  try { chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'sync') return;
    if (changes.analysisCategory) {
      currentCategory = changes.analysisCategory.newValue;
    }
    if (changes.displayMode) {
      displayMode = changes.displayMode.newValue;
      const popup = document.getElementById('cipher-hover-popup');
      if (displayMode === 'sidebar') {
        if (popup) popup.style.display = 'none';
        const sidebar = getSidebar();
        sidebar.style.display = '';
        expandSidebar(sidebar);
        // Re-show the last analysed term in the sidebar if there is one
        if (lastTarget) {
          const term = normalizeTerm(
            lastTarget instanceof Element ? lastTarget.textContent : ''
          );
          if (term) loadIntoPanel(term, sidebar);
        }
      } else {
        // Back to overlay — fully hide the sidebar
        const sidebar = document.getElementById('cipher-sidebar');
        if (sidebar) sidebar.style.display = 'none';
      }
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
  }); } catch (e) {}

  // ---------------------------------------------------------------------------
  // Popup element (singleton, built once)
  // ---------------------------------------------------------------------------
  function buildPopup() {
    const popup = document.createElement('div');
    popup.id = 'cipher-hover-popup';

    // Build the category menu options from ENDPOINT_MAP keys
    const optionsHtml = buildCatMenuHtml();

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
        safeSet({ analysisCategory: currentCategory });
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
    safeGet(['showOverlayCategoryBtn'], result => {
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
      menu.style.top = container.querySelector('.chp-header').offsetHeight + 'px';
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
        safeSet({ analysisCategory: currentCategory });
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

    const optionsHtml = buildCatMenuHtml();

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

    safeGet(['showOverlayCategoryBtn'], result => {
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
    if (!isContextValid()) return;
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
      let data;
      if (currentCategory === 'Financial Contributions') {
        // Two parallel fetches — no shared single-fetch preamble needed
        const safeJson = url =>
          fetch(url, { signal })
            .then(r => r.ok ? r.json() : null)
            .catch(e => { if (e.name === 'AbortError') throw e; return null; });

        const [pcJson, qtJson] = await Promise.all([
          safeJson(`${BASE_API}/getFinancialContributionsPercentContributionsOnly/${encodeURIComponent(term)}`),
          safeJson(`${BASE_API}/getFinancialContributionsQuickTextOnly/${encodeURIComponent(term)}`),
        ]);

        const pc = pcJson?.percent_contributions || pcJson?.response?.percent_contributions || {};
        const pcId = pcJson?.id != null ? String(pcJson.id) : null;
        const qtId = qtJson?.id != null ? String(qtJson.id) : null;
        const quickText = qtJson?.text || qtJson?.quick_text || qtJson?.summary
                       || qtJson?.fec_financial_contributions_quick_text || null;

        data = {
          type:            'financial_contributions',
          total:           pc.total_contributions || 0,
          to_democrats:    pc.total_to_democrats || 0,
          to_republicans:  pc.total_to_republicans || 0,
          pct_democrats:   pc.percent_to_democrats || 0,
          pct_republicans: pc.percent_to_republicans || 0,
          quickText:       quickText,
          id:              pcId ?? qtId,  // percent-contributions id wins; falls back to quick-text id
          error:           false,
        };
      } else {
        const endpoint = ENDPOINT_MAP[currentCategory] || 'getPoliticalLeaning';
        const res = await fetch(
          `${BASE_API}/${endpoint}/${encodeURIComponent(term)}`,
          { method: 'GET', headers: { 'Content-Type': 'application/json' }, signal }
        );
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const raw = await res.json();

        if (currentCategory === 'Leadership Demographics') {
          const dem = raw.demographics || {};
          const eth = dem.estimated_ethnicity || {};
          data = {
            type:             'leadership_demographics',
            team_size:        dem.team_size || raw.officer_count || 0,
            groups:           (eth.groups || []).filter(g => g.percent > 0),
            basis:            eth.basis || '',
            is_estimate:      eth.is_estimate !== false,
            company_page_url: raw.company_page_url || dem.company_page_url || null,
            id:               raw.id != null ? String(raw.id) : null,
          };
        } else {
          const id = raw.id ?? raw.response?.id ?? null;
          console.log('[CipherAI] raw response keys:', Object.keys(raw), '| id:', id, '| raw.id:', raw.id, '| raw.response?.id:', raw.response?.id);
          data = {
            lean:         String(raw.lean    ?? raw.response?.lean    ?? 'Unknown'),
            score:        String(raw.rating  ?? raw.response?.rating  ?? 'N/A'),
            description:  String(raw.context ?? raw.response?.context ?? 'No information available.'),
            withFinancial: !!(raw.created_with_financial_contributions_info
                            ?? raw.response?.created_with_financial_contributions_info),
            id:           id != null ? String(id) : null,
          };
        }
      }
      cacheSet(cacheKey, data);
      return data;
    } catch (err) {
      if (err.name === 'AbortError') throw err; // let showPopup's .catch handle it; don't cache
      let fallback;
      if (currentCategory === 'Leadership Demographics') {
        fallback = { type: 'leadership_demographics', groups: [], basis: '', is_estimate: true, company_page_url: null, id: null };
      } else if (currentCategory === 'Financial Contributions') {
        fallback = { type: 'financial_contributions', total: 0, to_democrats: 0, to_republicans: 0, pct_democrats: 0, pct_republicans: 0, id: null, error: true };
      } else {
        fallback = { lean: 'Unknown', score: 'N/A', description: 'Analysis unavailable for this term.', withFinancial: false, id: null };
      }
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

  const DEMO_COLORS = [
    '#4e79a7', '#f28e2b', '#e15759', '#76b7b2',
    '#59a14f', '#edc948', '#b07aa1', '#9c755f',
  ];

  function buildPieChart(groups, size) {
    size = size || 110;
    const cx = size / 2, cy = size / 2, r = size / 2 - 3;
    if (groups.length === 0) return '';
    if (groups.length === 1) {
      return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${cx}" cy="${cy}" r="${r}" fill="${DEMO_COLORS[0]}"/></svg>`;
    }
    const total = groups.reduce((s, g) => s + g.percent, 0) || 100;
    let paths = '';
    let angle = -Math.PI / 2;
    groups.forEach((g, i) => {
      if (g.percent <= 0) return;
      const sweep = (g.percent / total) * 2 * Math.PI;
      const end = angle + sweep;
      const x1 = cx + r * Math.cos(angle), y1 = cy + r * Math.sin(angle);
      const x2 = cx + r * Math.cos(end),   y2 = cy + r * Math.sin(end);
      paths += `<path d="M${cx},${cy} L${x1.toFixed(2)},${y1.toFixed(2)} A${r},${r} 0 ${sweep > Math.PI ? 1 : 0},1 ${x2.toFixed(2)},${y2.toFixed(2)} Z" fill="${DEMO_COLORS[i % DEMO_COLORS.length]}"/>`;
      angle = end;
    });
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${paths}</svg>`;
  }

  function formatDollars(n) {
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  function renderFinancialContributions(popup, term, data) {
    const content = popup.querySelector('.chp-content');
    const idSuffix = data.id ? `?id=${encodeURIComponent(data.id)}` : '';
    const siteUrl = `https://cipher-ai.io/organization/financial_contributions/${encodeURIComponent(term)}${idSuffix}`;

    if (data.error || !data.total) {
      content.innerHTML = `
        <div class="chp-overview-title">Financial Contributions for <strong>${escHtml(term)}</strong></div>
        <div class="chp-description">No financial contribution data available for this term.</div>
      `;
      popup.querySelector('.chp-loading').style.display = 'none';
      return;
    }

    // Normalize Democrat/Republican percentages to fill 100% of bar
    const sum = (data.pct_democrats || 0) + (data.pct_republicans || 0);
    const demWidth = sum > 0 ? ((data.pct_democrats / sum) * 100).toFixed(2) : 50;

    const openBtnSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>`;

    content.innerHTML = `
      <div class="chp-overview-title">Political Contributions for <strong>${escHtml(term)}</strong></div>
      <div class="chp-contrib-stats">
        <div class="chp-contrib-stat-line">Total Contributions: ${escHtml(formatDollars(data.total))}</div>
        <div class="chp-contrib-stat-line">To Republicans: ${escHtml(formatDollars(data.to_republicans))} (${data.pct_republicans.toFixed(2)}%)</div>
        <div class="chp-contrib-stat-line">To Democrats: ${escHtml(formatDollars(data.to_democrats))} (${data.pct_democrats.toFixed(2)}%)</div>
      </div>
      <div class="chp-contrib-bar">
        <div class="chp-contrib-bar-dem" style="width:${demWidth}%"></div>
        <div class="chp-contrib-bar-rep"></div>
      </div>
      <div class="chp-contrib-legend">
        <div class="chp-contrib-legend-item">
          <span class="chp-contrib-dot" style="background:#6495ed"></span>
          <span>Democrats</span>
        </div>
        <div class="chp-contrib-legend-item">
          <span class="chp-contrib-dot" style="background:#e05c5c"></span>
          <span>Republicans</span>
        </div>
      </div>
      <div class="chp-contrib-note">This financial information is based on Federal Election Commission filings from the 2024 election cycle.</div>
      <div class="chp-contrib-note">Full financial contributions analysis available on <a href="#" class="chp-citation-link chp-contrib-site-link">cipher-ai.io ↗</a></div>
      <div class="chp-footer">
        <button class="chp-open-btn" title="Open on Cipher AI">${openBtnSvg}</button>
      </div>
    `;

    content.querySelector('.chp-open-btn').addEventListener('click', e => {
      e.preventDefault();
      window.open(siteUrl, '_blank');
    });
    content.querySelector('.chp-contrib-site-link').addEventListener('click', e => {
      e.preventDefault();
      window.open(siteUrl, '_blank');
    });

    popup.querySelector('.chp-loading').style.display = 'none';
  }

  function renderLeadershipDemographics(popup, term, data) {
    const content = popup.querySelector('.chp-content');
    if (!data.groups || data.groups.length === 0) {
      content.innerHTML = `
        <div class="chp-overview-title">Leadership Demographics for <strong>${escHtml(term)}</strong></div>
        <div class="chp-description">No demographics data available for this term.</div>
      `;
      popup.querySelector('.chp-loading').style.display = 'none';
      return;
    }
    const idSuffix = data.id ? `?id=${encodeURIComponent(data.id)}` : '';
    const legendHtml = data.groups.map((g, i) => `
      <div class="chp-demo-legend-row">
        <span class="chp-demo-swatch" style="background:${DEMO_COLORS[i % DEMO_COLORS.length]}"></span>
        <span class="chp-demo-group-name">${escHtml(g.group)}</span>
        <span class="chp-demo-pct">${g.percent}%</span>
      </div>`).join('');

    content.innerHTML = `
      <div class="chp-overview-title">Leadership Demographics for <strong>${escHtml(term)}</strong></div>
      ${data.team_size ? `<div class="chp-demo-team-size">C-suite team: ${escHtml(String(data.team_size))} officer${data.team_size !== 1 ? 's' : ''}</div>` : ''}
      ${data.basis ? `<div class="chp-demo-caveat">${escHtml(data.basis)}${data.is_estimate ? ' · Estimated' : ''}</div>` : ''}
      <div class="chp-demo-chart-area">
        ${buildPieChart(data.groups)}
        <div class="chp-demo-legend">${legendHtml}</div>
      </div>
      ${data.company_page_url ? `
        <div class="chp-citations">
          <span class="chp-citations-label">Source:</span>
          <a href="#" class="chp-citation-link chp-demo-src-link">Company Leadership Page ↗</a>
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
    content.querySelector('.chp-open-btn').addEventListener('click', e => {
      e.preventDefault();
      window.open(`https://cipher-ai.io/organization/leadership_demographics/${encodeURIComponent(term)}${idSuffix}`, '_blank');
    });
    const srcLink = content.querySelector('.chp-demo-src-link');
    if (srcLink) {
      srcLink.addEventListener('click', e => {
        e.preventDefault();
        window.open(data.company_page_url, '_blank');
      });
    }
    popup.querySelector('.chp-loading').style.display = 'none';
  }

  function renderContent(popup, term, data) {
    if (data.type === 'leadership_demographics') {
      renderLeadershipDemographics(popup, term, data);
      return;
    }
    if (data.type === 'financial_contributions') {
      renderFinancialContributions(popup, term, data);
      return;
    }
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
