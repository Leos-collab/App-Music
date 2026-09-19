import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, Modal } from 'react-native';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { useLibraryStore } from '../../src/store/libraryStore';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function PlaylistsScreen() {
  const { playlists, addPlaylist } = useLibraryStore();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [playlistName, setPlaylistName] = useState('');

  const handleCreatePlaylist = () => {
    if (playlistName.trim()) {
      addPlaylist(playlistName.trim());
      setPlaylistName('');
      setModalVisible(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <Pressable
      style={styles.playlistItem}
      onPress={() => router.push({ pathname: `/playlist/${item.id}` })}
    >
      <View style={styles.playlistIcon}>
        <Ionicons name="musical-notes" size={24} color={colors.primary} />
      </View>
      <View style={styles.playlistInfo}>
        <Text style={styles.playlistName}>{item.name}</Text>
        <Text style={styles.playlistCount}>{item.trackIds.length} faixas</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Playlists</Text>
        <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={20} color={colors.background} />
          <Text style={styles.addButtonText}>Criar Playlist</Text>
        </Pressable>
      </View>

      {playlists.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="list-outline" size={64} color={colors.border} />
          <Text style={styles.subtitle}>Nenhuma playlist criada.</Text>
          <Text style={styles.hint}>Toque em "Criar Playlist" para organizar suas músicas.</Text>
        </View>
      ) : (
        <FlatList data={playlists} keyExtractor={(item) => item.id} renderItem={renderItem} />
      )}

      {/* Modal para criar Playlist */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova Playlist</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome da playlist"
              placeholderTextColor={colors.textMuted}
              value={playlistName}
              onChangeText={setPlaylistName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <Pressable 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => {
                  setPlaylistName('');
                  setModalVisible(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>
              <Pressable style={[styles.modalButton, styles.createButton]} onPress={handleCreatePlaylist}>
                <Text style={styles.createButtonText}>Criar</Text>
              </Pressable>
            </View>
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: { fontFamily: typography.fonts.primaryBold, fontSize: typography.sizes.xl, color: colors.text },
  addButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
  },
  addButtonText: { color: colors.background, fontFamily: typography.fonts.primaryBold, fontSize: typography.sizes.sm, marginLeft: 4 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  subtitle: { color: colors.text, fontFamily: typography.fonts.secondaryMedium, fontSize: typography.sizes.lg, marginTop: 16 },
  hint: { color: colors.textSecondary, fontFamily: typography.fonts.secondary, fontSize: typography.sizes.sm, marginTop: 8, textAlign: 'center' },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  playlistIcon: {
    width: 48,
    height: 48,
    backgroundColor: colors.surfaceHighlight,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistName: { fontFamily: typography.fonts.primaryBold, fontSize: typography.sizes.md, color: colors.text, marginBottom: 4 },
  playlistCount: { fontFamily: typography.fonts.secondary, fontSize: typography.sizes.sm, color: colors.textSecondary },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
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
  input: {
    backgroundColor: colors.surfaceHighlight,
    borderRadius: 8,
    padding: 12,
    color: colors.text,
    fontFamily: typography.fonts.secondary,
    fontSize: typography.sizes.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: colors.surfaceHighlight,
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontFamily: typography.fonts.primaryBold,
  },
  createButton: {
    backgroundColor: colors.primary,
  },
  createButtonText: {
    color: colors.background,
    fontFamily: typography.fonts.primaryBold,
  },
});
