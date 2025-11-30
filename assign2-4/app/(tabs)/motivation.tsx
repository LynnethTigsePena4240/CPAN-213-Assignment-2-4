import React from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, useColorScheme } from 'react-native';
import { useMotivation } from "../../stores/motivationStore";

const getThemedColors = (isDarkMode: boolean) => ({
  background: isDarkMode ? '#121212' : '#F0F0F0',
  text: isDarkMode ? '#FFFFFF' : '#333333',
  card: isDarkMode ? '#1E1E1E' : '#FFFFFF',
  primary: '#007AFF',
});

export default function MotivationScreen() {
  const { quote, isLoading, error, fetchNewQuote } = useMotivation();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const colors = getThemedColors(isDarkMode);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Daily Motivation
      </Text>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.text }]}>
              Fetching inspiration...
            </Text>
          </View>
        )}

        {error && (
          <Text style={[styles.errorText, { color: 'red' }]}>{error}</Text>
        )}

        {quote && !isLoading && (
          <View>
            <Text style={[styles.quoteText, { color: colors.text }]}>
              {`"${quote.content}"`}
            </Text>
            <Text style={[styles.authorText, { color: colors.text }]}>
              {`— ${quote.author}`}
            </Text>
          </View>
        )}
      </View>

      <Button
        title={isLoading ? "Loading..." : "New Quote"}
        onPress={fetchNewQuote}
        disabled={isLoading}
        color={colors.primary}
      />

      <View style={styles.spacer} />
      <Text style={{ color: colors.text, fontSize: 12 }}>
        *Quote provided by Programming Quotes API
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 70,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  card: {
    width: '100%',
    padding: 30,
    borderRadius: 12,
    marginBottom: 30,
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 20,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 15,
  },
  authorText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'right',
    alignSelf: 'flex-end',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  spacer: {
    height: 50,
  }
});