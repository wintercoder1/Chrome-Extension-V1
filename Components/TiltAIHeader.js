// Components/TiltAIHeader.js

const TiltAIHeader = () => {
    // return React.createElement('div', { className: 'tilt-ai-header' },
    //     React.createElement('img', {
    //         src: chrome.runtime.getURL('icons/_tilt_ai_logox1.jpeg'),
    //         alt: 'Tilt AI Icon',
    //         className: 'tilt-ai-icon'
    //     }),
    //     React.createElement('div', { className: 'tilt-ai-brand' }, 'Tilt AI')
    // );
    return React.createElement('div', { className: 'tilt-ai-header' },
        React.createElement('img', {
            src: chrome.runtime.getURL('icons/cipher_logo@128.png'),
            alt: `${APP_NAME} Icon`,
            className: 'tilt-ai-icon'
        }),
        React.createElement('div', { className: 'tilt-ai-brand' }, APP_NAME)
    );
};

// Export for use in other components
window.TiltAIHeader = TiltAIHeader;