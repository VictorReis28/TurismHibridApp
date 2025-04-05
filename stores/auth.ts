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
  isBiometricsEnabled: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithBiometrics: () => Promise<void>;
  logout: () => Promise<void>;
  checkBiometricsAvailable: () => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<void>;
  setupBiometrics: () => Promise<void>;
  toggleBiometrics: () => Promise<void>;
  updateUserAvatar: (avatarUri: string) => Promise<void>;
}

const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';
const BIOMETRICS_ENABLED_KEY = 'biometricsEnabled';

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  isBiometricsEnabled: false,

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

      const biometricsEnabled = await SecureStore.getItemAsync(`${BIOMETRICS_ENABLED_KEY}_${user.id}`);
      set({ isBiometricsEnabled: biometricsEnabled === 'true' });

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
                  await get().setupBiometrics();
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
      const { user } = get();
      if (!user) throw new Error('Usuário não encontrado');

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Confirme sua identidade',
      });

      if (result.success) {
        await SecureStore.setItemAsync(`${BIOMETRICS_ENABLED_KEY}_${user.id}`, 'true');
        set({ isBiometricsEnabled: true });
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

  toggleBiometrics: async () => {
    try {
      const { user, isBiometricsEnabled } = get();
      if (!user) throw new Error('Usuário não encontrado');

      if (!isBiometricsEnabled) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Confirme sua identidade para ativar a biometria',
        });

        if (result.success) {
          await SecureStore.setItemAsync(`${BIOMETRICS_ENABLED_KEY}_${user.id}`, 'true');
          set({ isBiometricsEnabled: true });
          Alert.alert('Sucesso', 'Autenticação biométrica ativada!');
        }
      } else {
        await SecureStore.deleteItemAsync(`${BIOMETRICS_ENABLED_KEY}_${user.id}`);
        set({ isBiometricsEnabled: false });
        Alert.alert('Sucesso', 'Autenticação biométrica desativada!');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao configurar biometria');
    }
  },

  loginWithBiometrics: async () => {
    try {
      const userJson = await SecureStore.getItemAsync(CURRENT_USER_KEY);
      if (!userJson) {
        throw new Error('Nenhum usuário encontrado para autenticação biométrica');
      }
      
      const user = JSON.parse(userJson);
      const biometricsEnabled = await SecureStore.getItemAsync(`${BIOMETRICS_ENABLED_KEY}_${user.id}`);
      
      if (biometricsEnabled !== 'true') {
        throw new Error('Autenticação biométrica não está configurada para este usuário');
      }

      const biometricAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Entrar com biometria',
        disableDeviceFallback: false,
      });

      if (biometricAuth.success) {
        set({ 
          isAuthenticated: true, 
          user,
          isBiometricsEnabled: true 
        });
      } else {
        throw new Error('Autenticação biométrica falhou');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Falha na autenticação biométrica');
    }
  },

  updateUserAvatar: async (avatarUri: string) => {
    try {
      const { user } = get();
      if (!user) throw new Error('Usuário não encontrado');

      // Update user in users store
      const usersJson = await SecureStore.getItemAsync(USERS_KEY);
      const users = usersJson ? JSON.parse(usersJson) : {};
      users[user.email] = { ...users[user.email], avatar: avatarUri };
      await SecureStore.setItemAsync(USERS_KEY, JSON.stringify(users));

      // Update current user
      const updatedUser = { ...user, avatar: avatarUri };
      await SecureStore.setItemAsync(CURRENT_USER_KEY, JSON.stringify(updatedUser));
      set({ user: updatedUser });
    } catch (error: any) {
      throw new Error('Falha ao atualizar avatar');
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync(CURRENT_USER_KEY);
    set({ isAuthenticated: false, user: null, isBiometricsEnabled: false });
  },

  checkBiometricsAvailable: async () => {
    if (Platform.OS === 'web') return false;
    
    const { user } = get();
    if (!user) return false;

    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    const isEnabled = await SecureStore.getItemAsync(`${BIOMETRICS_ENABLED_KEY}_${user.id}`);
    return hasHardware && isEnrolled && isEnabled === 'true';
  },
}));