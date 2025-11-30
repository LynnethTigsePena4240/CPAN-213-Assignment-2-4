import React from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import { Link } from 'expo-router';

const getThemedColors = (isDarkMode: boolean) => ({
  background: isDarkMode ? '#121212' : '#F0F0F0',
  text: isDarkMode ? '#FFFFFF' : '#333333',
  card: isDarkMode ? '#1E1E1E' : '#FFFFFF',
  primary: '#007AFF',
  secondaryText: isDarkMode ? '#AAAAAA' : '#666666',
});

export default function OverviewScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const colors = getThemedColors(isDarkMode);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        FocusHub Overview
      </Text>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          Top Tasks
        </Text>
        <Text style={[styles.cardContent, { color: colors.secondaryText }]}>
          [Display task 1]
        </Text>
        <Text style={[styles.cardContent, { color: colors.secondaryText }]}>
          [Display task 2]
        </Text>
        <Text style={[styles.cardContent, { color: colors.secondaryText }]}>
          [Display task 3]
        </Text>
        <Link href="/tasks" style={[styles.link, { color: colors.primary }]}>
          Go to Full To-Do List
        </Link>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          Daily Motivation
        </Text>
        <Text style={[styles.cardContent, { color: colors.secondaryText }]}>
          [Preview of the daily quote or motivational content]
        </Text>
        <Link href="/motivation" style={[styles.link, { color: colors.primary }]}>
          Get Motivated
        </Link>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          Weather Preview
        </Text>
        <Text style={[styles.cardContent, { color: colors.secondaryText }]}>
          [Display current city and temperature from Weather State]
        </Text>
        <Text style={[styles.cardContent, { color: colors.secondaryText }]}>
          Example: Brampton, 0°C, Snow
        </Text>
        <Link href="/weather" style={[styles.link, { color: colors.primary }]}>
          View Full Weather Details
        </Link>
      </View>


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
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    paddingBottom: 5,
  },
  cardContent: {
    fontSize: 16,
    marginBottom: 4,
  },
  link: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'right',
  },
});