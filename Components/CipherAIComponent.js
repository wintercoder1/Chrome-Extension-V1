// TODO: Make this work the more traditonal React way with hooks.

const CipherAIComponent = ({ companyName, brandName = null, politicalData = null, isLoading = false, category = 'Political Leaning' }) => {
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
                    title: `Open ${companyName} on Cipher AI`
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
