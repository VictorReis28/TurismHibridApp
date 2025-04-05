import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useThemeStore } from '@/stores/theme';
import { darkTheme, lightTheme } from '@/styles/theme';
import { CirclePlus as PlusCircle, Trash2 } from 'lucide-react-native';

export default function AdminScreen() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Administração</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Gerencie as atrações turísticas
        </Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={() => router.push('/admin/new-attraction')}
        >
          <PlusCircle size={24} color="#FFF" />
          <Text style={styles.buttonText}>Adicionar Atração</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.error }]}
          onPress={() => router.push('/admin/delete-attractions')}
        >
          <Trash2 size={24} color="#FFF" />
          <Text style={styles.buttonText}>Remover Atrações</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  content: {
    padding: 20,
    gap: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});