import { Tabs } from 'expo-router';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { typography } from '../../src/theme/typography';
import { Ionicons } from '@expo/vector-icons';
import { MiniPlayer } from '../../src/components/MiniPlayer';
import { useTheme } from '../../src/hooks/useTheme';
import { useThemeStore } from '../../src/store/themeStore';

export default function TabLayout() {
  const colors = useTheme();
  const backgroundImageUrl = useThemeStore(s => s.backgroundImageUrl);

  const renderContent = () => (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarLabelStyle: {
            fontFamily: typography.fonts.secondaryMedium,
            fontSize: 12,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Biblioteca',
            tabBarIcon: ({ color }) => <Ionicons name="library" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Buscar',
            tabBarIcon: ({ color }) => <Ionicons name="search" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="playlists"
          options={{
            title: 'Playlists',
            tabBarIcon: ({ color }) => <Ionicons name="list" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="equalizer"
          options={{
            title: 'Equalizador',
            tabBarIcon: ({ color }) => <Ionicons name="options" size={24} color={color} />,
          }}
        />
      </Tabs>
      <MiniPlayer />
    </>
  );

  if (backgroundImageUrl) {
    return (
      <ImageBackground source={{ uri: backgroundImageUrl }} style={styles.container} blurRadius={10}>
        <View style={[styles.overlay, { backgroundColor: colors.background }]}>
          {renderContent()}
        </View>
      </ImageBackground>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  }
});
