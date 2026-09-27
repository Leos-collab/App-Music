import { Stack } from 'expo-router';
import { View, ImageBackground } from 'react-native';
import { useFonts, PlusJakartaSans_400Regular, PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans';
import { Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useThemeStore } from '../src/store/themeStore';
import { useTheme } from '../src/hooks/useTheme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    'PlusJakartaSans-Regular': PlusJakartaSans_400Regular,
    'PlusJakartaSans-Bold': PlusJakartaSans_700Bold,
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
  });

  const { load: loadTheme, isLoaded: isThemeLoaded } = useThemeStore();
  const colors = useTheme();
  const backgroundImageUrl = useThemeStore((s) => s.backgroundImageUrl);

  useEffect(() => {
    loadTheme();
  }, []);

  useEffect(() => {
    if (loaded && isThemeLoaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isThemeLoaded]);

  if (!loaded || !isThemeLoaded) {
    return null;
  }

  const renderStack = () => (
    <>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="now-playing" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="playlist/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ presentation: 'modal', headerShown: false }} />
      </Stack>
    </>
  );

  if (backgroundImageUrl) {
    return (
      <ImageBackground
        source={{ uri: backgroundImageUrl }}
        style={{ flex: 1 }}
        blurRadius={4}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }}>
          {renderStack()}
        </View>
      </ImageBackground>
    );
  }

  return renderStack();
}
