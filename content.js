// Amazon Brand Owner Tracker - Content Script
class AmazonBrandTracker {

  constructor() {
    this.brandInfo = null;
    // this.layoutDefaultMode = 'buybox'; // Default fallback
    this.layoutDefaultMode = 'product-details'; // Default fallback
    this.layoutMode = this.layoutDefaultMode


    this.pageParser = new TypicalProductPageParser();
    this.bookPageParser= new BookPageParser();
    this.networkManager = new NetworkManager();
    
    this.init();
  }

  async init() {
    // Load layout preference from storage
    try {
      const result = await chrome.storage.sync.get(['layoutMode']);
      this.layoutMode = result.layoutMode || this.layoutDefaultMode;
      console.log('Loaded layout mode:', this.layoutMode);
    } catch (error) {
      console.log('Could not load layout preference, using default:', error);
    }

    // This is init here to correclty load the user toggled setting (if set).
    this.displayElementManager = new  CypherDisplayElementManager(this.layoutMode)

    // Wait for page to load and then extract brand info
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.classifyWebpageExtractInfoAndUpdateDisplay());
    } else {
      this.classifyWebpageExtractInfoAndUpdateDisplay();
    }
  }

 
  classifyProductAndExtractBrandInfo() {
    // Check for manufacturer information first (more reliable for ownership).
      // If this is found directly on the page we are done and can update the UI component.
      console.log('Starting manufacturer info extraction...');
      let brandInfo = this.pageParser.extractManufacturerInfo();
      if (brandInfo != null && brandInfo.manufacturer !== 'information...' ) {
        // Initial success case the manufacture field exists on the product page.
        console.log('Found manufacturer info directly from page:', brandInfo);
      } else {
        // If the manufauring company field is not explicitly listed we need to extract the brand instead.
        // If no brand is listed this will be an error state and the UI will be updated accordingly.
        console.log('Starting brand info extraction...');
        brandInfo = this.pageParser.extractBrandName();
        if (brandInfo) {
          const displayInfo2 = brandInfo || 'no-info-found';
          console.log('Found brand/book info:', displayInfo2);
        } else {
          // If the brand is not listed this could be a book page.
          // Book pages will have their own category specific text on the UI component.
          console.log('Processing book page...');
          brandInfo = this.bookPageParser.extractBrandName();
          // TODO: Handle other corner cases. 
          // There are many types of Amazon product pages so there will likely be many more.     
        }
      }
      return brandInfo
  }

  /* This method ties together the methods from the other modules:
     DisplayElementFactory, PageParser, and NetworkManager.
  */
  async classifyWebpageExtractInfoAndUpdateDisplay () {

      // First we create the component. It will intially be in its laoding state.
      console.log('Now displaying extension component...');
      const displayInfo = {'type': 'product_with_manufacturer'};
      const loadingElement = this.displayElementManager.createDisplayElementWithComponent(displayInfo, null, true);
      loadingElement.classList.add('loading');
      this.displayElementManager.insertDisplayElement(loadingElement);
      
      // Classify the webpage parse it and return meta data describing what is in the product page.
      const brandInfo = this.classifyProductAndExtractBrandInfo();
  
      // If found on Amazon product page of any type.
      // When the company that owns the brand is found directly on the web page.
      if (brandInfo) {
        setTimeout(() => {
              this.displayElementManager.updateDisplayElement(brandInfo, null);
          }, 500);
          return;
      }

      // Finally if all we got is the brand but no corresponding company behind it we call our own API to 
      // match the brand with the company that owns it.
      console.log('Processing regular product page...');
      const ownerInfo = await this.networkManager.fetchBrandOwner(brandInfo);
      console.log(`ownerInfo: ${ownerInfo}`);
      console.log(`brand_name: ${ownerInfo.brand_name}`);
      console.log(`owning_company_name: ${ownerInfo.owning_company_name}`);
      
      // Error case
      if (!brandInfo) {
        console.log('No brand info found, showing error message...');
        setTimeout(() => {
            this.displayElementManager.updateDisplayElement('no-info-found', null);
        }, 500);
        return;
      }

      // Final case. Update with results of netowrk call.
      // Update the UI compmenet with the newtork fetching company owner information.
      this.displayElementManager.updateDisplayElement(brandInfo, ownerInfo); 
  }

  async classifyWebpageExtractInfoAndUpdateDisplayWithCompassComponent() {
      // Insert Compass component in loading state.
      
      // Classify the webpage parse it and return meta data describing what is in the product page.
      // const brandInfo = this.classifyProductAndExtractBrandInfo();
      // Optionally fetch company from network if needed
      // const ownerInfo = await this.networkManager.fetchBrandOwner(brandInfo);

      // Call the Compass AI political leaning endpoint.

      // Populate the Compass AI component with the correct info and take it our of loading state.
  }
}

// Initialize the tracker
new AmazonBrandTracker();