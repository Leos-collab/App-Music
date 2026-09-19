import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, Pressable } from 'react-native';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { useLibraryStore } from '../../src/store/libraryStore';
import { usePlayerStore } from '../../src/store/playerStore';
import { Ionicons } from '@expo/vector-icons';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const { tracks, toggleFavorite } = useLibraryStore();
  const { playTrack, currentTrack, isPlaying } = usePlayerStore();

  const filteredTracks = query.trim() === '' 
    ? [] 
    : tracks.filter((t) => 
        t.title.toLowerCase().includes(query.toLowerCase()) || 
        t.artist.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar título ou artista..."
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color={colors.textMuted} />
          </Pressable>
        )}
      </View>

      {query.trim() === '' ? (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={64} color={colors.border} />
          <Text style={styles.subtitle}>Digite o nome da música ou artista</Text>
          <Text style={styles.hint}>Busque em toda sua biblioteca de músicas baixadas.</Text>
        </View>
      ) : filteredTracks.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="sad-outline" size={64} color={colors.border} />
          <Text style={styles.subtitle}>Nenhuma música encontrada</Text>
          <Text style={styles.hint}>Tente buscar por outro termo.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredTracks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isActive = currentTrack?.id === item.id;
            const isFav = item.isFavorite;
            return (
              <Pressable
                style={[styles.trackItem, isActive && styles.trackItemActive]}
                onPress={() => playTrack(item, filteredTracks)}
              >
                <View style={styles.trackIcon}>
                  {isActive && isPlaying ? (
                    <Ionicons name="volume-high" size={24} color={colors.secondary} />
                  ) : (
                    <Ionicons name="musical-note" size={24} color={isActive ? colors.secondary : colors.primary} />
                  )}
                </View>
                <View style={styles.trackInfo}>
                  <Text style={[styles.trackTitle, isActive && { color: colors.secondary }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.trackArtist} numberOfLines={1}>{item.artist}</Text>
                </View>
                <Pressable onPress={() => toggleFavorite(item.id)} style={styles.favoriteButton}>
                  <Ionicons name={isFav ? "heart" : "heart-outline"} size={22} color={isFav ? "#FF4081" : colors.textMuted} />
                </Pressable>
              </Pressable>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceHighlight,
    borderRadius: 12,
    margin: 16,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontFamily: typography.fonts.secondaryMedium,
    fontSize: typography.sizes.md,
  },
  clearButton: {
    padding: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  subtitle: {
    fontFamily: typography.fonts.secondaryMedium,
    fontSize: typography.sizes.lg,
    color: colors.text,
    marginTop: 16,
    textAlign: 'center',
  },
  hint: {
    fontFamily: typography.fonts.secondary,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  trackItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
  },
  trackIcon: {
    width: 48,
    height: 48,
    backgroundColor: colors.surfaceHighlight,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontFamily: typography.fonts.primaryBold,
    fontSize: typography.sizes.md,
    color: colors.text,
    marginBottom: 4,
  },
  trackArtist: {
    fontFamily: typography.fonts.secondary,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  trackItemActive: {
    backgroundColor: colors.surfaceHighlight,
  },
  favoriteButton: {
    padding: 8,
  },
});
