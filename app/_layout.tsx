import { useState, useEffect } from 'react';
import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from '@/stores/auth';
import { Image } from 'expo-image';
import { View, StyleSheet } from 'react-native';

export default function RootLayout() {
  useFrameworkReady();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
  });

  const [showSplash, setShowSplash] = useState(true); // Estado para controlar a splash screen

  useEffect(() => {
    if (fontsLoaded) {
      const timer = setTimeout(() => {
        setShowSplash(false); // Oculta a splash screen após 3 segundos
      }, 3000);

      return () => clearTimeout(timer); // Limpa o timer ao desmontar o componente
    }
  }, [fontsLoaded]);

  if (showSplash) {
    return (
      <View style={styles.splashContainer}>
        <Image
          source={require('../assets/images/Splash.gif')}
          style={styles.splashImage}
          contentFit="contain" // ou "contain", dependendo do comportamento desejado
        />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {!isAuthenticated ? <Redirect href="/(auth)/login" /> : null}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="admin" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0d1d37', // Substitua por um tom de azul que combine com a imagem
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  splashImage: {
    width: '85%',
    height: '85%',
    resizeMode: 'contain', // ou 'contain', dependendo do comportamento desejado
  },
});
