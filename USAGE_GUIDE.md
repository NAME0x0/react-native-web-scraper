# React Native Web Scraper - Usage Guide

## Overview

This React Native Web Scraper is a modular, flexible solution for scraping various websites to extract both text and images. It supports authentication and is built with stable, widely compatible libraries.

## Installation

1. Clone or download the project
2. Install dependencies:

```bash
cd react-native-web-scraper
npm install
```

3. Start the development server:

```bash
npm start
```

4. Run on your preferred platform:
   - Press `a` for Android
   - Press `i` for iOS
   - Press `w` for web

## Project Structure

```
react-native-web-scraper/
├── App.js                  # Main application entry point
├── package.json            # Project dependencies
├── src/
│   ├── components/         # React Native components
│   │   ├── WebScraper.js           # Basic scraper component
│   │   ├── WebScraperWithAuth.js   # Advanced scraper with authentication
│   │   └── WebScraperTest.js       # Test suite component
│   └── services/           # Service modules
│       └── WebScraperService.js    # Core scraping functionality
```

## Core Features

- **Text Scraping**: Extract text content from websites using CSS selectors
- **Image Scraping**: Extract images with URLs, alt text, and dimensions
- **Link Extraction**: Extract links with their text and URLs
- **Authentication Support**: Basic auth and cookie-based authentication
- **Structured Data Extraction**: Extract data in structured format based on mapping configuration

## Using the WebScraperService

The `WebScraperService` is the core module that provides all scraping functionality. Here's how to use it:

### Basic Usage

```javascript
import WebScraperService from '../services/WebScraperService';

// Initialize the scraper
const scraper = new WebScraperService();

// Fetch HTML content
const html = await scraper.fetchHtml('https://example.com');

// Extract text using CSS selectors
const title = scraper.extractText(html, 'h1');
const paragraphs = scraper.extractText(html, 'p');

// Extract images
const images = scraper.extractImages(html, 'img', 'https://example.com');

// Extract links
const links = scraper.extractLinks(html, 'a', 'https://example.com');
```

### Advanced Usage with Authentication

```javascript
// Initialize with options
const scraper = new WebScraperService({
  timeout: 15000,
  headers: {
    'User-Agent': 'Custom User Agent',
    'Accept-Language': 'en-US,en;q=0.9'
  }
});

// Basic authentication
scraper.setAuth({
  username: 'user',
  password: 'password'
});

// Or set cookies for cookie-based authentication
scraper.setCookies('session=abc123; token=xyz789');

// Now fetch from authenticated endpoint
const html = await scraper.fetchHtml('https://secure-example.com/dashboard');
```

### Extracting Structured Data

```javascript
// Define a mapping of data fields to selectors
const mapping = {
  title: 'h1',
  description: '.description',
  price: {
    selector: '.price',
    type: 'text'
  },
  images: {
    selector: '.product-images img',
    type: 'list'
  },
  rating: {
    selector: '.rating',
    type: 'attr',
    attr: 'data-value'
  }
};

// Extract structured data
const productData = scraper.extractStructuredData(html, mapping);
```

## Using the React Native Components

### Basic Scraper Component

The `WebScraper` component provides a simple UI for scraping websites:

1. Enter the URL you want to scrape
2. Enter CSS selectors for targeting specific elements
3. Choose the type of content to scrape (text, images, or links)
4. Press "Start Scraping" to begin

### Advanced Scraper Component

The `WebScraperWithAuth` component extends the basic scraper with authentication capabilities:

1. Enter the URL and optional CSS selector
2. Toggle "Use Authentication" to enable authentication options
3. Choose between Basic Auth or Cookie Auth
4. Enter authentication credentials
5. Press "Start Scraping" to begin

### Test Suite Component

The `WebScraperTest` component allows you to test the scraper functionality:

1. Press individual test buttons to test specific features
2. Or press "Run All Tests" to test everything at once
3. View test results displayed below

## Common Scraping Scenarios

### Scenario 1: Scraping Article Content

```javascript
const scraper = new WebScraperService();
const html = await scraper.fetchHtml('https://news-site.com/article/123');

const articleData = scraper.extractStructuredData(html, {
  title: 'h1.article-title',
  author: '.author-name',
  date: {
    selector: '.publish-date',
    type: 'text'
  },
  content: {
    selector: '.article-body',
    type: 'html'
  },
  tags: {
    selector: '.tags .tag',
    type: 'list'
  }
});
```

### Scenario 2: Scraping Product Information

```javascript
const scraper = new WebScraperService();
const html = await scraper.fetchHtml('https://shop.com/product/456');

const productData = scraper.extractStructuredData(html, {
  name: 'h1.product-name',
  price: '.product-price',
  description: '.product-description',
  images: {
    type: 'custom',
    value: scraper.extractImages(html, '.product-gallery img', 'https://shop.com')
  },
  specifications: {
    selector: '.specs li',
    type: 'list'
  }
});
```

### Scenario 3: Scraping with Authentication

```javascript
const scraper = new WebScraperService();

// Set authentication
scraper.setAuth({
  username: 'user',
  password: 'password'
});

// Fetch protected content
const html = await scraper.fetchHtml('https://members-only.com/content');

// Extract data
const memberData = scraper.extractText(html, '.member-content');
```

## Best Practices

1. **Respect Website Terms**: Always check a website's robots.txt and terms of service before scraping.

2. **Rate Limiting**: Implement delays between requests to avoid overloading servers:
   ```javascript
   const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
   
   async function scrapeWithDelay(urls) {
     const results = [];
     for (const url of urls) {
       const html = await scraper.fetchHtml(url);
       results.push(scraper.extractText(html, 'h1'));
       await delay(1000); // Wait 1 second between requests
     }
     return results;
   }
   ```

3. **Error Handling**: Implement proper error handling for robust scraping:
   ```javascript
   try {
     const html = await scraper.fetchHtml(url);
     return scraper.extractText(html, selector);
   } catch (error) {
     console.error(`Error scraping ${url}: ${error.message}`);
     return null;
   }
   ```

4. **Caching Results**: Cache results to reduce unnecessary requests:
   ```javascript
   const cache = {};
   
   async function scrapeWithCache(url, selector) {
     const cacheKey = `${url}:${selector}`;
     if (cache[cacheKey]) {
       return cache[cacheKey];
     }
     
     const html = await scraper.fetchHtml(url);
     const result = scraper.extractText(html, selector);
     cache[cacheKey] = result;
     return result;
   }
   ```

## Troubleshooting

### Common Issues and Solutions

1. **Cannot extract data from dynamic websites**
   - Some websites load content dynamically with JavaScript
   - Solution: Consider using a WebView approach for JavaScript-heavy sites

2. **Authentication fails**
   - Check if the site uses more complex authentication mechanisms
   - Solution: Try cookie-based authentication with proper headers

3. **Selectors not working**
   - Website structure might have changed
   - Solution: Inspect the HTML structure again and update selectors

4. **Rate limiting or blocking**
   - Website might be blocking scraping attempts
   - Solution: Add delays between requests and use realistic user agents

## Extending the Scraper

### Adding Custom Extraction Methods

You can extend the `WebScraperService` class to add custom functionality:

```javascript
class EnhancedWebScraperService extends WebScraperService {
  // Add a method to extract JSON-LD structured data
  extractJsonLd(html) {
    const $ = cheerio.load(html);
    const jsonLdScript = $('script[type="application/ld+json"]').html();
    
    if (jsonLdScript) {
      try {
        return JSON.parse(jsonLdScript);
      } catch (error) {
        console.error('Error parsing JSON-LD:', error);
      }
    }
    
    return null;
  }
}
```

### Creating Custom Scraper Components

You can create custom React Native components for specific scraping needs:

```javascript
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import WebScraperService from '../services/WebScraperService';

const ProductScraper = () => {
  const [product, setProduct] = useState(null);
  const scraper = new WebScraperService();
  
  const scrapeProduct = async (productUrl) => {
    const html = await scraper.fetchHtml(productUrl);
    
    const productData = {
      name: scraper.extractText(html, '.product-name'),
      price: scraper.extractText(html, '.product-price'),
      images: scraper.extractImages(html, '.product-images img', productUrl)
    };
    
    setProduct(productData);
  };
  
  return (
    <View>
      <Button 
        title="Scrape Product" 
        onPress={() => scrapeProduct('https://example.com/product/123')} 
      />
      {product && (
        <View>
          <Text>Name: {product.name}</Text>
          <Text>Price: {product.price}</Text>
          <Text>Images: {product.images.length}</Text>
        </View>
      )}
    </View>
  );
};
```

## Conclusion

This React Native Web Scraper provides a flexible, modular solution for extracting both text and images from various websites. With support for authentication and a comprehensive API, it can be adapted to many different scraping scenarios.

For any questions or issues, please refer to the troubleshooting section or contact the developer.
