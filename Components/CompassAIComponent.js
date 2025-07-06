const CompassAIComponent = ({ companyName, politicalData = null, isLoading = false }) => {
    // Default data structure for future network calls
    const defaultPoliticalData = {
        lean: 'Conservative',
        score: '3',
        description: `The company's funding patterns, as reflected in their financial contributions, show a slightly Republican-leaning tendency, with 54.55% of their contributions going to Republican candidates and committees. This, combined with their strategic support for policymakers who can influence healthcare policy, tax policies, and regulatory burdens, indicates a conservative leaning. However, their substantial support for Democratic candidates and commitment to building relationships with lawmakers from both parties suggest a more moderate, pragmatic approach, rather than a strongly conservative one.`,
        citationUrl: `Financial Contributions Overview for ${companyName}`
    };

    // Use provided data or default data for now
    const data = politicalData || defaultPoliticalData;

    if (isLoading) {
        return React.createElement('div', 
            { className: 'tilt-ai-container loading' },
            React.createElement('div', { className: 'tilt-ai-header' },
                React.createElement('div', { className: 'tilt-ai-brand' }, 'Tilt AI')
            ),
            React.createElement('div', { className: 'tilt-ai-content' },
                React.createElement('div', { className: 'loading-placeholder' }, 'Loading political analysis...')
            )
        );
    }

    const handleCitationClick = (e) => {
        e.preventDefault();
        // Placeholder URL - replace with your actual endpoint later
        const url = `https://en.wikipedia.org/wiki/${encodeURIComponent(companyName)}`;
        window.open(url, '_blank');
    };

    return React.createElement('div', 
        { 
            className: 'tilt-ai-container'
         },
        React.createElement('div', { className: 'tilt-ai-header' },
            React.createElement('div', { className: 'tilt-ai-brand' }, 'Tilt AI')
        ),
        React.createElement('div', { className: 'tilt-ai-content' },
            React.createElement('div', { className: 'overview-header' },
                React.createElement('h2', null, 'Political Leaning Overview for '),
                // React.createElement('span', null, companyName)
                React.createElement('h2', null, companyName)
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
                React.createElement('p', { className: 'political-description' }, data.description)
            ),
            React.createElement('div', { className: 'citations-section' },
                React.createElement('h4', { className: 'citations-header' }, 'Citations:'),
                React.createElement('a', { 
                    href: '#', 
                    className: 'citation-link',
                    onClick: handleCitationClick
                }, data.citationUrl)
            )
        )
    );
};

// clickOnFinancialContributionsOverview() {

// };

// Export for use in other modules
window.CompassAIComponent = CompassAIComponent;