// TODO: Make this work the more traditonal React way with hooks.

const CompassAIComponent = ({ companyName, brandName = null, politicalData = null, isLoading = false }) => {
    // Default data structure for when API fails or no data
    const defaultPoliticalData = {
        lean: 'Unknown',
        score: 'N/A',
        description: 'Political leaning information is not available for this company.',
        citationUrl: `Financial Contributions Overview for ${companyName}`
    };

    // Use API data if available, otherwise use default
    const data = politicalData || defaultPoliticalData;

    // If we have a sperate brand name lets actually use that for the title NOT the company. 
    // This will look more approachable to the normal person.
    let title_overview_name = companyName;
    // Prepend text that will inform the user that the company owns that brand. 
    // This will be worth making very upfront to users to avoid confusion.
    let description_context = data.description;
    if (brandName != null && brandName != 'Unknown Brand') {
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
                React.createElement('div', { className: 'loading-placeholder' }, 'Loading political analysis...')
            )
        );
    }

    const handleCitationClickFinancialContributionsOverview = (e) => {
        e.preventDefault();
        // Placeholder URL - replace with your actual endpoint later
        // Dev
        // const BASE_URL = 'http://localhost:5173'
        // Prod
        const BASE_URL = 'https://wintercoder1.github.io' 
        // Financial contributions overview URl.
        const url = `${BASE_URL}/Cool-Project-Frontend#/organization/financial-contributions/${encodeURIComponent(companyName)}`
        window.open(url, '_blank');
    };
    const handleCitationClickWikipedia = (e) => {
        e.preventDefault();
        // Placeholder URL - replace with your actual endpoint later
        const url = `https://en.wikipedia.org/wiki/${encodeURIComponent(companyName)}`;
        window.open(url, '_blank');
    };

    return React.createElement('div', 
        { className: 'tilt-ai-container' },
        React.createElement(window.TiltAIHeader),
        React.createElement('div', { className: 'tilt-ai-content' },
            React.createElement('div', { className: 'overview-header' },
                // React.createElement('h2', null, 'Political Leaning Overview for '),
                // React.createElement('span', { className: 'company-name-highlight' }, companyName)
                React.createElement('h2', null, 'Political Leaning Overview for '),
                // React.createElement('span', null, companyName)
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
            ),
            React.createElement('div', { className: 'description-section' },
                React.createElement('p', { className: 'political-description' }, description_context)
            ),
            
            React.createElement('div', { className: 'citations-section' },
                React.createElement('h4', { className: 'citations-header' }, 'Citations:'),
                // Conditionally render financial contributions citation
                politicalData && politicalData.created_with_financial_contributions_info === true
                    ? React.createElement('a', {
                        href: '#',
                        className: 'citation-link',
                        onClick: handleCitationClickFinancialContributionsOverview
                    }, `Financial Contributions Data for ${companyName}`)
                    : null,
                politicalData && politicalData.created_with_financial_contributions_info === true
                    ? React.createElement('br')
                    : null,
                // Wikipedia citation.
                React.createElement('a', { 
                    href: '#', 
                    className: 'citation-link',
                    onClick: handleCitationClickWikipedia
                }, 'Wikipedia')
            )
            
        )
    );
};


// Export for use in other modules
window.CompassAIComponent = CompassAIComponent;


// Interesting LLM gnerated alternative.

// TODO: Make this work the more traditional React way with hooks.
// const CompassAIComponent = ({ companyName, brandName = null, politicalData = null, isLoading = false }) => {
//     // Default data structure for when API fails or no data
//     const defaultPoliticalData = {
//         lean: 'Unknown',
//         score: 'N/A',
//         description: 'Political leaning information is not available for this company.',
//         citationUrl: `Financial Contributions Overview for ${companyName}`
//     };

//     // Use API data if available, otherwise use default
//     const data = politicalData || defaultPoliticalData;

//     // If we have a separate brand name lets actually use that for the title NOT the company. 
//     // This will look more approachable to the normal person.
//     let title_overview_name = companyName;
//     // Prepend text that will inform the user that the company owns that brand. 
//     // This will be worth making very upfront to users to avoid confusion.
//     let description_context = data.description;
//     if (brandName != null && brandName != 'Unknown Brand') {
//         const prepend_text = `${brandName} is owned by ${companyName}. `
//         description_context = prepend_text + description_context;
//         console.log(`Will prepend text ${prepend_text}`)
//         title_overview_name = brandName;
//     }

//     if (isLoading) {
//         return React.createElement('div', 
//             { className: 'tilt-ai-container loading' },
//             React.createElement(window.TiltAIHeader),
//             React.createElement('div', { className: 'tilt-ai-content' },
//                 // UPDATED: Mock the full layout structure during loading
//                 React.createElement('div', { className: 'overview-header' },
//                     React.createElement('h2', null, 'Political Leaning Overview for '),
//                     React.createElement('h2', { 
//                         style: { 
//                             background: '#f0f0f0', 
//                             borderRadius: '4px', 
//                             padding: '2px 8px',
//                             display: 'inline-block',
//                             minWidth: '120px',
//                             height: '24px'
//                         } 
//                     }, companyName || 'Loading...')
//                 ),
//                 React.createElement('div', { className: 'lean-section' },
//                     React.createElement('div', { className: 'lean-row' },
//                         React.createElement('span', { className: 'lean-label' }, 'Lean:'),
//                         React.createElement('span', { 
//                             className: 'lean-value',
//                             style: { 
//                                 background: '#f0f0f0', 
//                                 borderRadius: '4px', 
//                                 padding: '2px 8px',
//                                 minWidth: '80px',
//                                 height: '20px',
//                                 display: 'inline-block'
//                             } 
//                         }, 'Loading...'),
//                         React.createElement('div', { className: 'rating-section' },
//                             React.createElement('span', { className: 'rating-label' }, 'Rating:'),
//                             React.createElement('span', { 
//                                 className: 'rating-score',
//                                 style: { 
//                                     background: '#f0f0f0', 
//                                     borderRadius: '4px', 
//                                     padding: '2px 8px',
//                                     minWidth: '30px',
//                                     height: '20px',
//                                     display: 'inline-block'
//                                 } 
//                             }, '...')
//                         )
//                     )
//                 ),
//                 React.createElement('div', { className: 'description-section' },
//                     React.createElement('p', { 
//                         className: 'political-description',
//                         style: {
//                             background: '#f0f0f0',
//                             borderRadius: '4px',
//                             padding: '8px',
//                             minHeight: '60px',
//                             lineHeight: '1.4'
//                         }
//                     }, 'Loading political analysis...')
//                 ),
//                 React.createElement('div', { className: 'citations-section' },
//                     React.createElement('h4', { className: 'citations-header' }, 'Citations:'),
//                     React.createElement('div', {
//                         style: {
//                             background: '#f0f0f0',
//                             borderRadius: '4px',
//                             padding: '4px 8px',
//                             minWidth: '100px',
//                             height: '16px',
//                             display: 'inline-block'
//                         }
//                     }, 'Loading...')
//                 )
//             )
//         );
//     }

//     const handleCitationClickFinancialContributionsOverview = (e) => {
//         e.preventDefault();
//         // Placeholder URL - replace with your actual endpoint later
//         // Dev
//         // const BASE_URL = 'http://localhost:5173'
//         // Prod
//         const BASE_URL = 'https://wintercoder1.github.io' 
//         // Financial contributions overview URL.
//         const url = `${BASE_URL}/Cool-Project-Frontend#/organization/financial-contributions/${encodeURIComponent(companyName)}`
//         window.open(url, '_blank');
//     };
//     const handleCitationClickWikipedia = (e) => {
//         e.preventDefault();
//         // Placeholder URL - replace with your actual endpoint later
//         const url = `https://en.wikipedia.org/wiki/${encodeURIComponent(companyName)}`;
//         window.open(url, '_blank');
//     };

//     return React.createElement('div', 
//         { className: 'tilt-ai-container' },
//         React.createElement(window.TiltAIHeader),
//         React.createElement('div', { className: 'tilt-ai-content' },
//             React.createElement('div', { className: 'overview-header' },
//                 // React.createElement('h2', null, 'Political Leaning Overview for '),
//                 // React.createElement('span', { className: 'company-name-highlight' }, companyName)
//                 React.createElement('h2', null, 'Political Leaning Overview for '),
//                 // React.createElement('span', null, companyName)
//                 React.createElement('h2', null, title_overview_name)
//             ),
//             React.createElement('div', { className: 'lean-section' },
//                 React.createElement('div', { className: 'lean-row' },
//                     React.createElement('span', { className: 'lean-label' }, 'Lean:'),
//                     React.createElement('span', { className: 'lean-value' }, data.lean),
//                     React.createElement('div', { className: 'rating-section' },
//                         React.createElement('span', { className: 'rating-label' }, 'Rating:'),
//                         React.createElement('span', { className: 'rating-score' }, data.score)
//                     )
//                 )
//             ),
//             React.createElement('div', { className: 'description-section' },
//                 React.createElement('p', { className: 'political-description' }, description_context)
//             ),
            
//             React.createElement('div', { className: 'citations-section' },
//                 React.createElement('h4', { className: 'citations-header' }, 'Citations:'),
//                 // Conditionally render financial contributions citation
//                 politicalData && politicalData.created_with_financial_contributions_info === true
//                     ? React.createElement('a', {
//                         href: '#',
//                         className: 'citation-link',
//                         onClick: handleCitationClickFinancialContributionsOverview
//                     }, `Financial Contributions Data for ${companyName}`)
//                     : null,
//                 politicalData && politicalData.created_with_financial_contributions_info === true
//                     ? React.createElement('br')
//                     : null,
//                 // Wikipedia citation.
//                 React.createElement('a', { 
//                     href: '#', 
//                     className: 'citation-link',
//                     onClick: handleCitationClickWikipedia
//                 }, 'Wikipedia')
//             )
            
//         )
//     );
// };

// // Export for use in other modules
// window.CompassAIComponent = CompassAIComponent;