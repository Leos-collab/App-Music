import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { typography } from '../src/theme/typography';
import {
  useThemeStore,
  ACCENTS,
  BACKGROUNDS,
  AccentKey,
  BackgroundKey,
} from '../src/store/themeStore';
import { useTheme } from '../src/hooks/useTheme';

const AVATAR_EMOJIS = ['🎵', '🎸', '🎹', '🎷', '🎺', '🥁', '🎻', '🎤', '🎼', '🦄', '🔥', '⚡', '🌙', '🎆', '🌊'];

export default function ProfileScreen() {
  const colors = useTheme();
  const { accentKey, backgroundKey, profile, setAccent, setBackground, setProfile, setBackgroundImage } = useThemeStore();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.name);

  const saveName = () => {
    if (nameInput.trim()) setProfile({ name: nameInput.trim() });
    setEditingName(false);
  };

  const styles = makeStyles(colors);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Perfil & Tema</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Avatar & Name */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatarCircle, { borderColor: colors.primary }]}>
            <Text style={styles.avatarEmoji}>{profile.avatarEmoji}</Text>
          </View>
          {editingName ? (
            <View style={styles.nameEditRow}>
              <TextInput
                style={[styles.nameInput, { borderColor: colors.primary, color: colors.text }]}
                value={nameInput}
                onChangeText={setNameInput}
                autoFocus
                maxLength={24}
                placeholderTextColor={colors.textMuted}
                placeholder="Seu nome"
              />
              <Pressable onPress={saveName} style={[styles.saveBtn, { backgroundColor: colors.primary }]}>
                <Ionicons name="checkmark" size={20} color={colors.background} />
              </Pressable>
            </View>
          ) : (
            <Pressable style={styles.nameRow} onPress={() => setEditingName(true)}>
              <Text style={styles.profileName}>{profile.name}</Text>
              <Ionicons name="pencil" size={16} color={colors.textMuted} style={{ marginLeft: 8 }} />
            </Pressable>
          )}
          <Text style={styles.sectionHint}>Toque no nome para editar</Text>
        </View>

        {/* Avatar Picker */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Escolher Avatar</Text>
          <View style={styles.emojiGrid}>
            {AVATAR_EMOJIS.map((emoji) => (
              <Pressable
                key={emoji}
                onPress={() => setProfile({ avatarEmoji: emoji })}
                style={[
                  styles.emojiCell,
                  {
                    backgroundColor:
                      profile.avatarEmoji === emoji
                        ? colors.primary + '33'
                        : colors.surfaceHighlight,
                    borderColor:
                      profile.avatarEmoji === emoji ? colors.primary : 'transparent',
                  },
                ]}
              >
                <Text style={styles.emojiText}>{emoji}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Accent Color */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cor de Destaque</Text>
          <Text style={styles.cardSubtitle}>Afeta botões, ícones ativos e elementos interativos</Text>
          <View style={styles.colorRow}>
            {ACCENTS.map((a) => (
              <Pressable
                key={a.key}
                onPress={() => setAccent(a.key as AccentKey)}
                style={styles.colorItemWrap}
              >
                <View
                  style={[
                    styles.colorCircle,
                    { backgroundColor: a.primary },
                    accentKey === a.key && styles.colorCircleSelected,
                    accentKey === a.key && { borderColor: colors.text },
                  ]}
                >
                  {accentKey === a.key && (
                    <Ionicons name="checkmark" size={18} color="#000" />
                  )}
                </View>
                <Text style={[styles.colorLabel, accentKey === a.key && { color: a.primary }]}>
                  {a.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Background Theme */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Plano de Fundo</Text>
          <Text style={styles.cardSubtitle}>Muda o fundo e as superfícies do app</Text>
          <View style={styles.bgGrid}>
            {BACKGROUNDS.map((bg) => (
              <Pressable
                key={bg.key}
                onPress={() => setBackground(bg.key as BackgroundKey)}
                style={[
                  styles.bgCard,
                  { backgroundColor: bg.background, borderColor: backgroundKey === bg.key ? colors.primary : colors.border },
                  backgroundKey === bg.key && styles.bgCardSelected,
                ]}
              >
                {/* Mini preview layers */}
                <View style={[styles.bgPreviewSurface, { backgroundColor: bg.surface }]}>
                  <View style={[styles.bgPreviewBar, { backgroundColor: bg.surfaceHighlight }]} />
                  <View style={[styles.bgPreviewBar, { backgroundColor: bg.border, width: '60%' }]} />
                </View>
                <Text style={[styles.bgLabel, backgroundKey === bg.key && { color: colors.primary }]}>
                  {bg.label}
                </Text>
                {backgroundKey === bg.key && (
                  <View style={[styles.bgCheck, { backgroundColor: colors.primary }]}>
                    <Ionicons name="checkmark" size={12} color="#000" />
                  </View>
                )}
              </Pressable>
            ))}
          </View>

          {/* Imagem de Fundo Personalizada */}
          <Pressable 
            style={[styles.customBgBtn, { backgroundColor: colors.surfaceHighlight, borderColor: colors.border }]}
            onPress={async () => {
              try {
                const result = await DocumentPicker.getDocumentAsync({
                  type: 'image/*',
                  copyToCacheDirectory: false,
                });
                if (!result.canceled && result.assets.length > 0) {
                  const asset = result.assets[0];
                  const newPath = `${FileSystem.documentDirectory}${Date.now()}_bg_${asset.name.replace(/\s/g, '_')}`;
                  
                  await FileSystem.copyAsync({
                    from: asset.uri,
                    to: newPath
                  });
                  
                  setBackgroundImage(newPath);
                }
              } catch (err) {
                console.error('Erro ao escolher imagem', err);
              }
            }}
          >
            <Ionicons name="image" size={24} color={colors.primary} />
            <Text style={[styles.customBgText, { color: colors.text }]}>
              Escolher Imagem da Galeria
            </Text>
          </Pressable>
          {useThemeStore(s => s.backgroundImageUrl) && (
            <Pressable 
              style={{ marginTop: 12, alignItems: 'center' }}
              onPress={() => setBackgroundImage(null)}
            >
              <Text style={{ color: colors.danger, fontFamily: typography.fonts.secondary }}>
                Remover Imagem de Fundo
              </Text>
            </Pressable>
          )}
        </View>

        {/* Live Preview */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pré-visualização</Text>
          <View style={[styles.preview, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={[styles.previewHeader, { borderBottomColor: colors.border }]}>
              <View style={styles.previewAvatar}>
                <Text style={{ fontSize: 20 }}>{profile.avatarEmoji}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.previewName, { color: colors.text }]}>{profile.name}</Text>
                <Text style={[styles.previewSub, { color: colors.textSecondary }]}>Reproduzindo agora</Text>
              </View>
              <Ionicons name="heart" size={22} color={colors.accent} />
            </View>
            <View style={[styles.previewTrack, { backgroundColor: colors.surfaceHighlight }]}>
              <View style={[styles.previewIcon, { backgroundColor: colors.primary + '22' }]}>
                <Ionicons name="musical-note" size={20} color={colors.primary} />
              </View>
              <Text style={[styles.previewTrackName, { color: colors.text }]}>Nome da Música</Text>
              <Ionicons name="play-circle" size={28} color={colors.primary} />
            </View>
            <View style={[styles.previewProgressBg, { backgroundColor: colors.border }]}>
              <View style={[styles.previewProgressFill, { backgroundColor: colors.primary, width: '45%' }]} />
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(colors: ReturnType<typeof import('../src/hooks/useTheme').useTheme>) {
  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scroll: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surfaceHighlight,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      fontFamily: typography.fonts.primaryBold,
      fontSize: typography.sizes.lg,
      color: colors.text,
    },
    avatarSection: {
      alignItems: 'center',
      paddingVertical: 28,
    },
    avatarCircle: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.surfaceHighlight,
      borderWidth: 3,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 14,
    },
    avatarEmoji: {
      fontSize: 52,
    },
    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    profileName: {
      fontFamily: typography.fonts.primaryBold,
      fontSize: typography.sizes.xl,
      color: colors.text,
    },
    nameEditRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    nameInput: {
      fontFamily: typography.fonts.primary,
      fontSize: typography.sizes.lg,
      borderWidth: 1.5,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 8,
      width: 200,
      backgroundColor: colors.surfaceHighlight,
    },
    saveBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sectionHint: {
      fontFamily: typography.fonts.secondary,
      fontSize: typography.sizes.xs,
      color: colors.textMuted,
      marginTop: 6,
    },
    card: {
      marginHorizontal: 16,
      marginBottom: 16,
      backgroundColor: colors.surface,
      borderRadius: 18,
      padding: 18,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardTitle: {
      fontFamily: typography.fonts.primaryBold,
      fontSize: typography.sizes.md,
      color: colors.text,
      marginBottom: 4,
    },
    cardSubtitle: {
      fontFamily: typography.fonts.secondary,
      fontSize: typography.sizes.xs,
      color: colors.textMuted,
      marginBottom: 14,
    },
    emojiGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginTop: 10,
    },
    emojiCell: {
      width: 50,
      height: 50,
      borderRadius: 12,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emojiText: {
      fontSize: 26,
    },
    colorRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginTop: 8,
      justifyContent: 'space-between',
    },
    colorItemWrap: {
      alignItems: 'center',
      width: '30%',
    },
    colorCircle: {
      width: 46,
      height: 46,
      borderRadius: 23,
      borderWidth: 3,
      borderColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 6,
    },
    colorCircleSelected: {
      borderWidth: 3,
      transform: [{ scale: 1.15 }],
    },
    colorLabel: {
      fontFamily: typography.fonts.secondary,
      fontSize: typography.sizes.xs,
      color: colors.textSecondary,
    },
    bgGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginTop: 10,
    },
    bgCard: {
      width: '30%',
      borderRadius: 14,
      borderWidth: 2,
      overflow: 'hidden',
      padding: 8,
      position: 'relative',
    },
    bgCardSelected: {
      transform: [{ scale: 1.04 }],
    },
    bgPreviewSurface: {
      borderRadius: 8,
      padding: 8,
      gap: 4,
      marginBottom: 8,
    },
    bgPreviewBar: {
      height: 6,
      borderRadius: 3,
      width: '80%',
    },
    bgLabel: {
      fontFamily: typography.fonts.secondary,
      fontSize: typography.sizes.xs,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    bgCheck: {
      position: 'absolute',
      top: 6,
      right: 6,
      width: 20,
      height: 20,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    customBgBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 12,
      borderWidth: 1,
      borderRadius: 12,
      marginTop: 16,
      gap: 8,
    },
    customBgText: {
      fontFamily: typography.fonts.primaryBold,
      fontSize: typography.sizes.sm,
    },
    preview: {
      borderRadius: 14,
      borderWidth: 1,
      overflow: 'hidden',
      marginTop: 10,
    },
    previewHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 14,
      borderBottomWidth: 1,
    },
    previewAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surfaceHighlight,
      justifyContent: 'center',
      alignItems: 'center',
    },
    previewName: {
      fontFamily: typography.fonts.primaryBold,
      fontSize: typography.sizes.sm,
    },
    previewSub: {
      fontFamily: typography.fonts.secondary,
      fontSize: typography.sizes.xs,
    },
    previewTrack: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      margin: 10,
      borderRadius: 10,
      gap: 10,
    },
    previewIcon: {
      width: 36,
      height: 36,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    previewTrackName: {
      fontFamily: typography.fonts.primaryBold,
      fontSize: typography.sizes.sm,
      flex: 1,
    },
    previewProgressBg: {
      height: 4,
      marginHorizontal: 14,
      marginBottom: 14,
      borderRadius: 2,
      overflow: 'hidden',
    },
    previewProgressFill: {
      height: 4,
      borderRadius: 2,
    },
  });
}
