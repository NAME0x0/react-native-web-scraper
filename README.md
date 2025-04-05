# React Native Web Scraper

A modular, flexible web scraping solution for React Native applications that can extract both text and images from various websites.

## Features

- **Modular Architecture**: Easily adaptable for different scraping needs
- **Text Scraping**: Extract text content using CSS selectors
- **Image Scraping**: Extract images with URLs, alt text, and dimensions
- **Authentication Support**: Handle both basic auth and cookie-based authentication
- **Comprehensive UI**: Simple interface for scraping operations
- **Test Suite**: Built-in testing for all scraping functionality

## Project Structure

```
react-native-web-scraper/
├── App.js                  # Main application entry point
├── package.json            # Project dependencies
├── README.md               # Project overview (this file)
├── USAGE_GUIDE.md          # Detailed usage instructions
├── src/
│   ├── components/         # React Native components
│   │   ├── WebScraper.js           # Basic scraper component
│   │   ├── WebScraperWithAuth.js   # Advanced scraper with authentication
│   │   └── WebScraperTest.js       # Test suite component
│   └── services/           # Service modules
│       └── WebScraperService.js    # Core scraping functionality
```

## Getting Started

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

## Documentation

For detailed usage instructions, examples, and best practices, please refer to the [USAGE_GUIDE.md](./USAGE_GUIDE.md) file.

## Dependencies

- React Native
- Expo
- Axios (for HTTP requests)
- React Native Cheerio (for HTML parsing)

## License

MIT
