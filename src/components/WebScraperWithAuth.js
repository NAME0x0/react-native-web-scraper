import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, ActivityIndicator, Switch } from 'react-native';
import WebScraperService from '../services/WebScraperService';

/**
 * WebScraperWithAuth component for React Native
 * Extends the basic WebScraper with authentication capabilities
 */
const WebScraperWithAuth = () => {
  const [url, setUrl] = useState('');
  const [selector, setSelector] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  
  // Authentication states
  const [useAuth, setUseAuth] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cookies, setCookies] = useState('');
  const [authType, setAuthType] = useState('basic'); // 'basic' or 'cookie'

  // Initialize the scraper service
  const [scraper] = useState(new WebScraperService());

  /**
   * Configure authentication when auth settings change
   */
  useEffect(() => {
    if (useAuth) {
      if (authType === 'basic' && username && password) {
        scraper.setAuth({ username, password });
      } else if (authType === 'cookie' && cookies) {
        scraper.setCookies(cookies);
      }
    }
  }, [useAuth, authType, username, password, cookies]);

  /**
   * Handle the scraping process
   */
  const handleScrape = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      // Fetch HTML content
      const html = await scraper.fetchHtml(url);
      
      // Extract data based on selector
      if (selector) {
        const extractedData = scraper.extractStructuredData(html, {
          title: 'title',
          headings: { 
            type: 'list', 
            selector: 'h1, h2, h3' 
          },
          mainContent: { 
            type: 'text', 
            selector: selector 
          },
          images: { 
            type: 'custom',
            value: scraper.extractImages(html, 'img', url)
          },
          links: { 
            type: 'custom',
            value: scraper.extractLinks(html, 'a', url)
          }
        });
        
        setResults(extractedData);
      } else {
        // Default extraction if no selector provided
        const extractedData = {
          title: scraper.extractText(html, 'title'),
          images: scraper.extractImages(html, 'img', url),
          links: scraper.extractLinks(html, 'a', url)
        };
        
        setResults(extractedData);
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
      console.error('Scraping error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Render authentication form
   */
  const renderAuthForm = () => {
    if (!useAuth) return null;

    return (
      <View style={styles.authContainer}>
        <View style={styles.authTypeContainer}>
          <Button
            title="Basic Auth"
            onPress={() => setAuthType('basic')}
            color={authType === 'basic' ? '#4CAF50' : '#888'}
          />
          <Button
            title="Cookie Auth"
            onPress={() => setAuthType('cookie')}
            color={authType === 'cookie' ? '#4CAF50' : '#888'}
          />
        </View>

        {authType === 'basic' ? (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Username:</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Username"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password:</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry
              />
            </View>
          </>
        ) : (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Cookies:</Text>
            <TextInput
              style={styles.input}
              value={cookies}
              onChangeText={setCookies}
              placeholder="name=value; name2=value2"
              autoCapitalize="none"
              multiline
            />
          </View>
        )}
      </View>
    );
  };

  /**
   * Render results
   */
  const renderResults = () => {
    if (!results) return null;

    return (
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Scraping Results:</Text>
        <ScrollView style={styles.resultsScroll}>
          {results.title && (
            <View style={styles.resultSection}>
              <Text style={styles.resultSectionTitle}>Page Title:</Text>
              <Text>{results.title}</Text>
            </View>
          )}

          {results.mainContent && (
            <View style={styles.resultSection}>
              <Text style={styles.resultSectionTitle}>Main Content:</Text>
              <Text>{results.mainContent}</Text>
            </View>
          )}

          {results.headings && results.headings.length > 0 && (
            <View style={styles.resultSection}>
              <Text style={styles.resultSectionTitle}>Headings:</Text>
              {results.headings.map((heading, index) => (
                <Text key={index} style={styles.listItem}>• {heading}</Text>
              ))}
            </View>
          )}

          {results.images && results.images.length > 0 && (
            <View style={styles.resultSection}>
              <Text style={styles.resultSectionTitle}>Images ({results.images.length}):</Text>
              {results.images.slice(0, 10).map((image, index) => (
                <Text key={index} style={styles.listItem}>
                  • {image.alt || 'No alt text'} - {image.url}
                </Text>
              ))}
              {results.images.length > 10 && (
                <Text style={styles.moreItems}>
                  ...and {results.images.length - 10} more images
                </Text>
              )}
            </View>
          )}

          {results.links && results.links.length > 0 && (
            <View style={styles.resultSection}>
              <Text style={styles.resultSectionTitle}>Links ({results.links.length}):</Text>
              {results.links.slice(0, 10).map((link, index) => (
                <Text key={index} style={styles.listItem}>
                  • {link.text || 'No text'} - {link.url}
                </Text>
              ))}
              {results.links.length > 10 && (
                <Text style={styles.moreItems}>
                  ...and {results.links.length - 10} more links
                </Text>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Advanced Web Scraper</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>URL:</Text>
        <TextInput
          style={styles.input}
          value={url}
          onChangeText={setUrl}
          placeholder="https://example.com"
          autoCapitalize="none"
          keyboardType="url"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>CSS Selector (optional):</Text>
        <TextInput
          style={styles.input}
          value={selector}
          onChangeText={setSelector}
          placeholder="article, .content, #main"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.authToggleContainer}>
        <Text style={styles.label}>Use Authentication:</Text>
        <Switch
          value={useAuth}
          onValueChange={setUseAuth}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={useAuth ? '#4CAF50' : '#f4f3f4'}
        />
      </View>

      {renderAuthForm()}

      <Button
        title={loading ? 'Scraping...' : 'Start Scraping'}
        onPress={handleScrape}
        disabled={loading || !url}
        color="#4CAF50"
      />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Scraping in progress...</Text>
        </View>
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
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    minHeight: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  authToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  authContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  authTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#4CAF50',
  },
  errorContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ffebee',
    borderRadius: 4,
  },
  errorText: {
    color: '#d32f2f',
  },
  resultsContainer: {
    marginTop: 20,
    flex: 1,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultsScroll: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  resultSection: {
    marginBottom: 16,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
  },
  resultSectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
  },
  listItem: {
    marginBottom: 4,
  },
  moreItems: {
    fontStyle: 'italic',
    color: '#666',
    marginTop: 4,
  },
});

export default WebScraperWithAuth;
