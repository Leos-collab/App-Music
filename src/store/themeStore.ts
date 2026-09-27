import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AccentKey =
  | 'cyan'
  | 'violet'
  | 'rose'
  | 'amber'
  | 'emerald'
  | 'indigo';

export type BackgroundKey =
  | 'obsidian'
  | 'midnight'
  | 'forest'
  | 'wine'
  | 'slate'
  | 'void';

export interface ThemeAccent {
  key: AccentKey;
  label: string;
  primary: string;
  primaryVariant: string;
  secondary: string;
}

export interface ThemeBackground {
  key: BackgroundKey;
  label: string;
  background: string;
  surface: string;
  surfaceHighlight: string;
  border: string;
}

export const ACCENTS: ThemeAccent[] = [
  { key: 'cyan',    label: 'Ciano',      primary: '#00E5FF', primaryVariant: '#00B8D4', secondary: '#00E676' },
  { key: 'violet',  label: 'Violeta',    primary: '#C77DFF', primaryVariant: '#9D4EDD', secondary: '#E040FB' },
  { key: 'rose',    label: 'Rosa',       primary: '#FF4D8D', primaryVariant: '#E91E8C', secondary: '#FF80AB' },
  { key: 'amber',   label: 'Ambar',      primary: '#FFB300', primaryVariant: '#FF8F00', secondary: '#FFD740' },
  { key: 'emerald', label: 'Esmeralda',  primary: '#00E676', primaryVariant: '#00C853', secondary: '#69F0AE' },
  { key: 'indigo',  label: 'Indigo',     primary: '#7986CB', primaryVariant: '#5C6BC0', secondary: '#B39DDB' },
];

export const BACKGROUNDS: ThemeBackground[] = [
  { key: 'obsidian', label: 'Obsidiana',  background: '#0B0D17', surface: '#15192B', surfaceHighlight: '#1E243D', border: '#2C3454' },
  { key: 'midnight', label: 'Meia-noite', background: '#060714', surface: '#0D0F22', surfaceHighlight: '#161839', border: '#222549' },
  { key: 'forest',   label: 'Floresta',   background: '#071210', surface: '#0E1F1C', surfaceHighlight: '#162E29', border: '#1F4038' },
  { key: 'wine',     label: 'Vinho',      background: '#120A12', surface: '#1E1020', surfaceHighlight: '#2A1530', border: '#3D1F45' },
  { key: 'slate',    label: 'Ardosia',    background: '#0D1117', surface: '#161B22', surfaceHighlight: '#21262D', border: '#30363D' },
  { key: 'void',     label: 'Vazio',      background: '#000000', surface: '#0A0A0A', surfaceHighlight: '#141414', border: '#222222' },
];

export interface UserProfile {
  name: string;
  avatarEmoji: string;
}

interface ThemeState {
  accentKey: AccentKey;
  backgroundKey: BackgroundKey;
  backgroundImageUrl: string | null;
  profile: UserProfile;
  isLoaded: boolean;
  setAccent: (key: AccentKey) => void;
  setBackground: (key: BackgroundKey) => void;
  setBackgroundImage: (url: string | null) => void;
  setProfile: (profile: Partial<UserProfile>) => void;
  load: () => Promise<void>;
}

const STORAGE_KEY = 'sonicpulse_theme_v2';

export const useThemeStore = create<ThemeState>((set, get) => ({
  accentKey: 'cyan',
  backgroundKey: 'obsidian',
  backgroundImageUrl: null,
  profile: { name: 'Ouvinte', avatarEmoji: '🎵' },
  isLoaded: false,

  setAccent: (key) => {
    set({ accentKey: key });
    _persist(get);
  },

  setBackground: (key) => {
    set({ backgroundKey: key });
    _persist(get);
  },

  setBackgroundImage: (url) => {
    set({ backgroundImageUrl: url });
    _persist(get);
  },

  setProfile: (partial) => {
    set((s) => ({ profile: { ...s.profile, ...partial } }));
    _persist(get);
  },

  load: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        set({
          accentKey: data.accentKey ?? 'cyan',
          backgroundKey: data.backgroundKey ?? 'obsidian',
          backgroundImageUrl: data.backgroundImageUrl ?? null,
          profile: data.profile ?? { name: 'Ouvinte', avatarEmoji: '🎵' },
        });
      }
    } catch (e) {
      console.warn('Failed to load theme', e);
    } finally {
      set({ isLoaded: true });
    }
  },
}));

function _persist(get: () => ThemeState) {
  const { accentKey, backgroundKey, backgroundImageUrl, profile } = get();
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ accentKey, backgroundKey, backgroundImageUrl, profile })).catch(
    (e) => console.warn('Failed to save theme', e)
  );
}

/** Returns resolved color tokens based on current theme */
export function resolveTheme(accentKey: AccentKey, backgroundKey: BackgroundKey, hasImage: boolean = false) {
  const accent = ACCENTS.find((a) => a.key === accentKey) ?? ACCENTS[0];
  const bg = BACKGROUNDS.find((b) => b.key === backgroundKey) ?? BACKGROUNDS[0];
  
  // Se tivermos imagem de fundo, deixamos as superfícies translúcidas e o fundo 100% transparente
  // O escurecimento (overlay) será feito apenas na raiz do app para não somar camadas
  const bgBase = hasImage ? 'transparent' : bg.background;
  
  return {
    background: bgBase,
    surface: hasImage ? 'rgba(0, 0, 0, 0.5)' : bg.surface,
    surfaceHighlight: hasImage ? 'rgba(255, 255, 255, 0.1)' : bg.surfaceHighlight,
    border: hasImage ? 'rgba(255, 255, 255, 0.15)' : bg.border,
    primary: accent.primary,
    primaryVariant: accent.primaryVariant,
    secondary: accent.secondary,
    danger: '#FF1744',
    text: '#FFFFFF',
    textSecondary: '#A0AABF',
    textMuted: '#6B728E',
    accent: '#FF4081',
  };
}

