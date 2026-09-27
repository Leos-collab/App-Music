import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert, Modal } from 'react-native';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { useLibraryStore } from '../../src/store/libraryStore';
import { usePlayerStore } from '../../src/store/playerStore';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { Ionicons } from '@expo/vector-icons';

import { router } from 'expo-router';
import { useTheme } from '../../src/hooks/useTheme';
import { useThemeStore } from '../../src/store/themeStore';

export default function LibraryScreen() {
  const { tracks, loadTracks, addTrack, toggleFavorite, deleteTrack, playlists, addTrackToPlaylist } = useLibraryStore();
  const { playTrack, currentTrack, isPlaying } = usePlayerStore();
  const colors = useTheme();
  const { profile } = useThemeStore();
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [playlistModalVisible, setPlaylistModalVisible] = useState(false);

  useEffect(() => {
    loadTracks();
  }, []);

  const handleImport = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: false,
        multiple: true,
      });

      if (!result.canceled) {
        for (const asset of result.assets) {
          const filename = asset.name;
          const title = filename.substring(0, filename.lastIndexOf('.')) || filename;
          
          // Create a permanent path in the app's document directory
          const newPath = `${FileSystem.documentDirectory}${Date.now()}_${filename.replace(/\s/g, '_')}`;
          
          // Copy the file from its temporary/external location to our app's storage
          await FileSystem.copyAsync({
            from: asset.uri,
            to: newPath
          });
          
          await addTrack({
            id: newPath, // Use the new permanent path as ID to ensure uniqueness
            uri: newPath,
            title: title,
            artist: 'Desconhecido',
            filename: filename,
            format: asset.mimeType,
          });
        }
      }
    } catch (err) {
      console.error('Erro ao importar', err);
    }
  };

  const handleDelete = (trackId: string, trackTitle: string) => {
    Alert.alert(
      'Remover Música',
      `Deseja remover "${trackTitle}" do aplicativo? Ela também será removida de todas as playlists.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Remover', 
          style: 'destructive', 
          onPress: () => deleteTrack(trackId) 
        },
      ]
    );
  };

  const openAddToPlaylistModal = (trackId: string) => {
    setSelectedTrackId(trackId);
    setPlaylistModalVisible(true);
  };

  const handleSelectPlaylist = (playlistId: string) => {
    if (selectedTrackId) {
      addTrackToPlaylist(playlistId, selectedTrackId);
      Alert.alert('Sucesso', 'Música adicionada à playlist!');
      setPlaylistModalVisible(false);
      setSelectedTrackId(null);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Pressable onPress={() => router.push('/profile')} style={[styles.avatarBtn, { backgroundColor: colors.surfaceHighlight, borderColor: colors.primary }]}>
              <Text style={styles.avatarEmoji}>{profile.avatarEmoji}</Text>
            </Pressable>
            <View>
              <Text style={[styles.greeting, { color: colors.textSecondary }]}>Olá,</Text>
              <Text style={[styles.profileName, { color: colors.text }]}>{profile.name}</Text>
            </View>
          </View>
          <Pressable style={[styles.importButton, { backgroundColor: colors.primary }]} onPress={handleImport}>
            <Ionicons name="add" size={24} color={colors.background} />
            <Text style={[styles.importButtonText, { color: colors.background }]}>Importar</Text>
          </Pressable>
        </View>
        <Text style={[styles.title, { color: colors.text }]}>Biblioteca</Text>
      </View>

      {tracks.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="musical-notes" size={64} color={colors.border} />
          <Text style={styles.subtitle}>Nenhuma música na biblioteca.</Text>
          <Text style={styles.hint}>Toque em Importar para adicionar arquivos locais.</Text>
        </View>
      ) : (
        <FlatList
          data={tracks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isActive = currentTrack?.id === item.id;
            const isFav = item.isFavorite;
            return (
              <Pressable
                style={[styles.trackItem, isActive && styles.trackItemActive]}
                onPress={() => playTrack(item, tracks)}
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
                <Pressable onPress={() => openAddToPlaylistModal(item.id)} style={styles.actionButton}>
                  <Ionicons name="add-circle" size={22} color={colors.primary} />
                </Pressable>
                <Pressable onPress={() => toggleFavorite(item.id)} style={styles.actionButton}>
                  <Ionicons name={isFav ? "heart" : "heart-outline"} size={22} color={isFav ? "#FF4081" : colors.textMuted} />
                </Pressable>
                <Pressable onPress={() => handleDelete(item.id, item.title)} style={styles.actionButton}>
                  <Ionicons name="trash" size={22} color="#FF5252" />
                </Pressable>
              </Pressable>
            );
          }}
        />
      )}

      {/* Modal para Adicionar Música em uma Playlist */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={playlistModalVisible}
        onRequestClose={() => setPlaylistModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar à Playlist</Text>
            {playlists.length === 0 ? (
              <Text style={styles.emptyText}>Você ainda não possui playlists criadas. Crie uma na aba Playlists!</Text>
            ) : (
              <FlatList
                data={playlists}
                keyExtractor={(pl) => pl.id}
                renderItem={({ item: pl }) => (
                  <Pressable style={styles.playlistSelectItem} onPress={() => handleSelectPlaylist(pl.id)}>
                    <Ionicons name="list" size={20} color={colors.primary} style={{ marginRight: 12 }} />
                    <Text style={styles.playlistSelectName}>{pl.name}</Text>
                  </Pressable>
                )}
              />
            )}
            <Pressable style={styles.closeModalButton} onPress={() => setPlaylistModalVisible(false)}>
              <Text style={styles.closeModalButtonText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarEmoji: {
    fontSize: 22,
  },
  greeting: {
    fontFamily: typography.fonts.secondaryMedium,
    fontSize: typography.sizes.sm,
  },
  profileName: {
    fontFamily: typography.fonts.primaryBold,
    fontSize: typography.sizes.lg,
  },
  title: {
    fontFamily: typography.fonts.primaryBold,
    fontSize: typography.sizes.xxl,
  },
  importButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  importButtonText: {
    color: colors.background,
    fontFamily: typography.fonts.primaryBold,
    marginLeft: 4,
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
  actionButton: {
    padding: 6,
    marginLeft: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: {
    fontFamily: typography.fonts.primaryBold,
    fontSize: typography.sizes.lg,
    color: colors.text,
    marginBottom: 16,
  },
  emptyText: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.secondary,
    fontSize: typography.sizes.md,
    marginBottom: 20,
  },
  playlistSelectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  playlistSelectName: {
    fontFamily: typography.fonts.primaryBold,
    fontSize: typography.sizes.md,
    color: colors.text,
  },
  closeModalButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.surfaceHighlight,
    borderRadius: 8,
  },
  closeModalButtonText: {
    color: colors.text,
    fontFamily: typography.fonts.primaryBold,
  },
});
