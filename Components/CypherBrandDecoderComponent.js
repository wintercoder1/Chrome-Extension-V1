// Original JSX version.

// const CypherBrandDecoderComponent = ({ icon, message }) => {
//     return (
//         <div className="brand-owner-content">
//         <span className="brand-owner-icon">{icon}</span>
//         <span className="brand-owner-text">{message}</span>
//         </div>
//     );
// };

// More stateful implementation
// // Update your component to handle state
// const CypherBrandDecoderComponent = ({ icon, message, isLoading }) => {
//     const className = `brand-owner-content${isLoading ? ' loading' : ''}`;
    
//     return React.createElement('div', 
//         { className },
//         React.createElement('span', { className: 'brand-owner-icon' }, icon),
//         React.createElement('span', { className: 'brand-owner-text' }, message)
//     );
// };

const CypherBrandDecoderComponent = ({ icon, message }) => {
    return React.createElement('div', 
        { className: 'brand-owner-content' },
        React.createElement('span', { className: 'brand-owner-icon' }, icon),
        React.createElement('span', { className: 'brand-owner-text' }, message)
    );
};

// Export for use in other modules
window.CypherDisplayElement = CypherBrandDecoderComponent;
