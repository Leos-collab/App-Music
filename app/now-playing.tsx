import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, LayoutChangeEvent } from 'react-native';
import { colors } from '../src/theme/colors';
import { typography } from '../src/theme/typography';
import { router } from 'expo-router';
import { usePlayerStore } from '../src/store/playerStore';
import { Ionicons } from '@expo/vector-icons';

export default function NowPlayingModal() {
  const {
    currentTrack,
    isPlaying,
    pause,
    resume,
    playNext,
    playPrevious,
    position,
    duration,
    seek,
    isShuffle,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
  } = usePlayerStore();

  const [barWidth, setBarWidth] = useState(0);

  if (!currentTrack) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Nenhuma música tocando</Text>
        <Pressable onPress={() => router.back()} style={styles.button}>
          <Text style={styles.buttonText}>Fechar</Text>
        </Pressable>
      </View>
    );
  }

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSeekPress = (event: any) => {
    if (barWidth <= 0 || duration <= 0) return;
    const clickX = event.nativeEvent.locationX;
    const progress = Math.max(0, Math.min(1, clickX / barWidth));
    const targetSeconds = (duration / 1000) * progress;
    seek(targetSeconds);
  };

  const handleBarLayout = (e: LayoutChangeEvent) => {
    setBarWidth(e.nativeEvent.layout.width);
  };

  const renderRepeatIcon = () => {
    if (repeatMode === 'off') {
      return <Ionicons name="repeat" size={24} color={colors.textMuted} />;
    } else if (repeatMode === 'all') {
      return <Ionicons name="repeat" size={24} color={colors.primary} />;
    } else {
      // mode === 'one'
      return (
        <View style={styles.repeatOneContainer}>
          <Ionicons name="repeat" size={24} color={colors.primary} />
          <Text style={styles.repeatOneBadge}>1</Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-down" size={32} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Now Playing</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.coverPlaceholder}>
        <Ionicons name="musical-notes" size={100} color={colors.primary} />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.trackTitle} numberOfLines={1}>{currentTrack.title}</Text>
        <Text style={styles.trackArtist} numberOfLines={1}>{currentTrack.artist}</Text>
      </View>

      {/* Barra de progresso interativa para avançar e retroceder */}
      <View style={styles.progressContainer}>
        <Pressable 
          onPress={handleSeekPress} 
          onLayout={handleBarLayout}
          style={styles.progressBarTouchArea}
        >
          <View style={styles.progressBarBackground}>
            <View 
              style={[
                styles.progressBarFill, 
                { width: `${duration > 0 ? (position / duration) * 100 : 0}%` }
              ]} 
            />
          </View>
        </Pressable>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      {/* Controles Principais com Aleatório e Repeat */}
      <View style={styles.controls}>
        {/* Botão Aleatório */}
        <Pressable onPress={toggleShuffle} style={styles.secondaryButton}>
          <Ionicons 
            name="shuffle" 
            size={24} 
            color={isShuffle ? colors.primary : colors.textMuted} 
          />
        </Pressable>

        {/* Anterior */}
        <Pressable onPress={playPrevious} style={styles.controlButton}>
          <Ionicons name="play-skip-back" size={36} color={colors.text} />
        </Pressable>

        {/* Play/Pause */}
        <Pressable onPress={isPlaying ? pause : resume} style={styles.playButton}>
          <Ionicons name={isPlaying ? "pause" : "play"} size={44} color={colors.background} />
        </Pressable>

        {/* Próxima */}
        <Pressable onPress={playNext} style={styles.controlButton}>
          <Ionicons name="play-skip-forward" size={36} color={colors.text} />
        </Pressable>

        {/* Botão Repeat (Desativado / Playlist / 1 Música) */}
        <Pressable onPress={toggleRepeat} style={styles.secondaryButton}>
          {renderRepeatIcon()}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  headerTitle: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.secondaryMedium,
    fontSize: typography.sizes.md,
  },
  coverPlaceholder: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.surfaceHighlight,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  trackTitle: {
    color: colors.text,
    fontFamily: typography.fonts.primaryBold,
    fontSize: typography.sizes.xl,
    marginBottom: 8,
  },
  trackArtist: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.secondary,
    fontSize: typography.sizes.lg,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBarTouchArea: {
    paddingVertical: 10, // Aumenta área de toque para facilidade no uso
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: colors.surfaceHighlight,
    borderRadius: 3,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  timeText: {
    color: colors.textMuted,
    fontFamily: typography.fonts.mono,
    fontSize: typography.sizes.xs,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  secondaryButton: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
  },
  controlButton: {
    padding: 8,
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 3,
  },
  repeatOneContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  repeatOneBadge: {
    position: 'absolute',
    color: colors.primary,
    fontSize: 10,
    fontFamily: typography.fonts.primaryBold,
    top: 4,
  },
  title: {
    color: colors.text,
    fontFamily: typography.fonts.primaryBold,
    fontSize: typography.sizes.lg,
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.surfaceHighlight,
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: colors.text,
    fontFamily: typography.fonts.primary,
  }
});
