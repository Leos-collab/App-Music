import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { Ionicons } from '@expo/vector-icons';

export default function EqualizerScreen() {
  return (
    <View style={styles.container}>
      <Ionicons name="options" size={64} color={colors.primary} style={styles.icon} />
      <Text style={styles.title}>Equalizador</Text>
      <Text style={styles.subtitle}>Espaço reservado para o equalizador e ajustes de áudio.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontFamily: typography.fonts.primaryBold,
    fontSize: typography.sizes.xl,
    color: colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: typography.fonts.secondary,
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
