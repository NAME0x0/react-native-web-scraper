/**
 * WebScraperService.js
 * A modular web scraping service for React Native applications
 */

import axios from 'axios';
import cheerio from 'react-native-cheerio';

class WebScraperService {
  /**
   * Constructor for the WebScraperService
   * @param {Object} options - Configuration options
   * @param {Object} options.headers - Custom headers for requests
   * @param {Object} options.auth - Authentication details (if needed)
   * @param {number} options.timeout - Request timeout in milliseconds
   */
  constructor(options = {}) {
    this.client = axios.create({
      timeout: options.timeout || 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        ...options.headers
      }
    });

    // Set authentication if provided
    if (options.auth) {
      this.client.defaults.auth = options.auth;
    }
  }

  /**
   * Fetch HTML content from a URL
   * @param {string} url - The URL to scrape
   * @returns {Promise<string>} - The HTML content
   */
  async fetchHtml(url) {
    try {
      const response = await this.client.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching HTML:', error);
      throw error;
    }
  }

  /**
   * Extract text content from HTML using selectors
   * @param {string} html - The HTML content
   * @param {string|Object} selectors - CSS selector(s) to extract
   * @returns {Object|string|Array} - Extracted text content
   */
  extractText(html, selectors) {
    try {
      const $ = cheerio.load(html);
      
      // If selectors is a string, return text for that selector
      if (typeof selectors === 'string') {
        return $(selectors).text().trim();
      }
      
      // If selectors is an object, return an object with the same keys
      // but values replaced with extracted text
      if (typeof selectors === 'object') {
        const result = {};
        
        for (const key in selectors) {
          if (Object.prototype.hasOwnProperty.call(selectors, key)) {
            result[key] = $(selectors[key]).text().trim();
          }
        }
        
        return result;
      }
      
      return null;
    } catch (error) {
      console.error('Error extracting text:', error);
      throw error;
    }
  }

  /**
   * Extract image URLs from HTML using selectors
   * @param {string} html - The HTML content
   * @param {string} selector - CSS selector for images
   * @param {string} baseUrl - Base URL for resolving relative paths
   * @returns {Array} - Array of image URLs
   */
  extractImages(html, selector = 'img', baseUrl = '') {
    try {
      const $ = cheerio.load(html);
      const images = [];
      
      $(selector).each((i, element) => {
        let imageUrl = $(element).attr('src') || $(element).attr('data-src');
        
        // Handle relative URLs
        if (imageUrl && imageUrl.startsWith('/') && baseUrl) {
          imageUrl = new URL(imageUrl, baseUrl).href;
        }
        
        if (imageUrl) {
          images.push({
            url: imageUrl,
            alt: $(element).attr('alt') || '',
            width: $(element).attr('width') || null,
            height: $(element).attr('height') || null
          });
        }
      });
      
      return images;
    } catch (error) {
      console.error('Error extracting images:', error);
      throw error;
    }
  }

  /**
   * Extract links from HTML using selectors
   * @param {string} html - The HTML content
   * @param {string} selector - CSS selector for links
   * @param {string} baseUrl - Base URL for resolving relative paths
   * @returns {Array} - Array of link objects with href and text
   */
  extractLinks(html, selector = 'a', baseUrl = '') {
    try {
      const $ = cheerio.load(html);
      const links = [];
      
      $(selector).each((i, element) => {
        let href = $(element).attr('href');
        
        // Handle relative URLs
        if (href && href.startsWith('/') && baseUrl) {
          href = new URL(href, baseUrl).href;
        }
        
        if (href) {
          links.push({
            url: href,
            text: $(element).text().trim()
          });
        }
      });
      
      return links;
    } catch (error) {
      console.error('Error extracting links:', error);
      throw error;
    }
  }

  /**
   * Extract structured data from HTML using a mapping configuration
   * @param {string} html - The HTML content
   * @param {Object} mapping - Mapping of data fields to selectors
   * @returns {Object} - Structured data object
   */
  extractStructuredData(html, mapping) {
    try {
      const $ = cheerio.load(html);
      const result = {};
      
      for (const key in mapping) {
        if (Object.prototype.hasOwnProperty.call(mapping, key)) {
          const selector = mapping[key];
          
          if (typeof selector === 'string') {
            result[key] = $(selector).text().trim();
          } else if (typeof selector === 'object' && selector.type) {
            // Handle different types of data extraction
            switch (selector.type) {
              case 'text':
                result[key] = $(selector.selector).text().trim();
                break;
              case 'html':
                result[key] = $(selector.selector).html();
                break;
              case 'attr':
                result[key] = $(selector.selector).attr(selector.attr);
                break;
              case 'list':
                result[key] = [];
                $(selector.selector).each((i, el) => {
                  result[key].push($(el).text().trim());
                });
                break;
              default:
                result[key] = $(selector.selector).text().trim();
            }
          }
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error extracting structured data:', error);
      throw error;
    }
  }

  /**
   * Set authentication credentials
   * @param {Object} auth - Authentication details
   */
  setAuth(auth) {
    this.client.defaults.auth = auth;
  }

  /**
   * Set custom headers
   * @param {Object} headers - Custom headers
   */
  setHeaders(headers) {
    this.client.defaults.headers = {
      ...this.client.defaults.headers,
      ...headers
    };
  }

  /**
   * Set cookies for requests
   * @param {string} cookies - Cookie string
   */
  setCookies(cookies) {
    this.setHeaders({
      'Cookie': cookies
    });
  }
}

export default WebScraperService;
