import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, router } from 'expo-router';
import { useThemeStore } from '@/stores/theme';
import { darkTheme, lightTheme } from '@/styles/theme';
import { Star, Navigation, ArrowLeft } from 'lucide-react-native';
import { attractions } from '@/components/data/attractions';
import * as Location from 'expo-location';

export default function AttractionDetails() {
  const { id } = useLocalSearchParams();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;
  
  const attraction = attractions.find(a => a.id === id);
  
  if (!attraction) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>Atração não encontrada</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TouchableOpacity 
        style={[styles.backButton, { backgroundColor: theme.colors.card }]}
        onPress={() => router.back()}
      >
        <ArrowLeft size={24} color={theme.colors.text} />
      </TouchableOpacity>

      <ScrollView style={styles.scrollView}>
        <Image
          source={{ uri: attraction.image }}
          style={styles.image}
          contentFit="cover"
        />

        <View style={styles.content}>
          <View style={[styles.categoryBadge, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.categoryText}>{attraction.category}</Text>
          </View>

          <Text style={[styles.name, { color: theme.colors.text }]}>{attraction.name}</Text>

          <View style={styles.ratingContainer}>
            <View style={styles.rating}>
              <Star size={20} color="#FFD700" fill="#FFD700" />
              <Text style={[styles.ratingText, { color: theme.colors.text }]}>
                {attraction.rating}
              </Text>
              <Text style={[styles.reviewCount, { color: theme.colors.textSecondary }]}>
                ({attraction.reviews.toLocaleString()} avaliações)
              </Text>
            </View>
          </View>

          <Text style={[styles.description, { color: theme.colors.text }]}>
            {attraction.description}
          </Text>

          <View style={[styles.locationCard, { backgroundColor: theme.colors.card }]}>
            <Navigation size={20} color={theme.colors.primary} />
            <Text style={[styles.locationText, { color: theme.colors.text }]}>
              Latitude: {attraction.coordinates.latitude}
              {'\n'}
              Longitude: {attraction.coordinates.longitude}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
    padding: 12,
    borderRadius: 30,
  },
  image: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 20,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  name: {
    fontSize: 28,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    marginBottom: 12,
  },
  ratingContainer: {
    marginBottom: 16,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingText: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
  },
  reviewCount: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    lineHeight: 24,
    marginBottom: 24,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
    marginTop: 20,
  },
});