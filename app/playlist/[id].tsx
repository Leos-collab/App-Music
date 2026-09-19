import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { useLibraryStore } from '../../src/store/libraryStore';
import { usePlayerStore } from '../../src/store/playerStore';

export default function PlaylistDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { playlists, removeTrackFromPlaylist, addTrackToPlaylist, tracks: libraryTracks, loadTracks } = useLibraryStore();
  const { playTrack, currentTrack, isPlaying } = usePlayerStore();

  const [addModalVisible, setAddModalVisible] = useState(false);

  useEffect(() => {
    loadTracks();
  }, []);

  const playlist = playlists.find((p) => p.id === id);

  if (!playlist) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={styles.title}>Playlist não encontrada</Text>
          <View style={{ width: 32 }} />
        </View>
      </View>
    );
  }

  const playlistTracks = libraryTracks.filter((t) => playlist.trackIds.includes(t.id));
  const availableTracksToAdd = libraryTracks.filter((t) => !playlist.trackIds.includes(t.id));

  const handleRemove = (trackId: string) => {
    Alert.alert('Remover da playlist', 'Deseja remover esta faixa?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => removeTrackFromPlaylist(playlist.id, trackId) },
    ]);
  };

  const handleAddTrack = (trackId: string) => {
    addTrackToPlaylist(playlist.id, trackId);
  };

  const renderItem = ({ item }: { item: any }) => {
    const isActive = currentTrack?.id === item.id;
    return (
      <Pressable style={styles.trackItem} onPress={() => playTrack(item, playlistTracks)}>
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
        <Pressable onPress={() => handleRemove(item.id)} style={styles.removeButton}>
          <Ionicons name="trash-outline" size={20} color="#FF5252" />
        </Pressable>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>{playlist.name}</Text>
        <Pressable onPress={() => setAddModalVisible(true)} style={styles.addButton}>
          <Ionicons name="add" size={26} color={colors.primary} />
        </Pressable>
      </View>

      {playlistTracks.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="musical-notes-outline" size={64} color={colors.border} />
          <Text style={styles.emptyText}>Nenhuma faixa nesta playlist.</Text>
          <Pressable onPress={() => setAddModalVisible(true)} style={styles.addTracksPromptButton}>
            <Text style={styles.addTracksPromptText}>Adicionar Músicas da Biblioteca</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList data={playlistTracks} keyExtractor={(item) => item.id} renderItem={renderItem} />
      )}

      {/* Modal para adicionar músicas da biblioteca à playlist */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addModalVisible}
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Adicionar Músicas</Text>
              <Pressable onPress={() => setAddModalVisible(false)}>
                <Ionicons name="close" size={26} color={colors.text} />
              </Pressable>
            </View>

            {availableTracksToAdd.length === 0 ? (
              <View style={styles.modalEmptyState}>
                <Text style={styles.modalEmptyText}>
                  {libraryTracks.length === 0
                    ? 'Sua biblioteca está vazia. Importe músicas na aba Biblioteca primeiro!'
                    : 'Todas as músicas da biblioteca já estão nesta playlist.'}
                </Text>
              </View>
            ) : (
              <FlatList
                data={availableTracksToAdd}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.addTrackRow}>
                    <View style={styles.trackIcon}>
                      <Ionicons name="musical-note" size={24} color={colors.primary} />
                    </View>
                    <View style={styles.trackInfo}>
                      <Text style={styles.trackTitle} numberOfLines={1}>{item.title}</Text>
                      <Text style={styles.trackArtist} numberOfLines={1}>{item.artist}</Text>
                    </View>
                    <Pressable style={styles.addTrackButton} onPress={() => handleAddTrack(item.id)}>
                      <Ionicons name="add-circle" size={28} color={colors.primary} />
                    </Pressable>
                  </View>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  title: { 
    fontFamily: typography.fonts.primaryBold, 
    fontSize: typography.sizes.lg, 
    color: colors.text,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  backButton: { padding: 4 },
  addButton: { padding: 4 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { color: colors.textSecondary, fontFamily: typography.fonts.secondary, fontSize: typography.sizes.md, marginTop: 12 },
  addTracksPromptButton: {
    marginTop: 16,
    backgroundColor: colors.surfaceHighlight,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  addTracksPromptText: {
    color: colors.primary,
    fontFamily: typography.fonts.primaryBold,
    fontSize: typography.sizes.sm,
  },
  trackItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  trackIcon: { width: 48, height: 48, backgroundColor: colors.surfaceHighlight, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  trackInfo: { flex: 1 },
  trackTitle: { fontFamily: typography.fonts.primaryBold, fontSize: typography.sizes.md, color: colors.text, marginBottom: 4 },
  trackArtist: { fontFamily: typography.fonts.secondary, fontSize: typography.sizes.sm, color: colors.textSecondary },
  removeButton: { padding: 8 },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '80%',
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontFamily: typography.fonts.primaryBold,
    fontSize: typography.sizes.lg,
    color: colors.text,
  },
  modalEmptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalEmptyText: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.secondary,
    fontSize: typography.sizes.md,
    textAlign: 'center',
  },
  addTrackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  addTrackButton: {
    padding: 4,
  },
});
