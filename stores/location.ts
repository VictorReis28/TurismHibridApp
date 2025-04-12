import { create } from 'zustand';

export const useLocationStore = create((set) => ({
  location: null, // Estado inicial da localização
  setLocation: (location) => set({ location }), // Função para atualizar a localização
}));
