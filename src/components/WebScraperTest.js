import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import WebScraperService from '../services/WebScraperService';

/**
 * Test component for WebScraperService
 * This component tests the functionality of the WebScraperService with sample websites
 */
const WebScraperTest = () => {
  // Initialize the scraper service
  const scraper = new WebScraperService();
  
  // Test URLs
  const testUrls = {
    text: 'https://example.com',
    images: 'https://unsplash.com',
    links: 'https://news.ycombinator.com',
    auth: 'https://httpbin.org/basic-auth/user/passwd'
  };
  
  // Test results
  const [results, setResults] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  
  /**
   * Test text extraction
   */
  const testTextExtraction = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const html = await scraper.fetchHtml(testUrls.text);
      const title = scraper.extractText(html, 'h1');
      const paragraph = scraper.extractText(html, 'p');
      
      setResults(prev => ({
        ...prev,
        text: {
          title,
          paragraph
        }
      }));
      
      console.log('Text extraction test passed');
    } catch (err) {
      setError(`Text extraction test failed: ${err.message}`);
      console.error('Text extraction test failed:', err);
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Test image extraction
   */
  const testImageExtraction = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const html = await scraper.fetchHtml(testUrls.images);
      const images = scraper.extractImages(html, 'img', testUrls.images);
      
      setResults(prev => ({
        ...prev,
        images: {
          count: images.length,
          samples: images.slice(0, 3)
        }
      }));
      
      console.log('Image extraction test passed');
    } catch (err) {
      setError(`Image extraction test failed: ${err.message}`);
      console.error('Image extraction test failed:', err);
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Test link extraction
   */
  const testLinkExtraction = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const html = await scraper.fetchHtml(testUrls.links);
      const links = scraper.extractLinks(html, 'a', testUrls.links);
      
      setResults(prev => ({
        ...prev,
        links: {
          count: links.length,
          samples: links.slice(0, 3)
        }
      }));
      
      console.log('Link extraction test passed');
    } catch (err) {
      setError(`Link extraction test failed: ${err.message}`);
      console.error('Link extraction test failed:', err);
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Test authentication
   */
  const testAuthentication = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Set authentication credentials
      scraper.setAuth({
        username: 'user',
        password: 'passwd'
      });
      
      const html = await scraper.fetchHtml(testUrls.auth);
      
      setResults(prev => ({
        ...prev,
        auth: {
          success: true,
          response: html
        }
      }));
      
      console.log('Authentication test passed');
    } catch (err) {
      setError(`Authentication test failed: ${err.message}`);
      console.error('Authentication test failed:', err);
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Run all tests
   */
  const runAllTests = async () => {
    setLoading(true);
    setError(null);
    setResults({});
    
    try {
      await testTextExtraction();
      await testImageExtraction();
      await testLinkExtraction();
      await testAuthentication();
      
      console.log('All tests completed');
    } catch (err) {
      setError(`Tests failed: ${err.message}`);
      console.error('Tests failed:', err);
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Render test results
   */
  const renderResults = () => {
    if (Object.keys(results).length === 0) {
      return null;
    }
    
    return (
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Test Results:</Text>
        
        {results.text && (
          <View style={styles.resultSection}>
            <Text style={styles.sectionTitle}>Text Extraction:</Text>
            <Text>Title: {results.text.title}</Text>
            <Text>Paragraph: {results.text.paragraph?.substring(0, 100)}...</Text>
          </View>
        )}
        
        {results.images && (
          <View style={styles.resultSection}>
            <Text style={styles.sectionTitle}>Image Extraction:</Text>
            <Text>Found {results.images.count} images</Text>
            {results.images.samples.map((img, i) => (
              <Text key={i} numberOfLines={1} ellipsizeMode="middle">
                {i + 1}. {img.url}
              </Text>
            ))}
          </View>
        )}
        
        {results.links && (
          <View style={styles.resultSection}>
            <Text style={styles.sectionTitle}>Link Extraction:</Text>
            <Text>Found {results.links.count} links</Text>
            {results.links.samples.map((link, i) => (
              <Text key={i} numberOfLines={1} ellipsizeMode="middle">
                {i + 1}. {link.text || 'No text'}: {link.url}
              </Text>
            ))}
          </View>
        )}
        
        {results.auth && (
          <View style={styles.resultSection}>
            <Text style={styles.sectionTitle}>Authentication Test:</Text>
            <Text>Status: {results.auth.success ? 'Success' : 'Failed'}</Text>
            <Text>Response: {JSON.stringify(results.auth.response).substring(0, 100)}...</Text>
          </View>
        )}
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>WebScraperService Tests</Text>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Test Text Extraction"
          onPress={testTextExtraction}
          disabled={loading}
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Test Image Extraction"
          onPress={testImageExtraction}
          disabled={loading}
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Test Link Extraction"
          onPress={testLinkExtraction}
          disabled={loading}
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Test Authentication"
          onPress={testAuthentication}
          disabled={loading}
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Run All Tests"
          onPress={runAllTests}
          disabled={loading}
          color="#4CAF50"
        />
      </View>
      
      {loading && (
        <Text style={styles.loadingText}>Running tests...</Text>
      )}
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      {renderResults()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: 8,
  },
  loadingText: {
    marginTop: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#666',
  },
  errorContainer: {
    marginTop: 16,
    padding: 8,
    backgroundColor: '#ffebee',
    borderRadius: 4,
  },
  errorText: {
    color: '#d32f2f',
  },
  resultsContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultSection: {
    marginTop: 12,
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
});

export default WebScraperTest;
