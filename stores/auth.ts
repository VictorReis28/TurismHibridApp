import { create } from 'zustand';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { Alert, Platform } from 'react-native';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithBiometrics: () => Promise<void>;
  logout: () => Promise<void>;
  checkBiometricsAvailable: () => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<void>;
  setupBiometrics: () => Promise<void>;
}

const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';
const BIOMETRICS_ENABLED_KEY = 'biometricsEnabled';

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,

  login: async (email: string, password: string) => {
    try {
      const usersJson = await SecureStore.getItemAsync(USERS_KEY);
      const users = usersJson ? JSON.parse(usersJson) : {};

      if (!users[email]) {
        throw new Error('Usuário não encontrado');
      }

      if (users[email].password !== password) {
        throw new Error('Senha incorreta');
      }

      const user: User = {
        id: users[email].id,
        email,
        name: users[email].name,
        avatar: users[email].avatar,
      };

      await SecureStore.setItemAsync(CURRENT_USER_KEY, JSON.stringify(user));
      set({ isAuthenticated: true, user });

      // Check if biometrics is available and not yet set up
      const biometricsEnabled = await SecureStore.getItemAsync(BIOMETRICS_ENABLED_KEY);
      if (!biometricsEnabled && Platform.OS !== 'web') {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        
        if (hasHardware && isEnrolled) {
          Alert.alert(
            'Autenticação Biométrica',
            'Deseja usar sua biometria para fazer login mais rapidamente nas próximas vezes?',
            [
              {
                text: 'Agora não',
                style: 'cancel'
              },
              {
                text: 'Configurar',
                onPress: async () => {
                  await useAuthStore.getState().setupBiometrics();
                }
              }
            ]
          );
        }
      }
    } catch (error: any) {
      throw new Error(error.message || 'Falha no login');
    }
  },

  register: async (email: string, password: string, name: string) => {
    try {
      const usersJson = await SecureStore.getItemAsync(USERS_KEY);
      const users = usersJson ? JSON.parse(usersJson) : {};

      if (users[email]) {
        throw new Error('Email já cadastrado');
      }

      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        name,
      };

      users[email] = newUser;
      await SecureStore.setItemAsync(USERS_KEY, JSON.stringify(users));

      const user: User = {
        id: newUser.id,
        email,
        name,
      };

      await SecureStore.setItemAsync(CURRENT_USER_KEY, JSON.stringify(user));
      set({ isAuthenticated: true, user });
    } catch (error: any) {
      throw new Error(error.message || 'Falha no cadastro');
    }
  },

  setupBiometrics: async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Confirme sua identidade',
      });

      if (result.success) {
        await SecureStore.setItemAsync(BIOMETRICS_ENABLED_KEY, 'true');
        Alert.alert(
          'Sucesso',
          'Autenticação biométrica configurada com sucesso!'
        );
      }
    } catch (error) {
      Alert.alert(
        'Erro',
        'Não foi possível configurar a autenticação biométrica'
      );
    }
  },

  loginWithBiometrics: async () => {
    try {
      const biometricAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Entrar com biometria',
        disableDeviceFallback: false,
      });

      if (biometricAuth.success) {
        const userJson = await SecureStore.getItemAsync(CURRENT_USER_KEY);
        if (!userJson) {
          throw new Error('Nenhum usuário encontrado para autenticação biométrica');
        }
        const user = JSON.parse(userJson);
        set({ isAuthenticated: true, user });
      } else {
        throw new Error('Autenticação biométrica falhou');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Falha na autenticação biométrica');
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync(CURRENT_USER_KEY);
    set({ isAuthenticated: false, user: null });
  },

  checkBiometricsAvailable: async () => {
    if (Platform.OS === 'web') return false;
    
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    const isEnabled = await SecureStore.getItemAsync(BIOMETRICS_ENABLED_KEY);
    return hasHardware && isEnrolled && isEnabled === 'true';
  },
}));