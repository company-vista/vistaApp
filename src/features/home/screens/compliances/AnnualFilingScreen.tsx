import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AnnualFilingScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Annual Filing</Text>
      <Text style={styles.subtitle}>Coming soon</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b6b6b',
  },
});

export default AnnualFilingScreen;
