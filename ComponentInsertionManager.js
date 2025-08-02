class ComponentInsertionManager {

  insertUnderPrice(element) {
        console.log('Attempting to insert element under price...');
        
        // Strategy 1: Target the apex_desktop structure specifically (layout 1)
        const apexDesktop = document.querySelector('#apex_desktop');
        if (apexDesktop) {
            console.log('Found apex_desktop container');
            
            // Create a wrapper with proper Amazon styling
            const wrapper = document.createElement('div');
            wrapper.className = 'a-section a-spacing-small';
            wrapper.appendChild(element);
            
            // Insert after the apex_desktop container
            if (apexDesktop.nextSibling) {
                apexDesktop.parentNode.insertBefore(wrapper, apexDesktop.nextSibling);
            } else {
                apexDesktop.parentNode.appendChild(wrapper);
            }
            
            console.log('Successfully inserted element after apex_desktop');
            return true;
        }
        
        // Strategy 1b: Target the desktop_unifiedPrice structure (layout 2)
        const unifiedPrice = document.querySelector('#desktop_unifiedPrice');
        if (unifiedPrice) {
            console.log('Found desktop_unifiedPrice container');
            
            // Create a wrapper with proper Amazon styling
            const wrapper = document.createElement('div');
            wrapper.className = 'a-section a-spacing-small';
            wrapper.appendChild(element);
            
            // Insert after the desktop_unifiedPrice container
            if (unifiedPrice.nextSibling) {
                unifiedPrice.parentNode.insertBefore(wrapper, unifiedPrice.nextSibling);
            } else {
                unifiedPrice.parentNode.appendChild(wrapper);
            }
            
            console.log('Successfully inserted element after desktop_unifiedPrice');
            return true;
        }
        
        // Strategy 1c: Target the buyingOptionNostosBolderBadge (specific to layout 2)
        const buyingBadge = document.querySelector('#buyingOptionNostosBolderBadge_feature_div');
        if (buyingBadge) {
            console.log('Found buyingOptionNostosBolderBadge container');
            
            // Create a wrapper with proper Amazon styling
            const wrapper = document.createElement('div');
            wrapper.className = 'a-section a-spacing-small';
            wrapper.appendChild(element);
            
            // Insert after the buying badge container
            if (buyingBadge.nextSibling) {
                buyingBadge.parentNode.insertBefore(wrapper, buyingBadge.nextSibling);
            } else {
                buyingBadge.parentNode.appendChild(wrapper);
            }
            
            console.log('Successfully inserted element after buyingOptionNostosBolderBadge');
            return true;
        }
        
        // Strategy 1d: Look for any feature div that contains price-related content
        const priceFeatureDivs = document.querySelectorAll('[id*="Price"], [id*="price"], [data-feature-name*="price"], [data-feature-name*="Price"]');
        for (const priceDiv of priceFeatureDivs) {
            if (priceDiv && priceDiv.id !== 'desktop_unifiedPrice') { // Skip the one we already tried
                console.log('Found price-related feature div:', priceDiv.id);
                
                const wrapper = document.createElement('div');
                wrapper.className = 'a-section a-spacing-small';
                wrapper.appendChild(element);
                
                if (priceDiv.nextSibling) {
                    priceDiv.parentNode.insertBefore(wrapper, priceDiv.nextSibling);
                } else {
                    priceDiv.parentNode.appendChild(wrapper);
                }
                
                console.log('Successfully inserted element after price feature div');
                return true;
            }
        }
        
        // Strategy 2: Look for the main price element and its container
        const priceSelectors = [
            '.a-price.a-text-price.a-size-medium.apexPriceToPay', // Main price class
            '.a-price-whole', // Price number part
            '.a-price.a-text-price', // General price class
            '[data-a-color="price"]', // Price with data attribute
            '.a-price.apexPriceToPay', // Apex price
            '.a-section.a-spacing-none.aok-align-center .a-price' // Price in spacing section
        ];
        
        let priceElement = null;
        for (const selector of priceSelectors) {
            priceElement = document.querySelector(selector);
            if (priceElement) {
                console.log('Found price element with selector:', selector);
                break;
            }
        }
        
        if (priceElement) {
            // Find the appropriate container to insert after
            let insertionContainer = priceElement;
            
            // Look for the price container section
            const priceContainer = priceElement.closest('.a-section, .a-spacing-none, .a-spacing-small, .a-spacing-base');
            if (priceContainer) {
                insertionContainer = priceContainer;
                console.log('Found price container:', priceContainer.className);
            }
            
            // Create a wrapper with proper Amazon styling
            const wrapper = document.createElement('div');
            wrapper.className = 'a-section a-spacing-small';
            wrapper.appendChild(element);
            
            // Insert after the price container
            if (insertionContainer.nextSibling) {
                insertionContainer.parentNode.insertBefore(wrapper, insertionContainer.nextSibling);
            } else {
                insertionContainer.parentNode.appendChild(wrapper);
            }
            
            console.log('Successfully inserted element under price');
            return true;
        }
        
        // Strategy 3: Look for SNAP EBT eligible text (common on grocery items)
        const snapElements = Array.from(document.querySelectorAll('*')).filter(el => 
            el.textContent && el.textContent.includes('SNAP EBT eligible')
        );
        
        if (snapElements.length > 0) {
            const snapElement = snapElements[0];
            console.log('Found SNAP EBT element, inserting after it');
            const snapContainer = snapElement.closest('.a-section, div');
            if (snapContainer) {
                const wrapper = document.createElement('div');
                wrapper.className = 'a-section a-spacing-small';
                wrapper.appendChild(element);
                
                if (snapContainer.nextSibling) {
                    snapContainer.parentNode.insertBefore(wrapper, snapContainer.nextSibling);
                } else {
                    snapContainer.parentNode.appendChild(wrapper);
                }
                console.log('Successfully inserted element after SNAP EBT section');
                return true;
            }
        }
        
        // Strategy 4: Look for the size/variant selection area
        const sizeElements = Array.from(document.querySelectorAll('*')).filter(el => 
            el.textContent && (el.textContent.includes('Size:') || el.textContent.includes('Pack of'))
        );
        
        if (sizeElements.length > 0) {
            const sizeElement = sizeElements[0];
            const sizeContainer = sizeElement.closest('.a-section, div');
            if (sizeContainer) {
                const wrapper = document.createElement('div');
                wrapper.className = 'a-section a-spacing-small';
                wrapper.appendChild(element);
                
                if (sizeContainer.nextSibling) {
                    sizeContainer.parentNode.insertBefore(wrapper, sizeContainer.nextSibling);
                } else {
                    sizeContainer.parentNode.appendChild(wrapper);
                }
                console.log('Successfully inserted element after size selection');
                return true;
            }
        }
        
        // Strategy 5: Look for accordion row elements (common in new Amazon layouts)
        const accordionSelectors = [
            '#apex_desktop_newAccordionRow',
            '[id*="AccordionRow"]',
            '[data-feature-name*="accordion"]'
        ];
        
        for (const selector of accordionSelectors) {
            const accordionElement = document.querySelector(selector);
            if (accordionElement) {
                console.log('Found accordion element with selector:', selector);
                const wrapper = document.createElement('div');
                wrapper.className = 'a-section a-spacing-small';
                wrapper.appendChild(element);
                
                if (accordionElement.nextSibling) {
                    accordionElement.parentNode.insertBefore(wrapper, accordionElement.nextSibling);
                } else {
                    accordionElement.parentNode.appendChild(wrapper);
                }
                console.log('Successfully inserted element after accordion');
                return true;
            }
        }
        
        console.log('Could not find suitable price-related insertion point');
        return false;
    }

    insertInProductDetailsArea(element) {
        const productDetailsSelectors = [
        '#feature-bullets',
        '#feature-bullets ul',
        '.a-unordered-list.a-vertical.a-spacing-mini',
        '#detailBullets_feature_div',
        '#productDetails_feature_div',
        '.a-section.a-spacing-medium.a-spacing-top-small',
        '#leftCol',
        '#centerCol .a-section:first-child',
        '.a-section.a-spacing-medium:first-child'
        ];
        
        let insertionPoint = null;
        for (const selector of productDetailsSelectors) {
            insertionPoint = document.querySelector(selector);
            if (insertionPoint) {
                console.log('Found product details area with selector:', selector);
                break;
            }
        }
        
        if (insertionPoint) {
        const wrapper = document.createElement('div');
        wrapper.className = 'a-section a-spacing-medium';
        wrapper.appendChild(element);
        
        if (insertionPoint.tagName === 'UL') {
            insertionPoint.parentNode.insertBefore(wrapper, insertionPoint);
        } else {
            insertionPoint.insertBefore(wrapper, insertionPoint.firstChild);
        }
            console.log('Inserted element into product details area');
        } else {
            console.log('Product details area not found, falling back to buy box');
            this.insertInBuyBox(element);
        }
    }

    /** Insert under the Buy box. This will put it in the rightmost  column. */
    insertInBuyBox(element) {
        console.log('Attempting to insert in buy box...');
        
        // Strategy 1: Try to insert after the Prime upsell container if it exists
        const primeContainer = document.querySelector('#primeDPUpsellStaticContainer');
        if (primeContainer) {
            console.log('Found Prime upsell container, inserting after it');
            
            const wrapper = document.createElement('div');
            wrapper.className = 'a-section a-spacing-small';
            wrapper.appendChild(element);
            
            if (primeContainer.nextSibling) {
                primeContainer.parentNode.insertBefore(wrapper, primeContainer.nextSibling);
            } else {
                primeContainer.parentNode.appendChild(wrapper);
            }
            
            console.log('Successfully inserted element after Prime container');
            return;
        }
        
        // Strategy 2: Look for the desktop_buybox specifically
        const desktopBuybox = document.querySelector('#desktop_buybox');
        if (desktopBuybox) {
            console.log('Found desktop_buybox container');
            
            // Try to find a good insertion point within the buybox
            const buyboxSections = desktopBuybox.querySelectorAll('.a-section, [data-feature-name], [id*="_feature_div"]');
            
            // Look for a section after Prime content but before the end
            for (const section of buyboxSections) {
                if (section.id && (section.id.includes('prime') || section.id.includes('Prime'))) {
                    // Found a Prime-related section, insert after it
                    const wrapper = document.createElement('div');
                    wrapper.className = 'a-section a-spacing-small';
                    wrapper.appendChild(element);
                    
                    if (section.nextSibling) {
                        section.parentNode.insertBefore(wrapper, section.nextSibling);
                    } else {
                        section.parentNode.appendChild(wrapper);
                    }
                    
                    console.log('Inserted element after Prime section in buybox');
                    return;
                }
            }
            
            // If no Prime section found, just append to buybox
            const wrapper = document.createElement('div');
            wrapper.className = 'a-section a-spacing-small';
            wrapper.appendChild(element);
            desktopBuybox.appendChild(wrapper);
            
            console.log('Inserted element at end of desktop_buybox');
            return;
        }
        
        // Strategy 3: Original buy box selectors
        const buyBoxSelectors = [
            '#buybox',
            '#rightCol',
            '.buybox-container',
            '#apex_desktop_newAccordionRow',
            '[cel_widget_id="dpx-buybox-container"]',
            '[data-feature-name="buybox"]',
            '.a-box.a-spacing-none'
        ];
        
        let buyBox = null;
        for (const selector of buyBoxSelectors) {
            buyBox = document.querySelector(selector);
            if (buyBox) {
                console.log('Found buy box with selector:', selector);
                break;
            }
        }
        
        if (buyBox) {
            // Check if there's a Prime container inside this buybox
            const primeInBuybox = buyBox.querySelector('#primeDPUpsellStaticContainer, [id*="prime"], [id*="Prime"]');
            if (primeInBuybox) {
                console.log('Found Prime content in buybox, inserting after it');
                const wrapper = document.createElement('div');
                wrapper.className = 'a-section a-spacing-small';
                wrapper.appendChild(element);
                
                if (primeInBuybox.nextSibling) {
                    primeInBuybox.parentNode.insertBefore(wrapper, primeInBuybox.nextSibling);
                } else {
                    primeInBuybox.parentNode.appendChild(wrapper);
                }
                
                console.log('Inserted element after Prime content in buybox');
                return;
            }
            
            // Original logic if no Prime content
            const firstChild = buyBox.firstElementChild;
            if (firstChild) {
                buyBox.insertBefore(element, firstChild);
            } else {
                buyBox.appendChild(element);
            }
            console.log('Inserted element into buy box (original logic)');
        } else {
            // Fallback logic
            const titleElement = document.querySelector('#productTitle, .product-title, h1');
            if (titleElement) {
                titleElement.parentNode.insertBefore(element, titleElement.nextSibling);
                console.log('Inserted element after title');
            } else {
                document.body.appendChild(element);
                console.log('Inserted element into body as fallback');
            }
        }
    }


    insertElementRobustFallback(element) {
      console.log('Using robust fallback insertion method...');
      
      // Strategy 1: Target the centerCol directly and find the best insertion point
      const centerCol = document.querySelector('#centerCol');
      if (centerCol) {
          console.log('Found centerCol, looking for insertion points...');
          
          // Try to find pricing-related containers first
          const pricingContainers = [
              '#corePriceDisplay_desktop_feature_div',
              '#apex_desktop',
              '#desktop_unifiedPrice',
              '[data-feature-name="corePriceDisplay_desktop"]',
              '[data-feature-name="apex_desktop"]',
              '[data-feature-name="desktop_unifiedPrice"]'
          ];
          
          for (const selector of pricingContainers) {
              const container = centerCol.querySelector(selector);
              if (container) {
                  console.log('Found pricing container:', selector);
                  
                  // Create wrapper with Amazon styling
                  const wrapper = document.createElement('div');
                  wrapper.className = 'a-section a-spacing-small';
                  wrapper.appendChild(element);
                  
                  // Insert after the pricing container
                  if (container.nextSibling) {
                      container.parentNode.insertBefore(wrapper, container.nextSibling);
                  } else {
                      container.parentNode.appendChild(wrapper);
                  }
                  
                  console.log('Successfully inserted element after pricing container');
                  return true;
              }
          }
        
          // Strategy 2: Look for any element with "price" in its ID or data attributes
          const priceElements = centerCol.querySelectorAll('[id*="price"], [id*="Price"], [data-feature-name*="price"], [data-feature-name*="Price"]');
          if (priceElements.length > 0) {
              // Find the last price-related element (likely to be the main price display)
              const lastPriceElement = priceElements[priceElements.length - 1];
              console.log('Found price element:', lastPriceElement.id || lastPriceElement.getAttribute('data-feature-name'));
              
              const wrapper = document.createElement('div');
              wrapper.className = 'a-section a-spacing-small';
              wrapper.appendChild(element);
              
              // Find the appropriate container (go up to find a feature div)
              let insertionPoint = lastPriceElement;
              while (insertionPoint && !insertionPoint.className.includes('celwidget') && !insertionPoint.id.includes('_feature_div')) {
                  insertionPoint = insertionPoint.parentElement;
                  if (insertionPoint === centerCol) break; // Don't go above centerCol
              }
              
              if (insertionPoint && insertionPoint !== centerCol) {
                  if (insertionPoint.nextSibling) {
                      insertionPoint.parentNode.insertBefore(wrapper, insertionPoint.nextSibling);
                  } else {
                      insertionPoint.parentNode.appendChild(wrapper);
                  }
                  console.log('Successfully inserted element after price feature div');
                  return true;
              }
          }
        
          // Strategy 3: Look for title block and insert after it
          const titleBlock = centerCol.querySelector('#titleBlock, #title_feature_div, [data-feature-name="title"]');
          if (titleBlock) {
              console.log('Found title block, inserting after it');
              
              const wrapper = document.createElement('div');
              wrapper.className = 'a-section a-spacing-medium';
              wrapper.appendChild(element);
              
              if (titleBlock.nextSibling) {
                  titleBlock.parentNode.insertBefore(wrapper, titleBlock.nextSibling);
              } else {
                  titleBlock.parentNode.appendChild(wrapper);
              }
              
              console.log('Successfully inserted element after title block');
              return true;
          }
        
          // Strategy 4: Look for bylineInfo (Visit the X Store)
          const bylineInfo = centerCol.querySelector('#bylineInfo_feature_div, [data-feature-name="bylineInfo"]');
          if (bylineInfo) {
              console.log('Found byline info, inserting after it');
              
              const wrapper = document.createElement('div');
              wrapper.className = 'a-section a-spacing-small';
              wrapper.appendChild(element);
              
              if (bylineInfo.nextSibling) {
                  bylineInfo.parentNode.insertBefore(wrapper, bylineInfo.nextSibling);
              } else {
                  bylineInfo.parentNode.appendChild(wrapper);
              }
              
              console.log('Successfully inserted element after byline info');
              return true;
          }
        
          // Strategy 5: Look for any major feature div and insert before it
          const majorFeatures = centerCol.querySelectorAll('[data-feature-name]:not([data-feature-name="title"]):not([data-feature-name="bylineInfo"])');
          if (majorFeatures.length > 0) {
              const firstMajorFeature = majorFeatures[0];
              console.log('Found major feature, inserting before it:', firstMajorFeature.getAttribute('data-feature-name'));
              
              const wrapper = document.createElement('div');
              wrapper.className = 'a-section a-spacing-small';
              wrapper.appendChild(element);
              
              firstMajorFeature.parentNode.insertBefore(wrapper, firstMajorFeature);
              
              console.log('Successfully inserted element before major feature');
              return true;
          }
        
          // Strategy 6: If all else fails, insert at the beginning of centerCol
          console.log('All strategies failed, inserting at beginning of centerCol');
          const wrapper = document.createElement('div');
          wrapper.className = 'a-section a-spacing-medium';
          wrapper.appendChild(element);
          
          if (centerCol.firstChild) {
              centerCol.insertBefore(wrapper, centerCol.firstChild);
          } else {
              centerCol.appendChild(wrapper);
          }
          
          console.log('Successfully inserted element at beginning of centerCol');
          return true;
      }
    
      // Strategy 7: Ultimate fallback - look for product title anywhere on page
      const productTitle = document.querySelector('#productTitle, .product-title, h1');
      if (productTitle) {
          console.log('Found product title as ultimate fallback');
          
          const wrapper = document.createElement('div');
          wrapper.className = 'a-section a-spacing-medium';
          wrapper.appendChild(element);
          
          if (productTitle.nextSibling) {
              productTitle.parentNode.insertBefore(wrapper, productTitle.nextSibling);
          } else {
              productTitle.parentNode.appendChild(wrapper);
          }
          
          console.log('Successfully inserted element after product title');
          return true;
      }
      
      console.error('All insertion strategies failed - unable to find suitable insertion point');
      return false;
  }
 
}