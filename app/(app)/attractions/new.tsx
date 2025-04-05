import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useThemeStore } from '@/stores/theme';
import { darkTheme, lightTheme } from '@/styles/theme';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';

export default function NewAttraction() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    image: '',
    latitude: '',
    longitude: '',
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setForm((prev) => ({ ...prev, image: result.assets[0].uri }));
    }
  };

  const handleSubmit = () => {
    // Validate form
    if (
      !form.name ||
      !form.description ||
      !form.category ||
      !form.image ||
      !form.latitude ||
      !form.longitude
    ) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    // Validate coordinates
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

    // TODO: Implement attraction creation
    Alert.alert('Sucesso', 'Atração cadastrada com sucesso!');
    router.back();
  };

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
        <TouchableOpacity
          style={[styles.imageUpload, { backgroundColor: theme.colors.card }]}
          onPress={pickImage}
        >
          {form.image ? (
            <Image
              source={{ uri: form.image }}
              style={styles.previewImage}
              contentFit="cover"
            />
          ) : (
            <Text
              style={[
                styles.imageUploadText,
                { color: theme.colors.textSecondary },
              ]}
            >
              Toque para adicionar uma imagem
            </Text>
          )}
        </TouchableOpacity>

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
            value={form.latitude}
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
            value={form.longitude}
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
  imageUpload: {
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  imageUploadText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  previewImage: {
    width: '100%',
    height: '100%',
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
  coordinates: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  coordinateInput: {
    flex: 1,
    marginBottom: 0,
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
