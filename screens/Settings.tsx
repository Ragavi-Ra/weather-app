import React, { useState } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const newsCategories = [
  'General',
  'Technology',
  'Sports',
  'Health',
  'Business',
  'Entertainment',
  'Science',
];

const PreferencesScreen = () => {
  const [isCelsius, setIsCelsius] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Preferences</Text>

      {/* Temperature Unit Toggle */}
      <View style={styles.preferenceItem}>
        <Text style={styles.label}>Temperature Unit</Text>
        <View style={styles.switchRow}>
          <Text style={styles.unitLabel}>°C</Text>
          <Switch
            value={!isCelsius}
            onValueChange={() => setIsCelsius((prev) => !prev)}
          />
          <Text style={styles.unitLabel}>°F</Text>
        </View>
      </View>

      {/* News Categories */}
      <Text style={[styles.label, { marginTop: 20 }]}>News Categories</Text>
      {newsCategories.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.categoryButton,
            selectedCategories.includes(category) && styles.categorySelected,
          ]}
          onPress={() => toggleCategory(category)}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategories.includes(category) && styles.categoryTextSelected,
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default PreferencesScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    minHeight: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 30,
    textAlign: 'center',
  },
  preferenceItem: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  unitLabel: {
    fontSize: 16,
  },
  categoryButton: {
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  categorySelected: {
    backgroundColor: '#007BFF20',
    borderColor: '#007BFF',
  },
  categoryText: {
    fontSize: 16,
    color: '#333',
  },
  categoryTextSelected: {
    fontWeight: '700',
    color: '#007BFF',
  },
});
