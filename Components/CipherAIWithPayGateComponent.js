const CipherAIWithPaygateComponent = ({ 
    companyName, 
    brandName = null, 
    politicalData = null, 
    isLoading = false,
    showPaygate = false,
    isProUser = false
}) => {

    const handleLogin = () => {
        if (window.globalAmazonBrandTracker?.displayElementManager?.handleLogin) {
            window.globalAmazonBrandTracker.displayElementManager.handleLogin();
        }
    };

    const handleUpgrade = () => {
        if (window.globalAmazonBrandTracker?.displayElementManager?.handleUpgrade) {
            window.globalAmazonBrandTracker.displayElementManager.handleUpgrade();
        }
    };

    const handleCitationClick = (e) => {
        e.preventDefault();
        const url = `https://en.wikipedia.org/wiki/${encodeURIComponent(companyName)}`;
        window.open(url, '_blank');
    };

    // Paygate content for Pro users (login prompt)
    const renderProUserPaygate = () => {
        return React.createElement('div', { className: 'paygate-content' },
            React.createElement('h2', { className: 'paygate-title' }, 'Welcome Back'),
            React.createElement('p', { className: 'paygate-subtitle' }, 
                `Please log in to continue using ${APP_NAME} Pro`
            ),
            React.createElement('button', { 
                className: 'paygate-btn paygate-btn-primary',
                onClick: handleLogin
            }, 'LOG IN'),
            React.createElement('p', { className: 'paygate-footer-text' }, 
                'Already have an account? Just log in to resume access.'
            )
        );
    };

    // Paygate content for free users (upgrade prompt)
    const renderFreeUserPaygate = () => {
        return React.createElement('div', { className: 'paygate-content' },
            React.createElement('h2', { className: 'paygate-title' }, `Upgrade to ${APP_NAME} Pro`),
            React.createElement('p', { className: 'paygate-subtitle' }, 
                'You\'ve reached your daily limit of ',
                React.createElement('strong', null, '10 free'),
                ' company analyses.'
            ),
            React.createElement('p', { className: 'paygate-description' }, 
                'Get unlimited analyses, detailed political contribution data, and historical trend insights with Pro.'
            ),
            React.createElement('div', { className: 'paygate-price' }, '$4.99/month'),
            React.createElement('p', { className: 'paygate-price-note' }, 'Cancel anytime'),
            React.createElement('button', { 
                className: 'paygate-btn paygate-btn-primary',
                onClick: handleUpgrade
            }, 'UPGRADE TO PRO'),
            React.createElement('p', { className: 'paygate-footer-text' }, 
                'Limit resets tomorrow at midnight'
            )
        );
    };
    

    // Render paygate
    const renderPaygate = () => {
        return React.createElement('div', { className: 'paygate-wrapper' },
            isProUser ? renderProUserPaygate() : renderFreeUserPaygate()
        );
    };

    // Render actual content (your original content)
    // const renderContent = () => {
    //     return React.createElement('div', { className: 'tilt-ai-content' },
    //         React.createElement('div', { className: 'overview-header' },
    //             React.createElement('h2', null, 'Political Leaning Overview for '),
    //             React.createElement('h2', null, title_overview_name)
    //         ),
    //         React.createElement('div', { className: 'lean-section' },
    //             React.createElement('div', { className: 'lean-row' },
    //                 React.createElement('span', { className: 'lean-label' }, 'Lean:'),
    //                 React.createElement('span', { className: 'lean-value' }, data.lean),
    //                 React.createElement('div', { className: 'rating-section' },
    //                     React.createElement('span', { className: 'rating-label' }, 'Rating:'),
    //                     React.createElement('span', { className: 'rating-score' }, data.score)
    //                 )
    //             )
    //         ),
    //         React.createElement('div', { className: 'description-section' },
    //             React.createElement('p', { className: 'political-description' }, description_context)
    //         ),
    //         politicalData && politicalData.created_with_financial_contributions_info === true
    //             ? React.createElement('div', { className: 'citations-section' },
    //                 React.createElement('h4', { className: 'citations-header' }, 'Citations:'),
    //                 React.createElement('a', {
    //                     href: '#',
    //                     className: 'citation-link',
    //                     onClick: handleCitationClickFinancialContributionsOverview
    //                 }, `Financial Contributions Data for ${companyName}`)
    //             ) : null
    //     );
    // };

    return React.createElement('div', 
        { className: 'tilt-ai-container' },
        React.createElement(window.TiltAIHeader),
        showPaygate ? renderPaygate() : renderContent()
    );
    // return React.createElement('div', 
    //     { className: 'tilt-ai-container' },
    //     React.createElement(window.TiltAIHeader),
    //     renderPaygate()
    //     // showPaygate ? renderPaygate() : renderContent()
    // );
    // return React.createElement('div', 
    //     { className: showPaygate ? 'tilt-ai-container paygate-active' : 'tilt-ai-container' },
    //     React.createElement(window.TiltAIHeader),
    //     showPaygate ? renderPaygate() : renderContent()
    // );
};

// Styles for the paygate - matching existing extension style
// Styles for the paygate - matching existing extension style

// Styles for the paygate - matching existing extension style
// Styles for the paygate - matching existing extension style
const paygateStyles = `
    .paygate-wrapper {
        padding: 24px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .paygate-content {
        text-align: center;
        width: 100%;
        max-width: 300px;
        margin: 0 auto;
    }

    .paygate-title {
        font-size: 28px;
        font-weight: 700;
        color: #1a1a1a;
        margin: 0 0 16px 0;
        line-height: 1.2;
    }

    .paygate-subtitle {
        font-size: 15px;
        color: #666666;
        margin: 0 0 20px 0;
        line-height: 1.5;
    }

    .paygate-subtitle strong {
        color: #1a1a1a;
    }

    .paygate-description {
        font-size: 15px;
        color: #444444;
        margin: 0 0 24px 0;
        line-height: 1.6;
    }

    .paygate-price {
        font-size: 36px;
        font-weight: 700;
        color: #1a1a1a;
        margin: 0;
    }

    .paygate-price-note {
        font-size: 13px;
        color: #888888;
        margin: 4px 0 24px 0;
    }

    .paygate-btn {
        display: block;
        width: 100%;
        padding: 14px 24px;
        font-size: 14px;
        font-weight: 600;
        letter-spacing: 0.5px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .paygate-btn-primary {
        background-color: #5ba4d4;
        color: #ffffff;
    }

    .paygate-btn-primary:hover {
        background-color: #4a93c3;
    }

    .paygate-footer-text {
        font-size: 12px;
        color: #999999;
        margin: 16px 0 0 0;
        text-align: center;
    }

    /* Remove the inner turquoise border */
    .paygate-wrapper *,
    .paygate-content * {
        border: none !important;
        outline: none !important;
    }
    
    /* Keep button styling intact */
    .paygate-btn {
        border: none !important;
    }
`;
// const paygateStyles = `
//     .paygate-wrapper {
//         padding: 40px 32px;
//         height: 100%;
//         box-sizing: border-box;
//         display: flex;
//         align-items: center;
//         justify-content: center;
//     }

//     .paygate-content {
//         text-align: center;
//         max-width: 320px;
//         width: 100%;
//     }

//     .paygate-title {
//         font-size: 28px;
//         font-weight: 700;
//         color: #1a1a1a;
//         margin: 0 0 16px 0;
//         line-height: 1.2;
//     }

//     .paygate-subtitle {
//         font-size: 15px;
//         color: #666666;
//         margin: 0 0 20px 0;
//         line-height: 1.5;
//     }

//     .paygate-subtitle strong {
//         color: #1a1a1a;
//     }

//     .paygate-description {
//         font-size: 15px;
//         color: #444444;
//         margin: 0 0 24px 0;
//         line-height: 1.6;
//     }

//     .paygate-price {
//         font-size: 36px;
//         font-weight: 700;
//         color: #1a1a1a;
//         margin: 0;
//     }

//     .paygate-price-note {
//         font-size: 13px;
//         color: #888888;
//         margin: 4px 0 24px 0;
//     }

//     .paygate-btn {
//         display: block;
//         width: 100%;
//         padding: 14px 24px;
//         font-size: 14px;
//         font-weight: 600;
//         letter-spacing: 0.5px;
//         border: none;
//         border-radius: 6px;
//         cursor: pointer;
//         transition: all 0.2s ease;
//     }

//     .paygate-btn-primary {
//         background-color: #5ba4d4;
//         color: #ffffff;
//     }

//     .paygate-btn-primary:hover {
//         background-color: #4a93c3;
//     }

//     .paygate-footer-text {
//         font-size: 12px;
//         color: #999999;
//         margin: 16px 0 0 0;
//         text-align: center;
//     }

//     /* Remove the inner turquoise border */
//     .paygate-wrapper *,
//     .paygate-content * {
//         border: none !important;
//         outline: none !important;
//     }
    
//     /* Keep button styling intact */
//     .paygate-btn {
//         border: none !important;
//     }
// `;
// const paygateStyles = `
//     .paygate-wrapper {
//         padding: 24px;
//     }

//     .paygate-content {
//         text-align: left;
//     }

//     .paygate-title {
//         font-size: 28px;
//         font-weight: 700;
//         color: #1a1a1a;
//         margin: 0 0 16px 0;
//         line-height: 1.2;
//     }

//     .paygate-subtitle {
//         font-size: 15px;
//         color: #666666;
//         margin: 0 0 20px 0;
//         line-height: 1.5;
//     }

//     .paygate-subtitle strong {
//         color: #1a1a1a;
//     }

//     .paygate-description {
//         font-size: 15px;
//         color: #444444;
//         margin: 0 0 24px 0;
//         line-height: 1.6;
//         text-align: justify;
//     }

//     .paygate-price {
//         font-size: 36px;
//         font-weight: 700;
//         color: #1a1a1a;
//         margin: 0;
//     }

//     .paygate-price-note {
//         font-size: 13px;
//         color: #888888;
//         margin: 4px 0 24px 0;
//     }

//     .paygate-btn {
//         display: block;
//         width: 100%;
//         padding: 14px 24px;
//         font-size: 14px;
//         font-weight: 600;
//         letter-spacing: 0.5px;
//         border: none;
//         border-radius: 6px;
//         cursor: pointer;
//         transition: all 0.2s ease;
//     }

//     .paygate-btn-primary {
//         background-color: #5ba4d4;
//         color: #ffffff;
//     }

//     .paygate-btn-primary:hover {
//         background-color: #4a93c3;
//     }

//     .paygate-footer-text {
//         font-size: 12px;
//         color: #999999;
//         margin: 16px 0 0 0;
//         text-align: center;
//     }
// `;

// Inject styles if not already present
if (!document.getElementById('paygate-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'paygate-styles';
    styleElement.textContent = paygateStyles;
    document.head.appendChild(styleElement);
}

// Export for use in other modules
window.CipherAIWithPaygateComponent = CipherAIWithPaygateComponent;



// const CipherAIWithPaygateComponent = ({ 
//     companyName, 
//     brandName = null, 
//     politicalData = null, 
//     isLoading = false,
//     showPaygate = false,
//     isProUser = false,
//     onLogin = () => {},
//     onUpgrade = () => {}
// }) => {

//     const handleClick = (e) => {
//         e.preventDefault();
//         const url = `https://en.wikipedia.org/wiki/${encodeURIComponent(companyName)}`;
//         window.open(url, '_blank');
//     };

//     // Paygate content for Pro users (login prompt)
//     const renderProUserPaygate = () => {
//         return React.createElement('div', { className: 'paygate-content' },
//             React.createElement('div', { className: 'paygate-icon' }, '🔐'),
//             React.createElement('h3', null, 'Welcome Back!'),
//             React.createElement('p', null, 'Please log in to continue using ${APP_NAME} Pro'),
//             React.createElement('button', { 
//                 className: 'tilt-ai-login-btn',
//                 onClick: onLogin
//             }, 'Log In to Premium'),
//             React.createElement('div', { className: 'paygate-footer' },
//                 React.createElement('small', null, 'Already have an account? Just log in to resume access.')
//             )
//         );
//     };

//     // Paygate content for free users (upgrade prompt)
//     const renderFreeUserPaygate = () => {
//         return React.createElement('div', { className: 'paygate-content' },
//             React.createElement('h3', null, 'Upgrade to ${APP_NAME} Pro'),
//             React.createElement('p', null, 
//                 'You\'ve reached your daily limit of ',
//                 React.createElement('strong', null, '10 free'),
//                 ' company analyses.'
//             ),
//             React.createElement('div', { className: 'paygate-features' },
//                 React.createElement('div', { className: 'feature' }, '✓ Unlimited company analyses'),
//                 React.createElement('div', { className: 'feature' }, '✓ Detailed political contribution data'),
//                 React.createElement('div', { className: 'feature' }, '✓ Historical trend analysis'),
//                 React.createElement('div', { className: 'feature' }, '✓ Priority customer support')
//             ),
//             React.createElement('div', { className: 'paygate-pricing' },
//                 React.createElement('span', { className: 'price' }, '$4.99/month'),
//                 React.createElement('span', { className: 'price-note' }, 'Cancel anytime')
//             ),
//             React.createElement('button', { 
//                 className: 'tilt-ai-upgrade-btn',
//                 onClick: onUpgrade
//             }, 'Upgrade to Pro'),
//             React.createElement('div', { className: 'paygate-footer' },
//                 React.createElement('small', null, 'Limit resets tomorrow at midnight')
//             )
//         );
//     };

//     isProUser = true
//     // Render paygate modal
//     const renderPaygate = () => {
//         return React.createElement('div', { className: 'paygate-modal' },
//             renderProUserPaygate()
//             // isProUser ? renderProUserPaygate() : renderFreeUserPaygate()
//         );
//     };

//     // Render actual content
//     // const renderContent = () => {
//     //     return React.createElement('div', { className: 'tilt-ai-content' },
//     //         React.createElement('div', { className: 'overview-header' },
//     //             React.createElement('h2', null, 'Political Leaning Overview for '),
//     //             React.createElement('h2', null, title_overview_name)
//     //         ),
//     //         React.createElement('div', { className: 'lean-section' },
//     //             React.createElement('div', { className: 'lean-row' },
//     //                 React.createElement('span', { className: 'lean-label' }, 'Lean:'),
//     //                 React.createElement('span', { className: 'lean-value' }, data.lean),
//     //                 React.createElement('div', { className: 'rating-section' },
//     //                     React.createElement('span', { className: 'rating-label' }, 'Rating:'),
//     //                     React.createElement('span', { className: 'rating-score' }, data.score)
//     //                 )
//     //             )
//     //         ),
//     //         React.createElement('div', { className: 'description-section' },
//     //             React.createElement('p', { className: 'political-description' }, description_context)
//     //         ),
//     //         politicalData && politicalData.created_with_financial_contributions_info === true
//     //             ? React.createElement('div', { className: 'citations-section' },
//     //                 React.createElement('h4', { className: 'citations-header' }, 'Citations:'),
//     //                 React.createElement('a', {
//     //                     href: '#',
//     //                     className: 'citation-link',
//     //                     onClick: handleCitationClickFinancialContributionsOverview
//     //                 }, `Financial Contributions Data for ${companyName}`)
//     //             ) : null
//     //     );
//     // };

//     return React.createElement('div', 
//         { className: 'tilt-ai-container' },
//         React.createElement(window.TiltAIHeader),
//         renderPaygate()
//     );
// };

// // Styles for the paygate
// const paygateStyles = `
//     .paygate-modal {
//         display: flex;
//         justify-content: center;
//         align-items: center;
//         padding: 20px;
//     }

//     .paygate-content {
//         background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
//         border-radius: 16px;
//         padding: 32px;
//         text-align: center;
//         max-width: 400px;
//         width: 100%;
//         box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
//         border: 1px solid rgba(255, 255, 255, 0.1);
//     }

//     .paygate-icon {
//         font-size: 48px;
//         margin-bottom: 16px;
//     }

//     .paygate-content h3 {
//         color: #ffffff;
//         font-size: 24px;
//         margin: 0 0 12px 0;
//         font-weight: 600;
//     }

//     .paygate-content p {
//         color: #a0a0a0;
//         font-size: 14px;
//         margin: 0 0 24px 0;
//         line-height: 1.5;
//     }

//     .paygate-content p strong {
//         color: #ffffff;
//     }

//     .paygate-features {
//         text-align: left;
//         margin-bottom: 24px;
//         padding: 16px;
//         background: rgba(255, 255, 255, 0.05);
//         border-radius: 8px;
//     }

//     .paygate-features .feature {
//         color: #4ade80;
//         font-size: 14px;
//         padding: 8px 0;
//         border-bottom: 1px solid rgba(255, 255, 255, 0.05);
//     }

//     .paygate-features .feature:last-child {
//         border-bottom: none;
//     }

//     .paygate-pricing {
//         margin-bottom: 20px;
//     }

//     .paygate-pricing .price {
//         display: block;
//         font-size: 32px;
//         font-weight: 700;
//         color: #ffffff;
//         margin-bottom: 4px;
//     }

//     .paygate-pricing .price-note {
//         display: block;
//         font-size: 12px;
//         color: #888888;
//     }

//     .tilt-ai-login-btn,
//     .tilt-ai-upgrade-btn {
//         width: 100%;
//         padding: 14px 24px;
//         font-size: 16px;
//         font-weight: 600;
//         border: none;
//         border-radius: 8px;
//         cursor: pointer;
//         transition: all 0.2s ease;
//         margin-bottom: 16px;
//     }

//     .tilt-ai-login-btn {
//         background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
//         color: #ffffff;
//     }

//     .tilt-ai-login-btn:hover {
//         background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
//         transform: translateY(-2px);
//         box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
//     }

//     .tilt-ai-upgrade-btn {
//         background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
//         color: #ffffff;
//     }

//     .tilt-ai-upgrade-btn:hover {
//         background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
//         transform: translateY(-2px);
//         box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
//     }

//     .paygate-footer {
//         margin-top: 8px;
//     }

//     .paygate-footer small {
//         color: #666666;
//         font-size: 12px;
//     }
// `;

// // Inject styles if not already present
// if (!document.getElementById('paygate-styles')) {
//     const styleElement = document.createElement('style');
//     styleElement.id = 'paygate-styles';
//     styleElement.textContent = paygateStyles;
//     document.head.appendChild(styleElement);
// }

// // Export for use in other modules
// window.CipherAIWithPaygateComponent = CipherAIWithPaygateComponent;

// // const CipherAIWithPaygateComponent = ({ companyName, brandName = null, politicalData = null, isLoading = false }) => {
// //     const handleCitationClickFinancialContributionsOverview = (e) => {
// //         e.preventDefault();
// //         // Placeholder URL - replace with your actual endpoint later
// //         // Dev
// //         // const BASE_URL = 'http://localhost:5173'
// //         // Prod
// //         const BASE_URL = 'https://wintercoder1.github.io' 
// //         // Financial contributions overview URl.
// //         const url = `${BASE_URL}/Cool-Project-Frontend#/organization/financial-contributions/${encodeURIComponent(companyName)}`
// //         window.open(url, '_blank');
// //     };
// //     const handleCitationClickWikipedia = (e) => {
// //         e.preventDefault();
// //         // Placeholder URL - replace with your actual endpoint later
// //         const url = `https://en.wikipedia.org/wiki/${encodeURIComponent(companyName)}`;
// //         window.open(url, '_blank');
// //     };

// //     return React.createElement('div', 
// //         { className: 'tilt-ai-container' },
// //         React.createElement(window.TiltAIHeader),
// //         React.createElement('div', { className: 'tilt-ai-content' },
// //             React.createElement('div', { className: 'overview-header' },
// //                 // React.createElement('h2', null, 'Political Leaning Overview for '),
// //                 // React.createElement('span', { className: 'company-name-highlight' }, companyName)
// //                 React.createElement('h2', null, 'Political Leaning Overview for '),
// //                 // React.createElement('span', null, companyName)
// //                 React.createElement('h2', null, title_overview_name)
// //             ),
// //             React.createElement('div', { className: 'lean-section' },
// //                 React.createElement('div', { className: 'lean-row' },
// //                     React.createElement('span', { className: 'lean-label' }, 'Lean:'),
// //                     React.createElement('span', { className: 'lean-value' }, data.lean),
// //                     React.createElement('div', { className: 'rating-section' },
// //                         React.createElement('span', { className: 'rating-label' }, 'Rating:'),
// //                         React.createElement('span', { className: 'rating-score' }, data.score)
// //                     )
// //                 )
// //             ),
// //             React.createElement('div', { className: 'description-section' },
// //                 React.createElement('p', { className: 'political-description' }, description_context)
// //             ),
            
// //             // Conditionally render citation section.
// //             // For now only focuses on financial contributions.
// //             // TODO: Consider showing wikipedia citation but only when link to wikipedia is valid.    
// //             politicalData && politicalData.created_with_financial_contributions_info === true
// //                 ? React.createElement('div', { className: 'citations-section' },
// //                 React.createElement('h4', { className: 'citations-header' }, 'Citations:'),
// //                 React.createElement('a', {
// //                     href: '#',
// //                     className: 'citation-link',
// //                     onClick: handleCitationClickFinancialContributionsOverview
// //                 }, `Financial Contributions Data for ${companyName}`)
// //             ) : null,
// //         )
// //     );
// // };


// // // Export for use in other modules
// // window.CipherAIWithPaygateComponent = CipherAIWithPaygateComponent;
