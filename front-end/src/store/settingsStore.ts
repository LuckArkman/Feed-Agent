import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserPreferences {
  tableDensity: 'compact' | 'comfortable';
  imageZoomDefault: number; // 100 to 200
  autoSaveDrafts: boolean;
}

interface SettingsState {
  preferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
}

const defaultPreferences: UserPreferences = {
  tableDensity: 'comfortable',
  imageZoomDefault: 100,
  autoSaveDrafts: true,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      preferences: defaultPreferences,
      
      updatePreferences: (newPrefs) => set((state) => ({
        preferences: { ...state.preferences, ...newPrefs },
      })),

      resetPreferences: () => set({ preferences: defaultPreferences }),
    }),
    {
      name: 'feedagent-preferences-storage', // Key inside localStorage
    }
  )
);

export default useSettingsStore;
