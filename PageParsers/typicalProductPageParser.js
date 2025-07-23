// // Page Parser for the typical generic Amazon Product Page.

// TODO: Clean this up and remove duplicated or unused code. 
//       There will be exmaples of both tbh. AI vibe coding lol.
// TODO Consider making the manfucturer and brand info extracter its own module and 
//      put the code to insert in a part of the web=bpage into its own module. 

class TypicalProductPageParser {
  constructor() {
    // Initialize any parser-specific configuration
    this.bookParser = new BookPageParser()
  }

  /**
   * Main method to extract brand or book information from the page
   * @returns {Object|string|null} - Brand info object, brand name string, or null
   */
  extractBrandInfo() {
    console.log('PageParser: Starting brand/book info extraction...');
    
    // First check if this is a book page
    // const bookInfo = this.bookParser.extractBookInfo();
    // if (bookInfo) {
    //   return bookInfo;
    // }

    // Try to find brand information for non-book products
    const brand = this.findBrandWithContains();
    if (brand) return brand.trim();

    // Try alternative selectors
    const brandSelectors = [
      '[data-feature-name="brand"] .a-offscreen',
      '.po-brand .po-break-word',
      '#productDetails_detailBullets_sections1 .a-offscreen'
    ];

    for (const selector of brandSelectors) {
      try {
        const element = document.querySelector(selector);
        if (element && element.textContent.trim()) {
          console.log('PageParser: Found brand with selector:', selector);
          return element.textContent.trim();
        }
      } catch (e) {
        console.log('PageParser: Selector failed:', selector, e);
      }
    }

    console.log('PageParser: No brand or book info found');
    return null;
  }

  // /**
  //  * Find the best insertion point for the component - prioritizing higher positions on the page
  //  * @returns {Element|null} - The element to insert the component before/after
  //  */
  // findInsertionPoint() {
  //   console.log('PageParser: Finding optimal insertion point...');
    
  //   // Priority order - from highest to lowest on the page
  //   const insertionTargets = [
  //     // Target 1: Look for the comparison table area (highest priority)
  //     () => {
  //       const comparisonTable = document.querySelector('table[role="table"]');
  //       if (comparisonTable) {
  //         console.log('PageParser: Found comparison table for insertion');
  //         return { element: comparisonTable, position: 'before' };
  //       }
  //       return null;
  //     },
      
  //     // Target 2: Look for feature comparison section
  //     () => {
  //       const featureSection = document.querySelector('[data-feature-name="comparison"]');
  //       if (featureSection) {
  //         console.log('PageParser: Found feature comparison section');
  //         return { element: featureSection, position: 'before' };
  //       }
  //       return null;
  //     },
      
  //     // Target 3: Look for any table in the main content area
  //     () => {
  //       const tables = document.querySelectorAll('#centerCol table, #leftCol table');
  //       for (const table of tables) {
  //         // Skip tables that are too high up (like price comparison)
  //         const rect = table.getBoundingClientRect();
  //         if (rect.top > 200) { // Ensure it's not too high up on the page
  //           console.log('PageParser: Found suitable table in main content');
  //           return { element: table, position: 'before' };
  //         }
  //       }
  //       return null;
  //     },
      
  //     // Target 4: Look for elements with specific text content that indicate comparison area
  //     () => {
  //       const elements = Array.from(document.querySelectorAll('*')).filter(el => {
  //         const text = el.textContent || '';
  //         return text.includes('Customer Reviews') || 
  //                text.includes('Compare with similar items') ||
  //                text.includes('Product information');
  //       });
        
  //       for (const element of elements) {
  //         // Find the parent container that's suitable for insertion
  //         let parent = element.closest('[data-feature-name], .a-section, .a-container');
  //         if (parent) {
  //           console.log('PageParser: Found element with comparison-related text');
  //           return { element: parent, position: 'before' };
  //         }
  //       }
  //       return null;
  //     },
      
  //     // Target 5: Look for the main product details section
  //     () => {
  //       const productDetails = document.querySelector('#productDetails_feature_div, #detail-bullets');
  //       if (productDetails) {
  //         console.log('PageParser: Found product details section');
  //         return { element: productDetails, position: 'before' };
  //       }
  //       return null;
  //     },
      
  //     // Target 6: Fallback - look for any major section in the center column
  //     () => {
  //       const centerCol = document.querySelector('#centerCol');
  //       if (centerCol) {
  //         const sections = centerCol.querySelectorAll('.a-section, [data-feature-name]');
  //         // Try to find a section that's not too high up
  //         for (const section of sections) {
  //           const rect = section.getBoundingClientRect();
  //           if (rect.top > 300 && section.offsetHeight > 50) {
  //             console.log('PageParser: Found fallback section in center column');
  //             return { element: section, position: 'before' };
  //           }
  //         }
  //       }
  //       return null;
  //     }
  //   ];

  //   // Try each insertion target in priority order
  //   for (const targetFinder of insertionTargets) {
  //     try {
  //       const result = targetFinder();
  //       if (result) {
  //         return result;
  //       }
  //     } catch (e) {
  //       console.log('PageParser: Error with insertion target:', e);
  //     }
  //   }

  //   console.log('PageParser: No suitable insertion point found');
  //   return null;
  // }

  // /**
  //  * Insert component at the optimal location
  //  * @param {Element} component - The component to insert
  //  * @returns {boolean} - Success status
  //  */
  // insertComponent(component) {
  //   const insertionInfo = this.findInsertionPoint();
    
  //   if (!insertionInfo) {
  //     console.log('PageParser: Could not find insertion point');
  //     return false;
  //   }

  //   try {
  //     if (insertionInfo.position === 'before') {
  //       insertionInfo.element.parentNode.insertBefore(component, insertionInfo.element);
  //     } else {
  //       insertionInfo.element.parentNode.insertBefore(component, insertionInfo.element.nextSibling);
  //     }
      
  //     console.log('PageParser: Component inserted successfully');
  //     return true;
  //   } catch (e) {
  //     console.log('PageParser: Error inserting component:', e);
  //     return false;
  //   }
  // }

  /**
   * Extract manufacturer information when available
   * @returns {Object|null} - Manufacturer info object or null
   */
  extractManufacturerInfo() {
    console.log('PageParser: Looking for manufacturer information...');
    
    const manufacturer = this.findManufacturer();
    const brandName = this.findBrandWithContains();
    
    if (manufacturer) {
      console.log('PageParser: Found manufacturer:', manufacturer);
      return {
        type: 'product_with_manufacturer',
        brand: brandName || 'Unknown Brand',
        manufacturer: manufacturer
      };
    }
    
    return null;
  }

  /**
   * Find manufacturer information for products
   * @returns {string|null} - Manufacturer name or null
   */
  findManufacturer() {
    console.log('PageParser: Looking for manufacturer...');
    
    // Method 1: Look for manufacturer in the Product details section using the specific HTML structure
    // Target the bold "Manufacturer" label followed by the value in the next span
    const manufacturerLabels = Array.from(document.querySelectorAll('span.a-text-bold')).filter(span => 
        span.textContent.includes('Manufacturer')
    );
    
    for (const label of manufacturerLabels) {
        console.log('PageParser: Found manufacturer label:', label.textContent);
        if (label.textContent.includes('Discontinued By Manufacturer')) {
          console.log('   manufacturer label contained : Discontinued By Manufacturer. Not the one we are looking for.')
          continue
        }
        // Look for the next span element that contains the manufacturer name
        const nextSpan = label.nextElementSibling;
        if (nextSpan && nextSpan.tagName === 'SPAN' && nextSpan.textContent.trim()) {
            const manufacturer = nextSpan.textContent.trim();
            console.log('PageParser: Found manufacturer in next span:', manufacturer);
            return manufacturer;
        }
        
        // Alternative: look for manufacturer value in the same parent element
        const parentLi = label.closest('li');
        if (parentLi) {
            const spans = parentLi.querySelectorAll('span');
            for (const span of spans) {
                if (span !== label && span.textContent.trim() && !span.textContent.includes('Manufacturer')) {
                    const manufacturer = span.textContent.trim();
                    console.log('PageParser: Found manufacturer in parent li:', manufacturer);
                    return manufacturer;
                }
            }
        }
    }
    
    // Method 2: Look for manufacturer in list items with text pattern
    const listItems = document.querySelectorAll('li');
    for (const li of listItems) {
        const liText = li.textContent;
        // Contains the word manufacturer but is not the field: Is Discontinued By Manufacturer
        if (!liText.includes('Discontinued By Manufacturer') && liText.includes('Manufacturer') && liText.includes(':')) {
            console.log('PageParser: Found manufacturer in list item:', liText);
            
            // Extract manufacturer name after the colon
            const match = liText.match(/Manufacturer\s*:?\s*(.+)/i);
            if (match) {
                const manufacturer = match[1].trim();
                console.log('PageParser: Extracted manufacturer from list item:', manufacturer);
                return manufacturer;
            }
        }
    }
    
    // Method 3: Look in Product details section specifically
    const productDetailsElements = Array.from(document.querySelectorAll('*')).filter(el => 
        el.textContent && el.textContent.includes('Product details')
    );
    
    for (const detailsElement of productDetailsElements) {
        console.log('PageParser: Checking product details section...');
        
        // Look for manufacturer pattern in this section
        const sectionText = detailsElement.textContent;
        const manufacturerMatch = sectionText.match(/Manufacturer\s*:?\s*([^\n\r]+)/i);
        // Contains the word manufacturer but is not the field: Is Discontinued By Manufacturer
        if (manufacturerMatch && !manufacturerMatch.includes('Discontinued By Manufacturer')) {
            const manufacturer = manufacturerMatch[1].trim();
            console.log('PageParser: Found manufacturer in product details:', manufacturer);
            return manufacturer;
        }
    }
    
    // Method 4: Look for manufacturer in table rows (fallback)
    const rows = document.querySelectorAll('tr');
    for (const row of rows) {
        const rowText = row.textContent.toLowerCase();
        if (rowText.includes('manufacturer') && !rowText.includes('Discontinued By Manufacturer')) {
            console.log('PageParser: Found manufacturer row:', row.textContent);
            const cells = row.querySelectorAll('td, th');
            for (let i = 0; i < cells.length; i++) {
                const cellText = cells[i].textContent.toLowerCase().trim();
                if (cellText === 'manufacturer' || cellText === 'manufacturer:') {
                    // Get the next cell
                    if (cells[i + 1]) {
                        const manufacturerText = cells[i + 1].textContent.trim();
                        console.log('PageParser: Found manufacturer in next cell:', manufacturerText);
                        return manufacturerText;
                    }
                }
            }
        }
    }
    
    // Method 5: Search entire page text as last resort
    console.log('PageParser: Searching entire page text for manufacturer...');
    const pageText = document.body.textContent;
    const manufacturerPageMatch = pageText.match(/Manufacturer\s*:?\s*([^\n\r]+)/i);
    if (manufacturerPageMatch) {
        const manufacturer = manufacturerPageMatch[1].trim();
        console.log('PageParser: Found manufacturer in page text:', manufacturer);
        return manufacturer;
    }

    console.log('PageParser: Manufacturer not found with any method');
    return null;
  }

  /**
   * Find brand information for non-book products
   * @returns {string|null} - Brand name or null
   */
  findBrandWithContains() {
    console.log('PageParser: Looking for brand...');
    
    // Look for "Brand" in table rows
    const rows = document.querySelectorAll('tr');
    for (const row of rows) {
      const rowText = row.textContent.toLowerCase();
      if (rowText.includes('brand')) {
        console.log('PageParser: Found brand row:', row.textContent);
        const cells = row.querySelectorAll('td, th');
        for (let i = 0; i < cells.length; i++) {
          const cellText = cells[i].textContent.toLowerCase().trim();
          if (cellText === 'brand' || cellText === 'brand:') {
            // Get the next cell
            if (cells[i + 1]) {
              const brandText = cells[i + 1].textContent.trim();
              console.log('PageParser: Found brand in next cell:', brandText);
              return brandText;
            }
          } else if (cellText.includes('brand:')) {
            // Brand info in same cell
            const match = cells[i].textContent.match(/brand:?\s*(.+)/i);
            if (match) {
              console.log('PageParser: Found brand in same cell:', match[1]);
              return match[1].trim();
            }
          }
        }
      }
    }

    // Look in feature bullets
    const bullets = document.querySelectorAll('#feature-bullets li, .feature li');
    for (const bullet of bullets) {
      const text = bullet.textContent;
      if (text.toLowerCase().includes('brand:')) {
        const brandMatch = text.match(/brand:?\s*(.+)/i);
        if (brandMatch) {
          console.log('PageParser: Found brand in bullets:', brandMatch[1]);
          return brandMatch[1].trim();
        }
      }
    }

    console.log('PageParser: Brand not found');
    return null;
  }

  // extractBrandName() {
  //   // Try multiple selectors to find the brand name
  //   const brandSelectors = [
  //     // Standard brand row in product details
  //     'tr:has(td:contains("Brand")) td:not(:contains("Brand"))',
  //     'tr:has(span:contains("Brand")) span:not(:contains("Brand"))',
  //     // Feature list brand
  //     '#feature-bullets ul li:contains("Brand:")',
  //     // Product details table
  //     '.prodDetTable tr:contains("Brand") td:last-child',
  //     // Alternative brand selectors
  //     '[data-feature-name="brand"] .a-offscreen',
  //     '.po-brand .po-break-word',
  //     '#productDetails_detailBullets_sections1 tr:contains("Brand") td:last-child'
  //   ];

  //   for (const selector of brandSelectors) {
  //     try {
  //       // Handle jQuery-style :contains selector manually
  //       if (selector.includes(':contains(')) {
  //         const brand = this.findBrandWithContains();
  //         if (brand) return brand.trim();
  //       } else {
  //         const element = document.querySelector(selector);
  //         if (element && element.textContent.trim()) {
  //           return element.textContent.trim();
  //         }
  //       }
  //     } catch (e) {
  //       console.log('Selector failed:', selector, e);
  //     }
  //   }

  //   return null;
  // }
  // Enhanced main brand extraction method
  extractBrandName() {
      console.log('Starting enhanced brand name extraction...');
      
      // Try methods in order of reliability
      const extractionMethods = [
          () => this.extractBrandFromStoreLink(),
          () => this.extractBrandFromMetaInfo(),
          () => this.extractBrandFromProductDetails(),
          () => this.extractBrandFromProductTitle()
      ];
      
      for (const method of extractionMethods) {
          try {
              const result = method();
              if (result && result.length > 0) {
                  // Clean up the result
                  const cleanBrand = result.replace(/[^\w\s&-]/g, '').trim();
                  if (cleanBrand.length > 0) {
                      console.log('Successfully extracted brand:', cleanBrand);
                      return cleanBrand;
                  }
              }
          } catch (error) {
              console.warn('Error in brand extraction method:', error);
          }
      }
      
      console.log('No brand found with any method');
      return null;
  }

    // Method 1: Extract from store link (highest priority for this case)
  extractBrandFromStoreLink() {
      console.log('Attempting to extract brand from store link...');
      
      // Look for "Visit the [BRAND] Store" pattern
      const storeLinks = document.querySelectorAll('a[href*="stores"], a[href*="store"]');
      for (const link of storeLinks) {
          const linkText = link.textContent.trim();
          const visitStoreMatch = linkText.match(/Visit the (.+?) Store/i);
          if (visitStoreMatch) {
              const brandName = visitStoreMatch[1].trim();
              console.log('Found brand from store link:', brandName);
              return brandName;
          }
      }
      
      // Alternative: Look for store links in byline info
      const bylineElement = document.querySelector('#bylineInfo');
      if (bylineElement) {
          const bylineText = bylineElement.textContent.trim();
          const visitStoreMatch = bylineText.match(/Visit the (.+?) Store/i);
          if (visitStoreMatch) {
              const brandName = visitStoreMatch[1].trim();
              console.log('Found brand from byline store link:', brandName);
              return brandName;
          }
      }
      
      return null;
  }

  // Method 2: Extract from product title
  extractBrandFromProductTitle() {
      console.log('Attempting to extract brand from product title...');
      
      const titleElement = document.querySelector('#productTitle, .product-title, h1');
      if (titleElement) {
          const titleText = titleElement.textContent.trim();
          console.log('Product title:', titleText);
          
          // Look for brand at the beginning of title (common pattern)
          const words = titleText.split(' ');
          if (words.length > 0) {
              const firstWord = words[0];
              // Check if first word looks like a brand (all caps or proper case, not common words)
              if (firstWord.length > 2 && 
                  (firstWord === firstWord.toUpperCase() || 
                  firstWord[0] === firstWord[0].toUpperCase()) &&
                  !['THE', 'A', 'AN', 'FOR', 'WITH', 'BY'].includes(firstWord.toUpperCase())) {
                  console.log('Found potential brand from title:', firstWord);
                  return firstWord;
              }
          }
      }
      
      return null;
  }

  // Method 3: Extract from brand/manufacturer meta information
  extractBrandFromMetaInfo() {
      console.log('Attempting to extract brand from meta information...');
      
      // Look for brand in various meta selectors
      const brandSelectors = [
          '[data-brand]',
          '[data-manufacturer]',
          '.brand-name',
          '.manufacturer-name',
          '#brand',
          '#manufacturer'
      ];
      
      for (const selector of brandSelectors) {
          const element = document.querySelector(selector);
          if (element) {
              const brandValue = element.getAttribute('data-brand') || 
                              element.getAttribute('data-manufacturer') || 
                              element.textContent.trim();
              if (brandValue && brandValue.length > 0) {
                  console.log('Found brand from meta info:', brandValue);
                  return brandValue;
              }
          }
      }
      
      return null;
  }

  // Method 4: Enhanced product details extraction
  extractBrandFromProductDetails() {
      console.log('Attempting to extract brand from product details section...');
      
      // Look for product details section
      const productDetailsSelectors = [
          '#productDetails_feature_div',
          '#feature-bullets',
          '#detailBullets_feature_div',
          '.product-details'
      ];
      
      for (const selector of productDetailsSelectors) {
          const detailsSection = document.querySelector(selector);
          if (detailsSection) {
              const detailsText = detailsSection.textContent;
              
              // Look for various brand/manufacturer patterns
              const patterns = [
                  /Brand\s*:?\s*([^\n\r,]+)/i,
                  /Manufacturer\s*:?\s*([^\n\r,]+)/i,
                  /Made by\s*:?\s*([^\n\r,]+)/i,
                  /By\s+([A-Z][a-zA-Z\s&-]+)/
              ];
              
              for (const pattern of patterns) {
                  const match = detailsText.match(pattern);
                  if (match && match[1]) {
                      const brand = match[1].trim();
                      console.log('Found brand from product details:', brand);
                      return brand;
                  }
              }
          }
      }
      
      return null;
  }
}

// Export for use in other modules
window.PageParser = TypicalProductPageParser;
