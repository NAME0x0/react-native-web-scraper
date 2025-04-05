import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import WebScraper from './src/components/WebScraper';
import WebScraperWithAuth from './src/components/WebScraperWithAuth';
import WebScraperTest from './src/components/WebScraperTest';

/**
 * Main App component for the Web Scraper application
 */
const App = () => {
  const [activeTab, setActiveTab] = useState('basic'); // 'basic', 'advanced', or 'test'

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>React Native Web Scraper</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'basic' && styles.activeTab]}
          onPress={() => setActiveTab('basic')}
        >
          <Text style={[styles.tabText, activeTab === 'basic' && styles.activeTabText]}>
            Basic Scraper
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'advanced' && styles.activeTab]}
          onPress={() => setActiveTab('advanced')}
        >
          <Text style={[styles.tabText, activeTab === 'advanced' && styles.activeTabText]}>
            Advanced Scraper
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'test' && styles.activeTab]}
          onPress={() => setActiveTab('test')}
        >
          <Text style={[styles.tabText, activeTab === 'test' && styles.activeTabText]}>
            Test Suite
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'basic' && <WebScraper />}
        {activeTab === 'advanced' && <WebScraperWithAuth />}
        {activeTab === 'test' && <WebScraperTest />}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4CAF50',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
});

export default App;
