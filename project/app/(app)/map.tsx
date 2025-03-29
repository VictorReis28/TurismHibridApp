import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, Pressable } from 'react-native';
import { Image } from 'expo-image';
import * as Location from 'expo-location';
import { useThemeStore } from '@/stores/theme';
import { darkTheme, lightTheme } from '@/styles/theme';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import { Star, Navigation, ChevronUp } from 'lucide-react-native';
import { Map } from '@/components/Map';
import { attractions, calculateDistance } from '@/components/data/attractions';
import { mapStyles as styles } from '@/styles/screens/app/map.styles';

const { height } = Dimensions.get('window');

export default function MapScreen() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const bottomSheetHeight = useSharedValue(height * 0.3);
  const isExpanded = useSharedValue(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      }
    })();
  }, []);

  const toggleBottomSheet = () => {
    const newHeight = isExpanded.value ? height * 0.3 : height * 0.7;
    bottomSheetHeight.value = withSpring(newHeight);
    isExpanded.value = !isExpanded.value;
  };

  const bottomSheetStyle = useAnimatedStyle(() => ({
    height: bottomSheetHeight.value,
  }));

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Map
        style={styles.map}
        location={
          location
            ? {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }
            : undefined
        }
        markers={[
          ...(location
            ? [
                {
                  id: 'current',
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  title: 'Você está aqui',
                },
              ]
            : []),
          ...attractions.map((attraction) => ({
            id: attraction.id,
            latitude: attraction.coordinates.latitude,
            longitude: attraction.coordinates.longitude,
            title: attraction.name,
          })),
        ]}
      />

      <Animated.View
        style={[
          styles.bottomSheet,
          bottomSheetStyle,
          { backgroundColor: theme.colors.card }
        ]}>
        <Pressable onPress={toggleBottomSheet} style={styles.bottomSheetHeader}>
          <View style={[styles.bottomSheetHandle, { backgroundColor: theme.colors.border }]} />
          <ChevronUp size={24} color={theme.colors.text} />
          <Text style={[styles.bottomSheetTitle, { color: theme.colors.text }]}>
            Melhores Atrações Próximas
          </Text>
        </Pressable>

        {attractions.map((attraction) => {
          const distance = calculateDistance(location, attraction);

          return (
            <Pressable
              key={attraction.id}
              style={[
                styles.attractionItem,
                { borderBottomColor: theme.colors.border }
              ]}>
              <Image
                source={{ uri: attraction.image }}
                style={styles.attractionImage}
                contentFit="cover"
              />
              <View style={styles.attractionInfo}>
                <Text style={[styles.attractionName, { color: theme.colors.text }]}>
                  {attraction.name}
                </Text>
                <View style={styles.attractionDetails}>
                  <View style={styles.rating}>
                    <Star size={16} color="#FFD700" fill="#FFD700" />
                    <Text style={[styles.ratingText, { color: theme.colors.text }]}>
                      {attraction.rating}
                    </Text>
                  </View>
                  <View style={styles.distance}>
                    <Navigation size={16} color={theme.colors.textSecondary} />
                    <Text style={[styles.distanceText, { color: theme.colors.textSecondary }]}>
                      {distance} km
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          );
        })}
      </Animated.View>
    </View>
  );
}