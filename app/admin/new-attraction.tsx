import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location'; // Importa a biblioteca de localização
import { useThemeStore } from '@/stores/theme';
import { useLocationStore } from '@/stores/location';
import { darkTheme, lightTheme } from '@/styles/theme';
import { router } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import { ArrowLeft } from 'lucide-react-native'; // Importa o ícone de seta

export default function NewAttraction() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;

  const preloadedLocation = useLocationStore((state) => state.location); // Obtém a localização pré-carregada
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    image: '',
    latitude: preloadedLocation?.latitude?.toString() || '0',
    longitude: preloadedLocation?.longitude?.toString() || '0',
  });

  const [loadingLocation, setLoadingLocation] = useState(!preloadedLocation);

  useEffect(() => {
    if (!preloadedLocation) {
      const getCurrentLocation = async () => {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert(
              'Permissão necessária',
              'Precisamos de acesso à sua localização para continuar.'
            );
            setLoadingLocation(false);
            return;
          }

          const location = await Location.getCurrentPositionAsync({});
          setForm((prev) => ({
            ...prev,
            latitude: location.coords.latitude.toString(),
            longitude: location.coords.longitude.toString(),
          }));
        } catch (error) {
          console.error('Erro ao obter localização:', error);
          Alert.alert('Erro', 'Não foi possível obter sua localização.');
        } finally {
          setLoadingLocation(false);
        }
      };

      getCurrentLocation();
    } else {
      setLoadingLocation(false);
    }
  }, [preloadedLocation]);

  const handleRegionChange = (region) => {
    setForm((prev) => ({
      ...prev,
      latitude: region.latitude.toString(),
      longitude: region.longitude.toString(),
    }));
  };

  const handleSubmit = async () => {
    if (
      !form.name ||
      !form.description ||
      !form.category ||
      !form.latitude ||
      !form.longitude
    ) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const lat = parseFloat(form.latitude);
    const lng = parseFloat(form.longitude);
    if (
      isNaN(lat) ||
      isNaN(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      Alert.alert('Erro', 'Coordenadas inválidas');
      return;
    }

    const newAttraction = {
      ...form,
      image: form.image || require('@/assets/images/AtNotFound.png'),
    };

    try {
      const storedAttractions = await AsyncStorage.getItem('attractions');
      const attractions = storedAttractions
        ? JSON.parse(storedAttractions)
        : [];

      attractions.push(newAttraction);

      await AsyncStorage.setItem('attractions', JSON.stringify(attractions));

      Alert.alert('Sucesso', 'Atração cadastrada com sucesso!');
      router.back();
    } catch (error) {
      console.error('Erro ao salvar atração:', error);
      Alert.alert('Erro', 'Não foi possível salvar a atração');
    }
  };

  if (loadingLocation) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Nova Atração
        </Text>
      </View>

      <ScrollView style={styles.form}>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: parseFloat(form.latitude) || 0,
              longitude: parseFloat(form.longitude) || 0,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            onRegionChangeComplete={handleRegionChange}
          >
            <Marker
              coordinate={{
                latitude: parseFloat(form.latitude) || 0,
                longitude: parseFloat(form.longitude) || 0,
              }}
              draggable
              onDragEnd={(e) => {
                const { latitude, longitude } = e.nativeEvent.coordinate;
                setForm((prev) => ({
                  ...prev,
                  latitude: latitude.toString(),
                  longitude: longitude.toString(),
                }));
              }}
            />
          </MapView>
        </View>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.card,
              color: theme.colors.text,
              borderColor: theme.colors.border,
            },
          ]}
          placeholder="Nome da atração"
          placeholderTextColor={theme.colors.textSecondary}
          value={form.name}
          onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
        />

        <TextInput
          style={[
            styles.input,
            styles.textArea,
            {
              backgroundColor: theme.colors.card,
              color: theme.colors.text,
              borderColor: theme.colors.border,
            },
          ]}
          placeholder="Descrição"
          placeholderTextColor={theme.colors.textSecondary}
          multiline
          numberOfLines={4}
          value={form.description}
          onChangeText={(text) =>
            setForm((prev) => ({ ...prev, description: text }))
          }
        />

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.card,
              color: theme.colors.text,
              borderColor: theme.colors.border,
            },
          ]}
          placeholder="Categoria"
          placeholderTextColor={theme.colors.textSecondary}
          value={form.category}
          onChangeText={(text) =>
            setForm((prev) => ({ ...prev, category: text }))
          }
        />

        <View style={styles.coordinates}>
          <TextInput
            style={[
              styles.input,
              styles.coordinateInput,
              {
                backgroundColor: theme.colors.card,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
            placeholder="Latitude"
            placeholderTextColor={theme.colors.textSecondary}
            keyboardType="numeric"
            value={parseFloat(form.latitude).toFixed(5)} // Mostra apenas 5 casas decimais
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, latitude: text }))
            }
          />

          <TextInput
            style={[
              styles.input,
              styles.coordinateInput,
              {
                backgroundColor: theme.colors.card,
                color: theme.colors.text,
                borderColor: theme.colors.border,
              },
            ]}
            placeholder="Longitude"
            placeholderTextColor={theme.colors.textSecondary}
            keyboardType="numeric"
            value={parseFloat(form.longitude).toFixed(5)} // Mostra apenas 5 casas decimais
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, longitude: text }))
            }
          />
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: theme.colors.primary },
          ]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Cadastrar Atração</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  form: {
    padding: 20,
  },
  coordinates: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  coordinateInput: {
    flex: 1,
    marginBottom: 0,
  },
  mapContainer: {
    height: 200,
    width: Dimensions.get('window').width - 40,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  map: {
    flex: 1,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  textArea: {
    height: 120,
    paddingTop: 12,
    paddingBottom: 12,
    textAlignVertical: 'top',
  },
  submitButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});
