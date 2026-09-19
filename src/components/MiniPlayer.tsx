import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { usePlayerStore } from '../store/playerStore';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function MiniPlayer() {
  const { currentTrack, isPlaying, pause, resume, playNext } = usePlayerStore();
  const insets = useSafeAreaInsets();

  if (!currentTrack) return null;

  const handlePlayPause = (e: any) => {
    e.stopPropagation(); // Evitar abrir a tela Now Playing
    if (isPlaying) {
      pause();
    } else {
      resume();
    }
  };

  const handleNext = (e: any) => {
    e.stopPropagation();
    playNext();
  };

  return (
    <Pressable 
      style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]} 
      onPress={() => router.push('/now-playing')}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="musical-notes" size={20} color={colors.primary} />
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={1}>{currentTrack.title}</Text>
          <Text style={styles.artist} numberOfLines={1}>{currentTrack.artist}</Text>
        </View>

        <View style={styles.controls}>
          <Pressable style={styles.button} onPress={handlePlayPause}>
            <Ionicons name={isPlaying ? "pause" : "play"} size={26} color={colors.text} />
          </Pressable>
          <Pressable style={styles.button} onPress={handleNext}>
            <Ionicons name="play-skip-forward" size={22} color={colors.text} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceHighlight,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  content: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: colors.text,
    fontFamily: typography.fonts.primaryBold,
    fontSize: typography.sizes.sm,
  },
  artist: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.secondary,
    fontSize: typography.sizes.xs,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  }
});

