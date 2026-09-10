(function () {
  if (window.location.hostname.includes('amazon.')) return;

  // ---------------------------------------------------------------------------
  // Company name lookup — powered by CIPHER_COMPANIES (loaded before this script)
  // ---------------------------------------------------------------------------

  const LEGAL_SUFFIX_RE = /\b(inc\.?|corp\.?|ltd\.?|llc\.?|plc\.?|s\.a\.?|n\.v\.?|\bAG\b|\bSE\b|l\.p\.?|\blp\b|company|corporation|incorporated|limited|holdings?|group|co\.?)\b/gi;

  function normalizeName(name) {
    return name
      .split(' - ')[0]
      .replace(LEGAL_SUFFIX_RE, '')
      .replace(/[^a-z0-9&\s]/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  // Common words that should never be treated as a company match on their own.
  // These leak into the Set via prefix generation (e.g. "The Trade Desk" → "the").
  const STOP_WORDS = new Set([
    'the','a','an','of','in','on','at','to','and','or','for','by','up','is',
    'as','its','it','if','be','do','go','we','us','he','she','they','i','you',
    'my','our','no','not','so','but','are','was','has','had','can','may','new',
    'old','big','get','got','let','one','two','co','mr','ms','dr','st','net',
    'are','was','all','any','few','now','its','his','her','their','this','that',
    'with','from','into','than','then','more','also','over','such','only','just',
    'been','have','were','each','when','will','who','how','out','via','per','vs',
  ]);

  // Build lookup Set using exact normalized names only — no prefix generation.
  // Short-form matching (e.g. "BMW" matching "BMW AG") is handled by having
  // explicit short entries in the list. Single-word entries shorter than 5 chars
  // or matching a stop word are skipped to avoid common-word false positives.
  const COMPANY_SET = new Set();
  if (typeof CIPHER_COMPANIES !== 'undefined') {
    for (const raw of CIPHER_COMPANIES) {
      const norm = normalizeName(raw);
      if (norm.length < 2) continue;
      const wordCount = norm.split(' ').filter(Boolean).length;
      if (wordCount === 1) {
        if (norm.length < 5) continue;       // too short to be distinctive
        if (STOP_WORDS.has(norm)) continue;  // common English word
      }
      COMPANY_SET.add(norm);
    }
  }

  function cleanToken(tok) {
    return tok
      .replace(/[''']s$/i, '')
      .replace(/[^a-z0-9&]/gi, '')
      .toLowerCase();
  }

  // Length of the base form of a raw token — strips trailing possessives and punctuation
  // so the highlight span stops before 's, commas, periods, etc.
  function baseLength(raw) {
    return raw
      .replace(/[''']s$/i, '')       // possessives
      .replace(/[^a-z0-9&]+$/i, '')  // trailing punctuation / symbols
      .length;
  }

  // Returns [{start, end, type:'company'}] for greedy longest-match hits.
  function findCompanyPositions(text) {
    const tokenRe = /\S+/g;
    const tokens = [];
    let m;
    while ((m = tokenRe.exec(text)) !== null) {
      tokens.push({ raw: m[0], start: m.index, end: m.index + m[0].length });
    }

    const positions = [];
    let i = 0;
    while (i < tokens.length) {
      // Companies are proper nouns — skip tokens that don't start with an uppercase letter
      if (!/^[A-Z]/.test(tokens[i].raw)) { i++; continue; }

      let matched = false;
      for (let len = Math.min(6, tokens.length - i); len >= 1; len--) {
        const phrase = tokens.slice(i, i + len).map(t => cleanToken(t.raw)).join(' ');
        if (phrase.length > 1 && COMPANY_SET.has(phrase)) {
          const lastTok = tokens[i + len - 1];
          // Trim trailing possessives/punctuation from the span boundary
          const end = lastTok.start + baseLength(lastTok.raw);
          positions.push({ start: tokens[i].start, end, type: 'company' });
          i += len;
          matched = true;
          break;
        }
      }
      if (!matched) i++;
    }
    return positions;
  }

  // ---------------------------------------------------------------------------
  // Highlight mode — read from extension settings, updated live
  // ---------------------------------------------------------------------------
  let highlightMode              = 'companies'; // 'companies' | 'all' | 'none'
  let openInternetHighlightEnabled = false;

  chrome.storage.sync.get(['highlightMode', 'openInternetHighlightEnabled'], result => {
    if (result.highlightMode) highlightMode = result.highlightMode;
    openInternetHighlightEnabled = result.openInternetHighlightEnabled === true;
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'sync') return;
    if (changes.highlightMode) highlightMode = changes.highlightMode.newValue;
    if (changes.openInternetHighlightEnabled) openInternetHighlightEnabled = changes.openInternetHighlightEnabled.newValue;
  });

  // ---------------------------------------------------------------------------
  // NLP clause-subject detection
  // ---------------------------------------------------------------------------

  const FINITE_VERB_TAGS = new Set(['PastTense', 'PresentTense', 'Copula', 'Modal']);
  const PROPER_NOUN_TAGS = new Set(['ProperNoun', 'Person', 'Place', 'Organization']);

  // Returns [{start, end, type:'subject'}] for NLP-detected proper noun subjects.
  function findNLPSubjectPositions(text) {
    if (typeof nlp === 'undefined') return [];

    const doc = nlp(text);
    const data = doc.json();
    if (!data || !data[0] || !data[0].terms || !data[0].terms.length) return [];

    const terms = data[0].terms;
    const targetStrings = new Set();

    const verbPositions = [];
    for (let i = 0; i < terms.length; i++) {
      const tags = terms[i].tags || [];
      if (tags.some(t => FINITE_VERB_TAGS.has(t))) verbPositions.push(i);
    }

    for (const verbIdx of verbPositions) {
      for (let i = verbIdx - 1; i >= 0; i--) {
        const tags = terms[i].tags || [];
        if (tags.some(t => PROPER_NOUN_TAGS.has(t))) {
          let start = i;
          while (start > 0 && (terms[start - 1].tags || []).some(t => PROPER_NOUN_TAGS.has(t))) {
            start--;
          }
          targetStrings.add(terms.slice(start, i + 1).map(t => t.text).join(' '));
          break;
        }
        if (tags.includes('Noun') && !tags.some(t => PROPER_NOUN_TAGS.has(t))) break;
      }
    }

    const lowerText = text.toLowerCase();
    const positions = [];
    for (const noun of targetStrings) {
      if (!noun || noun.length < 2) continue;
      const lowerNoun = noun.toLowerCase();
      let idx = lowerText.indexOf(lowerNoun);
      while (idx !== -1) {
        positions.push({ start: idx, end: idx + noun.length, type: 'subject' });
        idx = lowerText.indexOf(lowerNoun, idx + noun.length);
      }
    }
    return positions;
  }

  // ---------------------------------------------------------------------------
  // DOM helpers
  // ---------------------------------------------------------------------------

  const SKIP_TAGS = new Set([
    'SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'INPUT',
    'TEXTAREA', 'CODE', 'PRE', 'BUTTON', 'SELECT', 'OPTION',
    'NAV', 'FOOTER', 'HEADER'
  ]);
  const COMPANY_CLASS = 'cipher-company-noun';
  const SUBJECT_CLASS = 'cipher-subject-noun';
  const PROCESSED_ATTR = 'data-cipher-nl-processed';

  // Merge company + subject positions; company wins on overlap (comes first in sort).
  function mergePositions(companyPos, subjectPos) {
    const all = [...companyPos, ...subjectPos].sort((a, b) => a.start - b.start);
    const merged = [];
    let lastEnd = -1;
    for (const p of all) {
      if (p.start >= lastEnd) {
        merged.push(p);
        lastEnd = p.end;
      }
    }
    return merged;
  }

  function buildHighlightedFragment(text, positions) {
    if (!positions.length) return null;
    const fragment = document.createDocumentFragment();
    let pos = 0;
    for (const { start, end, type } of positions) {
      if (start > pos) fragment.appendChild(document.createTextNode(text.slice(pos, start)));
      const span = document.createElement('span');
      span.className = type === 'company' ? COMPANY_CLASS : SUBJECT_CLASS;
      span.textContent = text.slice(start, end);
      fragment.appendChild(span);
      pos = end;
    }
    if (pos < text.length) fragment.appendChild(document.createTextNode(text.slice(pos)));
    return fragment;
  }

  function hasHighlight(fragment) {
    return fragment.querySelector('.' + COMPANY_CLASS + ', .' + SUBJECT_CLASS);
  }

  function processTextNode(textNode) {
    if (highlightMode === 'none' || !openInternetHighlightEnabled) return;

    const text = textNode.nodeValue;
    if (!text || text.trim().length < 15) return;
    const parent = textNode.parentElement;
    if (parent && (parent.classList.contains(COMPANY_CLASS) || parent.classList.contains(SUBJECT_CLASS))) return;

    // In 'companies' mode we only need company positions — no NLP sentence split required
    if (highlightMode === 'companies') {
      const compPos = findCompanyPositions(text);
      const frag = buildHighlightedFragment(text, compPos);
      if (frag && hasHighlight(frag)) textNode.parentNode.replaceChild(frag, textNode);
      return;
    }

    // 'all' mode: company list + NLP subjects, sentence by sentence
    let sentenceStrings = [];
    if (typeof nlp !== 'undefined') {
      sentenceStrings = nlp(text).sentences().out('array') || [];
    }

    const fullFragment = document.createDocumentFragment();
    let remaining = text;

    if (sentenceStrings.length === 0) {
      const compPos = findCompanyPositions(text);
      const frag = buildHighlightedFragment(text, compPos);
      if (frag && hasHighlight(frag)) textNode.parentNode.replaceChild(frag, textNode);
      return;
    }

    for (const sentence of sentenceStrings) {
      if (!sentence || !sentence.trim()) continue;
      const sentIdx = remaining.indexOf(sentence);
      if (sentIdx === -1) continue;

      if (sentIdx > 0) {
        const pre = remaining.slice(0, sentIdx);
        const prePos = findCompanyPositions(pre);
        fullFragment.appendChild(buildHighlightedFragment(pre, prePos) || document.createTextNode(pre));
      }

      const sentenceText = remaining.slice(sentIdx, sentIdx + sentence.length);
      const companyPos = findCompanyPositions(sentenceText);
      const nlpPos = findNLPSubjectPositions(sentenceText);
      const combined = mergePositions(companyPos, nlpPos);

      if (combined.length > 0) {
        fullFragment.appendChild(buildHighlightedFragment(sentenceText, combined));
      } else {
        fullFragment.appendChild(document.createTextNode(sentenceText));
      }

      remaining = remaining.slice(sentIdx + sentence.length);
    }

    if (remaining) {
      const compPos = findCompanyPositions(remaining);
      fullFragment.appendChild(buildHighlightedFragment(remaining, compPos) || document.createTextNode(remaining));
    }

    if (hasHighlight(fullFragment)) {
      textNode.parentNode.replaceChild(fullFragment, textNode);
    }
  }

  function shouldSkip(el) {
    return !el || SKIP_TAGS.has(el.tagName) || el.hasAttribute(PROCESSED_ATTR);
  }

  function processElement(el) {
    if (shouldSkip(el)) return;
    el.setAttribute(PROCESSED_ATTR, '1');

    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || SKIP_TAGS.has(parent.tagName) ||
            parent.classList.contains(COMPANY_CLASS) ||
            parent.classList.contains(SUBJECT_CLASS)) {
          return NodeFilter.FILTER_SKIP;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const nodes = [];
    let node;
    while ((node = walker.nextNode())) nodes.push(node);
    nodes.forEach(processTextNode);
  }

  function processPage() {
    const elements = document.querySelectorAll(
      'p, h1, h2, h3, h4, h5, h6, li, article, blockquote, td, th'
    );
    let i = 0;

    function processBatch() {
      const end = Math.min(i + 10, elements.length);
      while (i < end) { processElement(elements[i]); i++; }
      if (i < elements.length) requestIdleCallback(processBatch);
    }

    if ('requestIdleCallback' in window) requestIdleCallback(processBatch);
    else setTimeout(processBatch, 0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', processPage);
  } else {
    processPage();
  }
})();
