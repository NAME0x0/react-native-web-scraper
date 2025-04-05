import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, ActivityIndicator, Image } from 'react-native';
import WebScraperService from '../services/WebScraperService';

/**
 * WebScraper component for React Native
 * Demonstrates how to use the WebScraperService in a React Native component
 */
const WebScraper = () => {
  const [url, setUrl] = useState('');
  const [selector, setSelector] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [textResults, setTextResults] = useState(null);
  const [imageResults, setImageResults] = useState([]);
  const [linkResults, setLinkResults] = useState([]);
  const [scrapeType, setScrapeType] = useState('text'); // 'text', 'images', 'links'

  // Initialize the scraper service
  const scraper = new WebScraperService();

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
    setTextResults(null);
    setImageResults([]);
    setLinkResults([]);

    try {
      // Fetch HTML content
      const html = await scraper.fetchHtml(url);

      // Extract data based on selected type
      switch (scrapeType) {
        case 'text':
          if (selector) {
            const text = scraper.extractText(html, selector);
            setTextResults(text);
          } else {
            setError('Please enter a CSS selector for text extraction');
          }
          break;

        case 'images':
          const images = scraper.extractImages(html, selector || 'img', url);
          setImageResults(images);
          break;

        case 'links':
          const links = scraper.extractLinks(html, selector || 'a', url);
          setLinkResults(links);
          break;

        default:
          setError('Invalid scrape type');
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
      console.error('Scraping error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Render text results
   */
  const renderTextResults = () => {
    if (!textResults) return null;

    return (
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Text Results:</Text>
        <ScrollView style={styles.resultsScroll}>
          <Text>{textResults}</Text>
        </ScrollView>
      </View>
    );
  };

  /**
   * Render image results
   */
  const renderImageResults = () => {
    if (imageResults.length === 0) return null;

    return (
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Image Results ({imageResults.length}):</Text>
        <ScrollView style={styles.resultsScroll} horizontal={false}>
          {imageResults.map((image, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image
                source={{ uri: image.url }}
                style={styles.image}
                resizeMode="contain"
              />
              <Text style={styles.imageAlt}>{image.alt || 'No alt text'}</Text>
              <Text style={styles.imageUrl}>{image.url}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  /**
   * Render link results
   */
  const renderLinkResults = () => {
    if (linkResults.length === 0) return null;

    return (
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Link Results ({linkResults.length}):</Text>
        <ScrollView style={styles.resultsScroll}>
          {linkResults.map((link, index) => (
            <View key={index} style={styles.linkContainer}>
              <Text style={styles.linkText}>{link.text || 'No text'}</Text>
              <Text style={styles.linkUrl}>{link.url}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Web Scraper</Text>
      
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
        <Text style={styles.label}>CSS Selector:</Text>
        <TextInput
          style={styles.input}
          value={selector}
          onChangeText={setSelector}
          placeholder={scrapeType === 'text' ? 'h1, .content, #main' : scrapeType === 'images' ? 'img, .gallery img' : 'a, .links a'}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.typeContainer}>
        <Text style={styles.label}>Scrape Type:</Text>
        <View style={styles.typeButtons}>
          <Button
            title="Text"
            onPress={() => setScrapeType('text')}
            color={scrapeType === 'text' ? '#4CAF50' : '#888'}
          />
          <Button
            title="Images"
            onPress={() => setScrapeType('images')}
            color={scrapeType === 'images' ? '#4CAF50' : '#888'}
          />
          <Button
            title="Links"
            onPress={() => setScrapeType('links')}
            color={scrapeType === 'links' ? '#4CAF50' : '#888'}
          />
        </View>
      </View>

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

      {renderTextResults()}
      {renderImageResults()}
      {renderLinkResults()}
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
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  typeContainer: {
    marginBottom: 16,
  },
  typeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  imageContainer: {
    marginBottom: 16,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 8,
    backgroundColor: '#eee',
  },
  imageAlt: {
    fontWeight: '500',
    marginBottom: 4,
  },
  imageUrl: {
    fontSize: 12,
    color: '#666',
  },
  linkContainer: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
  },
  linkText: {
    fontWeight: '500',
    marginBottom: 4,
  },
  linkUrl: {
    fontSize: 12,
    color: '#2196F3',
  },
});

export default WebScraper;
