
class  DisplayElementManager {
    
    constructor(layoutMode) {
        // Initialize any parser-specific configuration
        this.displayElement = null;
        this.layoutMode = layoutMode;
        this.componentInsertionManager = new ComponentInsertionManager();
    }

    createMessageAndIcon(brandInfo, ownerInfo = null, isLoading = false) {
        let message = '';
        let icon = '🔍';
        
        if (isLoading) {
            if (brandInfo && brandInfo.type === 'book') {
                message = 'Loading publisher information...';
                icon = '📚';
            } else if (brandInfo && brandInfo.type === 'product_with_manufacturer') {
                message = 'Loading manufacturer information...';
                icon = '🔍';
            } else if (brandInfo === 'no-info-found') {
                message = 'Looking for brand or publisher information...';
                icon = '🔍';
            } else {
                message = 'Loading brand owning company...';
                icon = '⏳';
            }
        } else if (brandInfo === 'no-info-found') {
            message = 'No brand or publisher information found on this page';
            icon = '❓';
        } else if (brandInfo && brandInfo.type === 'book') {
            if (brandInfo.publisher) {
                message = `${brandInfo.title} is published by ${brandInfo.publisher}`;
            } else {
                message = `${brandInfo.title} - publisher information not found`;
            }
            icon = '📚';
        } else if (brandInfo && brandInfo.type === 'product_with_manufacturer' && brandInfo.manufacturer !== 'information...') {
            message = `The brand ${brandInfo.brand} is manufactured by ${brandInfo.manufacturer}`;
            icon = '🔍';
        } else if (ownerInfo && ownerInfo.owning_company_name && ownerInfo.owning_company_name !== brandInfo) {
            message = `The brand ${brandInfo} is owned by ${ownerInfo.owning_company_name}`;
        } else if (brandInfo) {
            message = `${brandInfo} is its own company`;
        } else {
            message = 'Unable to determine brand or publisher information';
            icon = '❓';
        }

        // return message, icon
        return {
            company: brandInfo,
            message: message,
            icon: icon,
        }
    }

    createDisplayElement(brandInfo, ownerInfo = null, isLoading = false) {
        // Fetch the message and icon for this combo of brand info, owner info and loading state.
        const {message, icon} = this.createMessageAndIcon(brandInfo, ownerInfo, isLoading)

        // Use only vanilla javascript element.
        const element = document.createElement('div');
        element.className = 'brand-owner-info';
        element.innerHTML = `
        <div class="brand-owner-content">
            <span class="brand-owner-icon">${icon}</span>
            <span class="brand-owner-text">${message}</span>
        </div>
        `;

        return element
    }

    createDisplayElementWithComponentCipher(brandInfo, ownerInfo = null, isLoading = false, category = 'Political Leaning') {
        // Extract company name from the brandInfo object
        let companyName = 'Loading...';
        
        if (!isLoading) {
            const {company, message, icon} = this.createMessageAndIcon(brandInfo, ownerInfo, isLoading);
            companyName = company; // Assuming createMessageAndIcon returns a string for company
        }

        // Create a wrapper DOM element
        const wrapperDiv = document.createElement('div');
        wrapperDiv.className = 'brand-owner-info-container';
        
        // Check if window.CipherAIComponent exists
        console.log('window.CipherAIComponent:', window.CipherAIComponent);
        
        if (!window.CipherAIComponent) {
            console.error('CipherAIComponent is not loaded! Make sure CipherAIComponent.js is included in your manifest.');
            wrapperDiv.innerHTML = '<div>Error: CipherAIComponent not loaded</div>';
            return wrapperDiv;
        }
        
        console.log('Creating component with companyName:', companyName); // Debug line
        
        // Create the React element
        const component = React.createElement(window.CipherAIComponent, {
            companyName: companyName,
            isLoading: isLoading,
            category: category
        });
        
        // Render the React component into the wrapper
        ReactDOM.render(component, wrapperDiv);
        console.log('React component rendered into wrapper:', wrapperDiv);
        console.log('Wrapper has children:', wrapperDiv.children.length);
        
        return wrapperDiv;
    }
    
    createDisplayElementWithPaygate(brandInfo, ownerInfo = null, isLoading = false, isProUser = false) {
        // Extract company name from the brandInfo object
        let companyName = 'Loading...';
        
        if (!isLoading && brandInfo) {
            const {company} = this.createMessageAndIcon(brandInfo, ownerInfo, isLoading);
            companyName = company;
        }

        // Create a wrapper DOM element
        const wrapperDiv = document.createElement('div');
        wrapperDiv.className = 'brand-owner-info-container';
        
        // Check if component exists
        if (!window.CipherAIWithPaygateComponent) {
            console.error('CipherAIWithPaygateComponent is not loaded!');
            wrapperDiv.innerHTML = '<div>Error: CipherAIWithPaygateComponent not loaded</div>';
            return wrapperDiv;
        }
        
        console.log('Creating paygate component for:', companyName, 'isProUser:', isProUser);
        
        // Create the React element with paygate enabled
        const component = React.createElement(window.CipherAIWithPaygateComponent, { 
            companyName: companyName,
            isLoading: isLoading,
            showPaygate: true,  // Always show paygate when using this method
            isProUser: isProUser
        });
        
        // Render the React component into the wrapper
        ReactDOM.render(component, wrapperDiv);
        
        return wrapperDiv;
    }

    async updateDisplayElementCipher(productPageInfo, ownerInfo, politicalData = null) {
        if (!this.displayElement) {
            console.log('Tried to update display element, but could not find a display element to update.')
            return;
        }

        const companyName= productPageInfo.manufacturer;
        const brandName = productPageInfo.brand;
        // console.log(`|| updateDisplayElementCipher: passed in company name: ${companyName}`);
        // console.log(`|| updateDisplayElementCipher: passed in brand name: ${brandName}`);    
 
        // If no political data provided and we have a valid company name, fetch it
        if (!politicalData && companyName && companyName !== 'Unknown Company' && companyName !== 'no-info-found') {
            console.log('No political data provided, fetching from API for:', companyName);
            try {
                politicalData = await this.networkManager.fetchPoliticalLeaning(companyName);
                console.log('Fetched political data:', politicalData);
            } catch (error) {
                console.error('Error fetching political data in updateDisplayElementCipher:', error);
                politicalData = null;
            }
        }

        // Re-render the React component with new props
        // console.log(`|| Now with political data ${politicalData}`)
        // console.log(politicalData)
        // const created_with_financial_contributions = (politicalData && politicalData.created_with_financial_contributions_info) ? politicalData.created_with_financial_contributions_info : false
        // console.log(`|| Now with created_with_financial_contributions_info ${created_with_financial_contributions}`)
        const component = React.createElement(window.CipherAIComponent, { 
            companyName: companyName,
            brandName: brandName,
            politicalData: politicalData, // Pass the political data from API
            isLoading: false // No longer loading
        });
        
        ReactDOM.render(component, this.displayElement);
        
        // Remove loading class from the wrapper div
        this.displayElement.classList.remove('loading');
    }

    // Insert the component into the correct part of the Amazon product page.
    // This is one of the most important methods.
    insertDisplayElement(element) {
        console.log('Inserting element with layout mode:', this.layoutMode);
        console.log('🚀 DEBUG: insertDisplayElement called');
        console.log('🔍 DEBUG: Element to insert:', element);
        console.log('🔍 DEBUG: Layout mode:', this.layoutMode);
        
        if (this.layoutMode === 'product-details') {
            // Try the original methods first
            if (this.componentInsertionManager.insertUnderPrice(element)) {
                console.log('Successfully inserted under price');
                this.__setDisplayElement(element);
                return;
            }
            else if (this.componentInsertionManager.insertInProductDetailsArea(element)) {
                console.log('Successfully inserted in product details area');
                this.__setDisplayElement(element);
                return;
            } 
            else if (this.insertElementRobustFallback(element)) {
                // If both original methods fail, use the robust fallback
                console.log('Original insertion methods failed, trying robust fallback...');
                this.__setDisplayElement(element);
                return;
            }
            
        } else {
            if (this.componentInsertionManager.insertInBuyBox(element)) {
                this.__setDisplayElement(element);
                return;
            }
        }

        
        // Final desperate fallback
        console.error('ALL insertion methods failed, appending to body');
        document.body.appendChild(element);
        this.__setDisplayElement(element);
    }

    __setDisplayElement(element) {
        this.displayElement = element;
        console.log('Element set as displayElement:', this.displayElement);
        console.log('Element is in DOM:', document.contains(element));
    }


    /*
    * Methods for creating the component directly in its own overlay.
    */
    async createOverlayWithComponent(companyName, brandInfo) {
        console.log('🎨 OVERLAY DEBUG: Creating overlay for company:', companyName);
        
        // Create overlay container
        const overlay = document.createElement('div');
        overlay.className = 'tilt-ai-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
            z-index: 999999;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: fadeIn 0.3s ease-out;
        `;
        
        // Create content container
        const content = document.createElement('div');
        content.className = 'tilt-ai-overlay-content';
        content.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 0;
            min-width: 600px;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            position: relative;
            animation: slideIn 0.3s ease-out;
            border: 2px solid #007185;
        `;
        
        // Create close button
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '✕';
        closeButton.style.cssText = `
            position: absolute;
            top: 15px;
            right: 15px;
            background: #000000;
            color: white;
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            z-index: 1000000;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        `;
        
        closeButton.addEventListener('mouseenter', () => {
            closeButton.style.background = '#333333';
            closeButton.style.transform = 'scale(1.1)';
        });
        
        closeButton.addEventListener('mouseleave', () => {
            closeButton.style.background = '#000000';
            closeButton.style.transform = 'scale(1)';
        });
        
        closeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeOverlay();
        });
        
        // Create component container
        const componentContainer = document.createElement('div');
        componentContainer.className = 'tilt-ai-overlay-component';
        componentContainer.style.cssText = `
            padding: 20px;
            min-height: 200px;
            width: 100%;
            min-width: 580px;
            max-width: 600px;
        `;
        
        // CRITICAL FIX: Create a proper React root container
        const reactContainer = document.createElement('div');
        reactContainer.id = 'tilt-ai-react-container';
        componentContainer.appendChild(reactContainer);
        
        // Add loading state initially - RENDER REACT COMPONENT
        if (typeof ReactDOM !== 'undefined' && ReactDOM.render) {
            // Legacy ReactDOM.render (React < 18)
            ReactDOM.render(
                React.createElement(window.CipherAIComponent, {
                    companyName: companyName,
                    brandName: null,
                    politicalData: null,
                    isLoading: true
                }),
                reactContainer
            );
        } else if (typeof ReactDOM !== 'undefined' && ReactDOM.createRoot) {
            // Modern ReactDOM.createRoot (React 18+)
            const root = ReactDOM.createRoot(reactContainer);
            root.render(
                React.createElement(window.CipherAIComponent, {
                    companyName: companyName,
                    brandName: null,
                    politicalData: null,
                    isLoading: true
                })
            );
            // Store root for later updates
            reactContainer._reactRoot = root;
        } else {
            // Fallback to non-React rendering
            reactContainer.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <div style="font-size: 18px; font-weight: bold; color: #232f3e; margin-bottom: 10px;">
                        🔍 Tilt AI - Overlay Mode
                    </div>
                    <div style="color: #666; margin-bottom: 20px;">
                        Analyzing: ${companyName}
                    </div>
                    <div style="border: 3px solid #007185; border-top: 3px solid transparent; border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
                </div>
            `;
        }
        
        // Add CSS animation keyframes if not already added
        if (!document.querySelector('#tilt-ai-animations')) {
            const style = document.createElement('style');
            style.id = 'tilt-ai-animations';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideIn {
                    from { 
                        opacity: 0; 
                        transform: translateY(-50px) scale(0.9); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateY(0) scale(1); 
                    }
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Assemble overlay
        content.appendChild(closeButton);
        content.appendChild(componentContainer);
        overlay.appendChild(content);
        
        // Add to DOM
        document.body.appendChild(overlay);
        currentOverlay = overlay;
        
        // Close on background click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.closeOverlay();
            }
        });
        
        // Close on escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeOverlay();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
        
        // Now fetch and display the actual component data
        try {
            if (companyName && companyName !== 'Unknown Company' && companyName !== 'no-info-found') {
                console.log('🌐 OVERLAY DEBUG: Fetching political data for:', companyName);
                
                // Create network manager instance
                const networkManager = new NetworkManager();
                const politicalData = await networkManager.fetchPoliticalLeaning(companyName);
                
                console.log('✅ OVERLAY DEBUG: Political data received:', politicalData);
                
                // Extract brand name
                let brandName = null;
                if (brandInfo && brandInfo.brand && brandInfo.brand !== brandInfo.manufacturer) {
                    brandName = brandInfo.brand;
                }
                
                // CRITICAL FIX: Update React component with real data
                if (typeof ReactDOM !== 'undefined' && ReactDOM.render) {
                    // Legacy ReactDOM.render (React < 18)
                    ReactDOM.render(
                        React.createElement(window.CipherAIComponent, {
                            companyName: companyName,
                            brandName: brandName,
                            politicalData: politicalData,
                            isLoading: false
                        }),
                        reactContainer
                    );
                } else if (typeof ReactDOM !== 'undefined' && ReactDOM.createRoot) {
                    // Modern ReactDOM.createRoot (React 18+)
                    const root = reactContainer._reactRoot || ReactDOM.createRoot(reactContainer);
                    root.render(
                        React.createElement(window.CipherAIComponent, {
                            companyName: companyName,
                            brandName: brandName,
                            politicalData: politicalData,
                            isLoading: false
                        })
                    );
                } else {
                    // Fallback rendering
                    reactContainer.innerHTML = `
                        <div style="padding: 20px;">
                            <h3>${brandName || companyName}</h3>
                            <p>Political Lean: ${politicalData?.lean || 'Unknown'}</p>
                            <p>Score: ${politicalData?.score || 'N/A'}</p>
                            <p>${politicalData?.description || 'No description available'}</p>
                        </div>
                    `;
                }
                
            } else {
                // Show error state using React component
                if (typeof ReactDOM !== 'undefined') {
                    const renderMethod = ReactDOM.render || (reactContainer._reactRoot && reactContainer._reactRoot.render);
                    if (renderMethod) {
                        if (ReactDOM.render) {
                            ReactDOM.render(
                                React.createElement('div', {
                                    style: { textAlign: 'center', padding: '40px' }
                                },
                                    React.createElement('div', {
                                        style: { fontSize: '18px', fontWeight: 'bold', color: '#ff4757', marginBottom: '10px' }
                                    }, '⚠️ No Company Data Found'),
                                    React.createElement('div', {
                                        style: { color: '#666', marginBottom: '20px' }
                                    }, 'Could not extract company information from this page.'),
                                    React.createElement('div', {
                                        style: { fontSize: '12px', color: '#999' }
                                    }, `URL: ${window.location.hostname}`)
                                ),
                                reactContainer
                            );
                        } else if (reactContainer._reactRoot) {
                            reactContainer._reactRoot.render(
                                React.createElement('div', {
                                    style: { textAlign: 'center', padding: '40px' }
                                },
                                    React.createElement('div', {
                                        style: { fontSize: '18px', fontWeight: 'bold', color: '#ff4757', marginBottom: '10px' }
                                    }, '⚠️ No Company Data Found'),
                                    React.createElement('div', {
                                        style: { color: '#666', marginBottom: '20px' }
                                    }, 'Could not extract company information from this page.'),
                                    React.createElement('div', {
                                        style: { fontSize: '12px', color: '#999' }
                                    }, `URL: ${window.location.hostname}`)
                                )
                            );
                        }
                    }
                } else {
                    // Fallback for no React
                    reactContainer.innerHTML = `
                        <div style="text-align: center; padding: 40px;">
                            <div style="font-size: 18px; font-weight: bold; color: #ff4757; margin-bottom: 10px;">
                                ⚠️ No Company Data Found
                            </div>
                            <div style="color: #666; margin-bottom: 20px;">
                                Could not extract company information from this page.
                            </div>
                            <div style="font-size: 12px; color: #999;">
                                URL: ${window.location.hostname}
                            </div>
                        </div>
                    `;
                }
            }
            
        } catch (error) {
            console.error('💥 OVERLAY DEBUG: Error loading component data:', error);
            
            // Show error in overlay using React
            if (typeof ReactDOM !== 'undefined') {
                const errorElement = React.createElement('div', {
                    style: { textAlign: 'center', padding: '40px' }
                },
                    React.createElement('div', {
                        style: { fontSize: '18px', fontWeight: 'bold', color: '#ff4757', marginBottom: '10px' }
                    }, '❌ Error Loading Data'),
                    React.createElement('div', {
                        style: { color: '#666', marginBottom: '20px' }
                    }, error.message),
                    React.createElement('div', {
                        style: { fontSize: '12px', color: '#999' }
                    }, `Company: ${companyName}`)
                );
                
                if (ReactDOM.render) {
                    ReactDOM.render(errorElement, reactContainer);
                } else if (reactContainer._reactRoot) {
                    reactContainer._reactRoot.render(errorElement);
                }
            } else {
                // Fallback error display
                reactContainer.innerHTML = `
                    <div style="text-align: center; padding: 40px;">
                        <div style="font-size: 18px; font-weight: bold; color: #ff4757; margin-bottom: 10px;">
                            ❌ Error Loading Data
                        </div>
                        <div style="color: #666; margin-bottom: 20px;">
                            ${error.message}
                        </div>
                        <div style="font-size: 12px; color: #999;">
                            Company: ${companyName}
                        </div>
                    </div>
                `;
            }
        }
    }

    closeOverlay() {
        if (currentOverlay) {
            currentOverlay.style.animation = 'fadeOut 0.3s ease-out forwards';
            
            // Add fadeOut animation
            if (!document.querySelector('#tilt-ai-fadeout')) {
                const style = document.createElement('style');
                style.id = 'tilt-ai-fadeout';
                style.textContent = `
                    @keyframes fadeOut {
                        from { opacity: 1; }
                        to { opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }
            
            setTimeout(() => {
                if (currentOverlay) {
                    currentOverlay.remove();
                    currentOverlay = null;
                }
            }, 300);
        }
    }
 
    async lastResortComponentInsertion() {
        console.log('🆘 GLOBAL DEBUG: Attempting last resort component insertion');
        
        // Create a simple test component
        const testComponent = document.createElement('div');
        testComponent.className = 'tilt-ai-container last-resort-insertion';
        testComponent.style.cssText = `
            border: 3px solid red;
            background: #ffe6e6;
            padding: 15px;
            margin: 10px;
            border-radius: 8px;
            font-family: Arial, sans-serif;
        `;
        testComponent.innerHTML = `
            <div style="font-weight: bold; color: #d63384; margin-bottom: 8px;">
                🔧 Tilt AI - Manual Refresh Test
            </div>
            <div style="font-size: 12px; color: #666;">
                Component inserted via manual refresh fallback method.
                <br>URL: ${window.location.hostname}
                <br>Time: ${new Date().toLocaleTimeString()}
            </div>
        `;
        
        // Try multiple insertion strategies
        const insertionStrategies = [
            // Strategy 1: After title
            () => {
                const title = document.querySelector('#productTitle, .product-title, h1');
                if (title) {
                    title.parentNode.insertBefore(testComponent, title.nextSibling);
                    return true;
                }
                return false;
            },
            
            // Strategy 2: In centerCol
            () => {
                const centerCol = document.querySelector('#centerCol');
                if (centerCol && centerCol.firstChild) {
                    centerCol.insertBefore(testComponent, centerCol.firstChild);
                    return true;
                }
                return false;
            },
            
            // Strategy 3: After any price element
            () => {
                const priceElements = document.querySelectorAll('[id*="price"], [id*="Price"]');
                if (priceElements.length > 0) {
                    const lastPrice = priceElements[priceElements.length - 1];
                    lastPrice.parentNode.insertBefore(testComponent, lastPrice.nextSibling);
                    return true;
                }
                return false;
            },
            
            // Strategy 4: Body with fixed positioning
            () => {
                testComponent.style.position = 'fixed';
                testComponent.style.top = '100px';
                testComponent.style.right = '10px';
                testComponent.style.zIndex = '9999';
                testComponent.style.maxWidth = '250px';
                document.body.appendChild(testComponent);
                return true;
            }
        ];
        
        for (const [index, strategy] of insertionStrategies.entries()) {
            try {
                console.log(`🆘 GLOBAL DEBUG: Trying insertion strategy ${index + 1}`);
                if (strategy()) {
                    console.log(`✅ GLOBAL DEBUG: Strategy ${index + 1} succeeded`);
                    return;
                }
            } catch (strategyError) {
                console.error(`💥 GLOBAL DEBUG: Strategy ${index + 1} failed:`, strategyError);
            }
        }
        
        throw new Error('All last resort insertion strategies failed');
    }

    // Add this method to the DisplayElementManager class.
    // updateDisplayElementWithPayGateCipher() {
    //     if (!this.displayElement) {
    //         console.log('Tried to update display element with paygate, but could not find a display element to update.');
    //         return;
    //     }

    //     console.log('🚧 PAYGATE: Updating component to paygate state');

    //     // Check if user is already a pro user (you'll need to implement this storage check)
    //     const isProUser = this.checkProUserStatus();
        
    //     // Create the paygate overlay content
    //     const paygateOverlay = document.createElement('div');
    //     paygateOverlay.className = 'tilt-ai-paygate-overlay';
        
    //     // Create the blurred background content (showing sample company info)
    //     const blurredContent = document.createElement('div');
    //     blurredContent.className = 'tilt-ai-blurred-content';
    //     blurredContent.innerHTML = `
    //         <div class="tilt-ai-header">
    //             <span class="brand-owner-icon">🔍</span>
    //             <span class="brand-owner-text">Apple Inc. - Political Analysis</span>
    //         </div>
    //         <div class="tilt-ai-sample-content">
    //             <div class="political-lean">Political Lean: Slightly Liberal</div>
    //             <div class="contribution-info">Political Contributions: $2.3M (2020-2024)</div>
    //             <div class="score">Tilt Score: 6.2/10</div>
    //         </div>
    //     `;

    //     // Create the paygate modal
    //     const paygateModal = document.createElement('div');
    //     paygateModal.className = 'tilt-ai-paygate-modal';
        
    //     if (isProUser) {
    //         // Show login prompt for existing pro users
    //         paygateModal.innerHTML = `
    //             <div class="paygate-content">
    //                 <div class="paygate-icon">🔐</div>
    //                 <h3>Welcome Back!</h3>
    //                 <p>Please log in to continue using Tilt AI Premium</p>
    //                 <button class="tilt-ai-login-btn" onclick="this.handleLogin()">
    //                     Log In to Premium
    //                 </button>
    //                 <div class="paygate-footer">
    //                     <small>Already have an account? Just log in to resume access.</small>
    //                 </div>
    //             </div>
    //         `;
    //     } else {
    //         // Show upgrade prompt for free users
    //         paygateModal.innerHTML = `
    //             <div class="paygate-content">
    //                 <div class="paygate-icon">⭐</div>
    //                 <h3>Upgrade to Tilt AI Pro</h3>
    //                 <p>You've reached your daily limit of <strong>10 free</strong> company analyses.</p>
    //                 <div class="paygate-features">
    //                     <div class="feature">✓ Unlimited company analyses</div>
    //                     <div class="feature">✓ Detailed political contribution data</div>
    //                     <div class="feature">✓ Historical trend analysis</div>
    //                     <div class="feature">✓ Priority customer support</div>
    //                 </div>
    //                 <div class="paygate-pricing">
    //                     <span class="price">$4.99/month</span>
    //                     <span class="price-note">Cancel anytime</span>
    //                 </div>
    //                 <button class="tilt-ai-upgrade-btn" onclick="this.handleUpgrade()">
    //                     Upgrade to Pro
    //                 </button>
    //                 <div class="paygate-footer">
    //                     <small>Limit resets tomorrow at midnight</small>
    //                 </div>
    //             </div>
    //         `;
    //     }

    //     // Assemble the paygate overlay
    //     paygateOverlay.appendChild(blurredContent);
    //     paygateOverlay.appendChild(paygateModal);

    //     // Clear the existing display element and add paygate
    //     this.displayElement.innerHTML = '';
    //     this.displayElement.appendChild(paygateOverlay);
        
    //     // Add paygate class to the main container
    //     this.displayElement.classList.add('paygate-active');
    //     this.displayElement.classList.remove('loading');

    //     console.log('🚧 PAYGATE: Paygate overlay created and inserted');
    // }
    // updateDisplayElementWithPayGateCipher() {
    //     if (!this.displayElement) {
    //         console.log('Tried to update display element with paygate, but could not find a display element to update.');
    //         return;
    //     }

    //     console.log('🚧 PAYGATE: Updating component to paygate state');

    //     // Check if user is already a pro user
    //     const isProUser = this.checkProUserStatus();
        
    //     // Create the paygate component using React (same pattern as normal component)
    //     if (!window.CipherAIComponent) {
    //         console.error('CipherAIComponent is not loaded! Falling back to HTML paygate.');
    //         this.createHTMLPaygate(isProUser);
    //         return;
    //     }
        
    //     // Create React paygate component
    //     const paygateComponent = React.createElement(window.CipherAIComponent, {
    //         companyName: 'Rate Limit Reached',
    //         brandName: null,
    //         politicalData: null,
    //         isLoading: false,
    //         isPaygate: true,  // Special flag for paygate state
    //         isProUser: isProUser,
    //         onUpgrade: () => this.handleUpgrade(),
    //         onLogin: () => this.handleLogin()
    //     });
        
    //     // Render the React paygate component into the existing display element
    //     ReactDOM.render(paygateComponent, this.displayElement);
        
    //     // Add paygate class to the main container for any additional styling
    //     this.displayElement.classList.add('paygate-active');
    //     this.displayElement.classList.remove('loading');

    //     console.log('🚧 PAYGATE: React paygate component rendered in-place');
    // }
    updateDisplayElementWithPayGateCipher() {
        if (!this.displayElement) {
            console.log('Tried to update display element with paygate, but could not find a display element to update.');
            return;
        }

        console.log('🚧 PAYGATE: Updating component to paygate state');

        // Check if user is already a pro user
        const isProUser = this.checkProUserStatus();
        
        // Create the paygate overlay content (same visual design as first implementation)
        const paygateOverlay = document.createElement('div');
        paygateOverlay.className = 'tilt-ai-paygate-overlay';
        
        // Create the blurred background content (showing sample company info)
        const blurredContent = document.createElement('div');
        blurredContent.className = 'tilt-ai-blurred-content';
        blurredContent.innerHTML = `
            <div class="tilt-ai-header">
                <span class="brand-owner-icon">🔍</span>
                <span class="brand-owner-text">Apple Inc. - Political Analysis</span>
            </div>
            <div class="tilt-ai-sample-content">
                <div class="political-lean">Political Lean: Slightly Liberal</div>
                <div class="contribution-info">Political Contributions: $2.3M (2020-2024)</div>
                <div class="score">Tilt Score: 6.2/10</div>
            </div>
        `;

        // Create the paygate modal
        const paygateModal = document.createElement('div');
        paygateModal.className = 'tilt-ai-paygate-modal';
        
        if (isProUser) {
            // Show login prompt for existing pro users
            paygateModal.innerHTML = `
                <div class="paygate-content">
                    <div class="paygate-icon">🔐</div>
                    <h3>Welcome Back!</h3>
                    <p>Please log in to continue using Tilt AI Premium</p>
                    <button class="tilt-ai-login-btn" onclick="globalAmazonBrandTracker.displayElementManager.handleLogin()">
                        Log In to Premium
                    </button>
                    <div class="paygate-footer">
                        <small>Already have an account? Just log in to resume access.</small>
                    </div>
                </div>
            `;
        } else {
            // Show upgrade prompt for free users
            paygateModal.innerHTML = `
                <div class="paygate-content">
                    <div class="paygate-icon">⭐</div>
                    <h3>Upgrade to Tilt AI Pro</h3>
                    <p>You've reached your daily limit of <strong>10 free</strong> company analyses.</p>
                    <div class="paygate-features">
                        <div class="feature">✓ Unlimited company analyses</div>
                        <div class="feature">✓ Detailed political contribution data</div>
                        <div class="feature">✓ Historical trend analysis</div>
                        <div class="feature">✓ Priority customer support</div>
                    </div>
                    <div class="paygate-pricing">
                        <span class="price">$4.99/month</span>
                        <span class="price-note">Cancel anytime</span>
                    </div>
                    <button class="tilt-ai-upgrade-btn" onclick="globalAmazonBrandTracker.displayElementManager.handleUpgrade()">
                        Upgrade to Pro
                    </button>
                    <div class="paygate-footer">
                        <small>Limit resets tomorrow at midnight</small>
                    </div>
                </div>
            `;
        }

        // Assemble the paygate overlay (same as first implementation)
        paygateOverlay.appendChild(blurredContent);
        paygateOverlay.appendChild(paygateModal);

        // Clear the existing display element and add paygate (in-place insertion)
        this.displayElement.innerHTML = '';
        this.displayElement.appendChild(paygateOverlay);
        
        // Add paygate class to the main container
        this.displayElement.classList.add('paygate-active');
        this.displayElement.classList.remove('loading');

        console.log('🚧 PAYGATE: Paygate overlay created and inserted in-place');
    }

    // Helper method to check if user is a pro user
    checkProUserStatus() {
        try {
            // This should check your backend/storage for pro user status
            // For now, checking localStorage as a simple implementation
            const proStatus = localStorage.getItem('tilt_ai_pro_status');
            const hasProAccount = localStorage.getItem('tilt_ai_has_account');
            
            // Return true if user has previously purchased but needs to log in
            return proStatus === 'purchased' || hasProAccount === 'true';
        } catch (error) {
            console.error('Error checking pro user status:', error);
            return false;
        }
    }

    // Handle upgrade button click
    handleUpgrade() {
        console.log('🛒 PAYGATE: Upgrade button clicked');
        window.open('https://cipher-ai.io/payment/signup', '_blank');
        this.trackConversionAttempt('upgrade_clicked');
    }

    // Handle login button click
    handleLogin() {
        console.log('🔐 PAYGATE: Login button clicked');
        window.open('https://cipher-ai.io/payment/login', '_blank');
        this.trackConversionAttempt('login_clicked');
    }

    // Track conversion attempts for analytics
    trackConversionAttempt(action) {
        try {
            // You can integrate with Google Analytics, Mixpanel, etc.
            console.log(`📊 ANALYTICS: ${action} tracked`);
            
            // Example with Google Analytics (if you have it loaded)
            if (typeof gtag !== 'undefined') {
                gtag('event', action, {
                    event_category: 'paygate',
                    event_label: 'rate_limit_reached'
                });
            }
        } catch (error) {
            console.error('Error tracking conversion:', error);
        }
    }

    // Method to remove paygate and restore normal functionality (call after successful login/upgrade)
    removePaygateAndRestore() {
        console.log('✅ PAYGATE: Removing paygate, user has premium access');
        
        if (this.displayElement) {
            this.displayElement.classList.remove('paygate-active');
            this.displayElement.innerHTML = '';
            
            // Re-initialize the component with normal functionality
            // You might want to call your main component creation method here
            console.log('🔄 PAYGATE: Restoring normal component functionality');
        }
    }

    // Method to set pro user status after successful purchase/login
    setProUserStatus(isPro = true, hasAccount = true) {
        try {
            localStorage.setItem('tilt_ai_pro_status', isPro ? 'active' : 'free');
            localStorage.setItem('tilt_ai_has_account', hasAccount ? 'true' : 'false');
            
            if (isPro) {
                console.log('✅ PRO STATUS: User upgraded to pro, removing rate limits');
                this.removePaygateAndRestore();
            }
        } catch (error) {
            console.error('Error setting pro user status:', error);
        }
    }
}

// Export for use in other modules
window.DisplayElementManager = DisplayElementManager;
