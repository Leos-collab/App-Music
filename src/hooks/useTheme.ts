import { useThemeStore, resolveTheme } from '../store/themeStore';

/**
 * Returns the currently active color tokens.
 * Use this instead of importing `colors` directly so the UI reacts to theme changes.
 */
export function useTheme() {
  const accentKey = useThemeStore((s) => s.accentKey);
  const backgroundKey = useThemeStore((s) => s.backgroundKey);
  const backgroundImageUrl = useThemeStore((s) => s.backgroundImageUrl);
  return resolveTheme(accentKey, backgroundKey, !!backgroundImageUrl);
}
