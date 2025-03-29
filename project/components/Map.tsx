import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { useThemeStore } from '@/stores/theme';
import { darkTheme, lightTheme } from '@/styles/theme';
import * as Location from 'expo-location';

interface MapProps {
  style?: any;
  location?: { latitude: number; longitude: number };
  markers?: Array<{
    id: string;
    latitude: number;
    longitude: number;
    title: string;
  }>;
}

export function Map({ style, location, markers }: MapProps) {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;

  if (Platform.OS === 'web') {
    const center = location || { latitude: 48.8584, longitude: 2.2945 };
    const zoom = 13;

    const markersString = markers
      ?.map(
        (marker) =>
          `&markers=color:red%7Clabel:${marker.title.charAt(0)}%7C${
            marker.latitude
          },${marker.longitude}`
      )
      .join('');

    const mapStyle = isDarkMode
      ? '&style=element:geometry%7Ccolor:0x212121&style=element:labels.icon%7Cvisibility:off&style=element:labels.text.fill%7Ccolor:0x757575&style=element:labels.text.stroke%7Ccolor:0x212121&style=feature:administrative%7Celement:geometry%7Ccolor:0x757575&style=feature:administrative.country%7Celement:labels.text.fill%7Ccolor:0x9e9e9e&style=feature:administrative.land_parcel%7Cvisibility:off&style=feature:administrative.locality%7Celement:labels.text.fill%7Ccolor:0xbdbdbd&style=feature:poi%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:poi.park%7Celement:geometry%7Ccolor:0x181818&style=feature:poi.park%7Celement:labels.text.fill%7Ccolor:0x616161&style=feature:poi.park%7Celement:labels.text.stroke%7Ccolor:0x1b1b1b&style=feature:road%7Celement:geometry.fill%7Ccolor:0x2c2c2c&style=feature:road%7Celement:labels.text.fill%7Ccolor:0x8a8a8a&style=feature:road.arterial%7Celement:geometry%7Ccolor:0x373737&style=feature:road.highway%7Celement:geometry%7Ccolor:0x3c3c3c&style=feature:road.highway.controlled_access%7Celement:geometry%7Ccolor:0x4e4e4e&style=feature:road.local%7Celement:labels.text.fill%7Ccolor:0x616161&style=feature:transit%7Celement:labels.text.fill%7Ccolor:0x757575&style=feature:water%7Celement:geometry%7Ccolor:0x000000&style=feature:water%7Celement:labels.text.fill%7Ccolor:0x3d3d3d'
      : '';

    return (
      <View
        style={[
          styles.container,
          style,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <div style={{ width: '100%', height: '100%' }}>
          <iframe
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps/embed/v1/view?key=YOUR_GOOGLE_MAPS_API_KEY&center=${
              center.latitude
            },${center.longitude}&zoom=${zoom}${
              markersString || ''
            }${mapStyle}`}
          />
        </div>
      </View>
    );
  }

  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    const MapView = require('react-native-maps').default;
    const { Marker } = require('react-native-maps');

    return (
      <View style={[styles.container, style]}>
        <MapView
          style={styles.map}
          showsUserLocation
          followsUserLocation
          initialRegion={{
            latitude: location?.latitude || -23.5505,
            longitude: location?.longitude || -46.6333,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          customMapStyle={isDarkMode ? darkMapStyle : []}
        >
          {markers?.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              title={marker.title}
            />
          ))}
        </MapView>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

const darkMapStyle = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#212121' }],
  },
  {
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#757575' }],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#212121' }],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [{ color: '#757575' }],
  },
];
