// TODO: Make this work the more traditonal React way with hooks.

const CIPHER_SITE_BASE = 'https://www.cipher-ai.io';
const CIPHER_DEMO_COLORS = [
  '#4e79a7', '#f28e2b', '#e15759', '#76b7b2',
  '#59a14f', '#edc948', '#b07aa1', '#9c755f',
];

const cipherFormatDollars = n => '$' + Math.round(n).toLocaleString('en-US');

const cipherOpenSite = (slug, topic, id) => {
  const suffix = id ? `?id=${encodeURIComponent(id)}` : '';
  window.open(`${CIPHER_SITE_BASE}/organization/${slug}/${encodeURIComponent(topic)}${suffix}`, '_blank');
};

const cipherOpenLinkButton = (onClick, title) =>
  React.createElement('div', { className: 'open-link-section' },
    React.createElement('button', { className: 'open-link-btn', onClick, title },
      React.createElement('svg', {
        xmlns: 'http://www.w3.org/2000/svg', width: '14', height: '14',
        viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
        strokeWidth: '2', strokeLinecap: 'round', strokeLinejoin: 'round',
      },
        React.createElement('path', { d: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' }),
        React.createElement('polyline', { points: '15 3 21 3 21 9' }),
        React.createElement('line', { x1: '10', y1: '14', x2: '21', y2: '3' })
      )
    )
  );

// SVG pie built with arc paths; a single slice needs a circle since an arc
// from a point back to itself renders nothing.
const cipherPieChart = (groups, size = 110) => {
  const cx = size / 2, cy = size / 2, r = size / 2 - 3;
  if (!groups.length) return null;
  const svgProps = { width: size, height: size, viewBox: `0 0 ${size} ${size}` };
  if (groups.length === 1) {
    return React.createElement('svg', svgProps,
      React.createElement('circle', { cx, cy, r, fill: CIPHER_DEMO_COLORS[0] }));
  }
  const total = groups.reduce((s, g) => s + g.percent, 0) || 100;
  let angle = -Math.PI / 2;
  const paths = groups.map((g, i) => {
    if (g.percent <= 0) return null;
    const sweep = (g.percent / total) * 2 * Math.PI;
    const end = angle + sweep;
    const x1 = cx + r * Math.cos(angle), y1 = cy + r * Math.sin(angle);
    const x2 = cx + r * Math.cos(end),   y2 = cy + r * Math.sin(end);
    const d = `M${cx},${cy} L${x1.toFixed(2)},${y1.toFixed(2)} A${r},${r} 0 ${sweep > Math.PI ? 1 : 0},1 ${x2.toFixed(2)},${y2.toFixed(2)} Z`;
    angle = end;
    return React.createElement('path', { key: i, d, fill: CIPHER_DEMO_COLORS[i % CIPHER_DEMO_COLORS.length] });
  });
  return React.createElement('svg', svgProps, paths);
};

const CipherFinancialContributions = ({ data, topic }) => {
  const title = React.createElement('div', { className: 'overview-header' },
    React.createElement('h2', null, 'Financial Contributions for '),
    React.createElement('h2', null, topic)
  );
  const openBtn = cipherOpenLinkButton(
    e => { e.preventDefault(); cipherOpenSite('financial_contributions', topic, data.id); },
    `Open on ${APP_NAME}`
  );
  // Only offer the deep link when an answer exists to open.
  const linkBtn = data.id ? openBtn : null;

  const note = txt => React.createElement('p', { className: 'contrib-note' }, txt);

  if (data.error) {
    return React.createElement(React.Fragment, null, title,
      React.createElement('div', { className: 'description-section' },
        React.createElement('p', { className: 'political-description' },
          'Contribution data is unavailable right now.')));
  }

  // Cited fact: no corporate PAC. The scope note must accompany it — a corporate
  // PAC is narrow, and omitting it implies no political spending at all.
  if (data.committeeStatus === 'no_pac_on_record') {
    return React.createElement(React.Fragment, null, title,
      React.createElement('div', { className: 'description-section' },
        React.createElement('p', { className: 'political-description' },
          data.message || `${topic} does not operate a corporate political action committee.`)),
      data.scopeNote ? note(data.scopeNote) : null,
      data.sourceUrl ? React.createElement('div', { className: 'citations-section' },
        React.createElement('h4', { className: 'citations-header' }, 'Source:'),
        React.createElement('a', {
          href: '#', className: 'citation-link',
          onClick: e => { e.preventDefault(); window.open(data.sourceUrl, '_blank'); },
        }, 'Company policy statement ↗')) : null,
      linkBtn);
  }

  // Found nothing — claim nothing.
  if (data.committeeStatus === 'no_committee_found') {
    return React.createElement(React.Fragment, null, title,
      React.createElement('div', { className: 'description-section' },
        React.createElement('p', { className: 'political-description' },
          data.message || 'No political committee matching this company was found in the FEC data.')),
      data.searchedAs && data.searchedAs.length
        ? note(`Searched as: ${data.searchedAs.join(', ')}`) : null,
      linkBtn);
  }

  if (!data.total) {
    return React.createElement(React.Fragment, null, title,
      React.createElement('div', { className: 'description-section' },
        React.createElement('p', { className: 'political-description' },
          'No contribution totals are available for this term.')),
      linkBtn);
  }

  const sum = (data.pct_democrats || 0) + (data.pct_republicans || 0);
  const demWidth = sum > 0 ? ((data.pct_democrats / sum) * 100).toFixed(2) : 50;

  return React.createElement(React.Fragment, null,
    title,
    data.resolvedViaParent
      ? note(`Reported from parent company ${data.resolvedViaParent}.`) : null,
    React.createElement('div', { className: 'contrib-stats' },
      React.createElement('div', { className: 'contrib-stat-line' },
        `Total Contributions: ${cipherFormatDollars(data.total)}`),
      React.createElement('div', { className: 'contrib-stat-line' },
        `To Republicans: ${cipherFormatDollars(data.to_republicans)} (${data.pct_republicans.toFixed(2)}%)`),
      React.createElement('div', { className: 'contrib-stat-line' },
        `To Democrats: ${cipherFormatDollars(data.to_democrats)} (${data.pct_democrats.toFixed(2)}%)`)
    ),
    React.createElement('div', { className: 'contrib-bar' },
      React.createElement('div', { className: 'contrib-bar-dem', style: { width: `${demWidth}%` } }),
      React.createElement('div', { className: 'contrib-bar-rep' })
    ),
    React.createElement('div', { className: 'contrib-legend' },
      React.createElement('div', { className: 'contrib-legend-item' },
        React.createElement('span', { className: 'contrib-dot', style: { background: '#6495ed' } }),
        React.createElement('span', null, 'Democrats')),
      React.createElement('div', { className: 'contrib-legend-item' },
        React.createElement('span', { className: 'contrib-dot', style: { background: '#e05c5c' } }),
        React.createElement('span', null, 'Republicans'))
    ),
    data.quickText
      ? React.createElement('p', { className: 'contrib-preview' }, data.quickText) : null,
    note('This financial information is based on Federal Election Commission filings from the 2024 election cycle.'),
    openBtn
  );
};

const CipherLeadershipDemographics = ({ data, topic }) => {
  const title = React.createElement('div', { className: 'overview-header' },
    React.createElement('h2', null, 'Leadership Demographics for '),
    React.createElement('h2', null, topic)
  );

  if (!data.groups || !data.groups.length) {
    return React.createElement(React.Fragment, null, title,
      React.createElement('div', { className: 'description-section' },
        React.createElement('p', { className: 'political-description' },
          'No demographics data available for this term.')));
  }

  return React.createElement(React.Fragment, null,
    title,
    data.team_size
      ? React.createElement('p', { className: 'demo-team-size' },
          `C-suite team: ${data.team_size} officer${data.team_size !== 1 ? 's' : ''}`)
      : null,
    data.basis
      ? React.createElement('p', { className: 'contrib-note' },
          `${data.basis}${data.is_estimate ? ' · Estimated' : ''}`)
      : null,
    React.createElement('div', { className: 'demo-chart-area' },
      cipherPieChart(data.groups),
      React.createElement('div', { className: 'demo-legend' },
        data.groups.map((g, i) =>
          React.createElement('div', { className: 'demo-legend-row', key: i },
            React.createElement('span', {
              className: 'demo-swatch',
              style: { background: CIPHER_DEMO_COLORS[i % CIPHER_DEMO_COLORS.length] },
            }),
            React.createElement('span', { className: 'demo-group-name' }, g.group),
            React.createElement('span', { className: 'demo-pct' }, `${g.percent}%`)
          )
        )
      )
    ),
    data.company_page_url
      ? React.createElement('div', { className: 'citations-section' },
          React.createElement('h4', { className: 'citations-header' }, 'Source:'),
          React.createElement('a', {
            href: '#', className: 'citation-link',
            onClick: e => { e.preventDefault(); window.open(data.company_page_url, '_blank'); },
          }, 'Company Leadership Page ↗'))
      : null,
    cipherOpenLinkButton(
      e => { e.preventDefault(); cipherOpenSite('leadership_demographics', topic, data.id); },
      `Open on ${APP_NAME}`)
  );
};

const CipherAIComponent = ({ companyName, brandName = null, politicalData = null, isLoading = false, category = 'Financial Contributions' }) => {
    // Default data structure for when API fails or no data
    const defaultPoliticalData = {
        lean: 'Unknown',
        score: 'N/A',
        description: 'Political leaning information is not available for this company.',
        citationUrl: `Financial Contributions Overview for ${companyName}`,
        queryType: 'Political Leaning'
    };

    console.log(`!! Now rendering component with brand name: ${brandName} and company name: ${companyName}`)

    // Use API data if available, otherwise use default
    const data = politicalData || defaultPoliticalData;

    // If we have a sperate brand name lets actually use that for the title NOT the company. 
    // This will look more approachable to the normal person.
    let title_overview_name = companyName;
    // Prepend text that will inform the user that the company owns that brand. 
    // This will be worth making very upfront to users to avoid confusion.
    let description_context = data.description;
    if (brandName != null && brandName.trim().toLowerCase() !== companyName.trim().toLowerCase() && 
        brandName != 'Unknown Brand' && brandName != 'No' && brandName != 'No.') {
        const prepend_text = `${brandName} is owned by ${companyName}. `
        description_context = prepend_text + description_context;
        console.log(`Will prepend text ${prepend_text}`)
        title_overview_name =  brandName;
    }

    if (isLoading) {
        return React.createElement('div', 
            { className: 'tilt-ai-container loading' },
            React.createElement(window.TiltAIHeader),
            React.createElement('div', { className: 'tilt-ai-content' },
                React.createElement('div', { className: 'loading-placeholder' }, `Loading ${category.toLowerCase()} analysis...`)
            )
        );
    }

    // Chart-based categories render their own layout; the brand-prepend logic
    // above only applies to the lean/rating/description shape.
    if (politicalData && politicalData.type === 'financial_contributions') {
        return React.createElement('div', { className: 'tilt-ai-container' },
            React.createElement(window.TiltAIHeader),
            React.createElement('div', { className: 'tilt-ai-content' },
                React.createElement(CipherFinancialContributions,
                    { data: politicalData, topic: title_overview_name })));
    }
    if (politicalData && politicalData.type === 'leadership_demographics') {
        return React.createElement('div', { className: 'tilt-ai-container' },
            React.createElement(window.TiltAIHeader),
            React.createElement('div', { className: 'tilt-ai-content' },
                React.createElement(CipherLeadershipDemographics,
                    { data: politicalData, topic: title_overview_name })));
    }

    const BASE_URL = 'https://cipher-ai.io';

    const handleCitationClickFinancialContributionsOverview = (e) => {
        e.preventDefault();
        const url = `${BASE_URL}/organization/financial_contributions/${encodeURIComponent(companyName)}`;
        window.open(url, '_blank');
    };

    const handleOpenLink = (e) => {
        e.preventDefault();
        const slug = data.queryType.toLowerCase().replace(/\s+/g, '_');
        const url = `${BASE_URL}/organization/${slug}/${encodeURIComponent(companyName)}`;
        window.open(url, '_blank');
    };
    const handleCitationClickWikipedia = (e) => {
        e.preventDefault();
        // Placeholder URL - replace with your actual endpoint later
        const url = `https://en.wikipedia.org/wiki/${encodeURIComponent(companyName)}`;
        window.open(url, '_blank');
    };

    const isPoliticalLeaning = data.queryType === 'Political Leaning';

    return React.createElement('div',
        { className: 'tilt-ai-container' },
        React.createElement(window.TiltAIHeader),
        React.createElement('div', { className: 'tilt-ai-content' },

            isPoliticalLeaning
                // Political Leaning: title on its own line, Lean + Rating below
                ? React.createElement(React.Fragment, null,
                    React.createElement('div', { className: 'overview-header' },
                        React.createElement('h2', null, `${data.queryType} Overview for `),
                        React.createElement('h2', null, title_overview_name)
                    ),
                    React.createElement('div', { className: 'lean-section' },
                        React.createElement('div', { className: 'lean-row' },
                            React.createElement('span', { className: 'lean-label' }, 'Lean:'),
                            React.createElement('span', { className: 'lean-value' }, data.lean),
                            React.createElement('div', { className: 'rating-section' },
                                React.createElement('span', { className: 'rating-label' }, 'Rating:'),
                                React.createElement('span', { className: 'rating-score' }, data.score)
                            )
                        )
                    )
                  )
                // All other categories: title (~80%) + rating (~20%) on one line
                : React.createElement('div', { className: 'header-rating-row' },
                    React.createElement('div', { className: 'header-rating-title' },
                        React.createElement('h2', null, `${data.queryType} Overview for `),
                        React.createElement('h2', null, title_overview_name)
                    ),
                    React.createElement('div', { className: 'header-rating-score' },
                        React.createElement('span', { className: 'rating-label' }, 'Rating:'),
                        React.createElement('span', { className: 'rating-score-inline' }, data.score)
                    )
                  ),
            React.createElement('div', { className: 'description-section' },
                React.createElement('p', { className: 'political-description' }, description_context)
            ),
            
            // Conditionally render citation section.
            // For now only focuses on financial contributions.
            // TODO: Consider showing wikipedia citation but only when link to wikipedia is valid.    
            politicalData && politicalData.created_with_financial_contributions_info === true
                ? React.createElement('div', { className: 'citations-section' },
                React.createElement('h4', { className: 'citations-header' }, 'Citations:'),
                React.createElement('a', {
                    href: '#',
                    className: 'citation-link',
                    onClick: handleCitationClickFinancialContributionsOverview
                }, `Financial Contributions Data for ${companyName}`)
            ) : null,

            // With wikipedia section by default.
            // React.createElement('div', { className: 'citations-section' },
            //     React.createElement('h4', { className: 'citations-header' }, 'Citations:'),
            //     // Conditionally render financial contributions citation
            //     politicalData && politicalData.created_with_financial_contributions_info === true
            //         ? React.createElement('a', {
            //             href: '#',
            //             className: 'citation-link',
            //             onClick: handleCitationClickFinancialContributionsOverview
            //         }, `Financial Contributions Data for ${companyName}`)
            //         : null,
            //     politicalData && politicalData.created_with_financial_contributions_info === true
            //         ? React.createElement('br')
            //         : null,
            //     // Wikipedia citation.
            //     React.createElement('a', { 
            //         href: '#', 
            //         className: 'citation-link',
            //         onClick: handleCitationClickWikipedia
            //     }, 'Wikipedia')
            // )

            React.createElement('div', { className: 'open-link-section' },
                React.createElement('button', {
                    className: 'open-link-btn',
                    onClick: handleOpenLink,
                    title: `Open ${companyName} on ${APP_NAME}`
                },
                    React.createElement('svg', {
                        xmlns: 'http://www.w3.org/2000/svg',
                        width: '14',
                        height: '14',
                        viewBox: '0 0 24 24',
                        fill: 'none',
                        stroke: 'currentColor',
                        strokeWidth: '2',
                        strokeLinecap: 'round',
                        strokeLinejoin: 'round'
                    },
                        React.createElement('path', { d: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' }),
                        React.createElement('polyline', { points: '15 3 21 3 21 9' }),
                        React.createElement('line', { x1: '10', y1: '14', x2: '21', y2: '3' })
                    ),
                    ''
                )
            )

        )
    );
};


// Export for use in other modules
window.CipherAIComponent = CipherAIComponent;
