import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { useEqualizerStore, EQ_BANDS, eqPresets } from '../../src/store/equalizerStore';
import { CustomSlider } from '../../src/components/CustomSlider';

export default function EqualizerScreen() {
  const {
    isOn, limiter, pitch, reverb,
    activePreset, bands, volume,
    toggleEqualizer, toggleLimiter, togglePitch, toggleReverb,
    setBand, setVolume, applyPreset, reset
  } = useEqualizerStore();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Equalizer</Text>
        <Switch value={isOn} onValueChange={toggleEqualizer} thumbColor={isOn ? '#00d2ff' : '#ccc'} />
      </View>

      {/* Toggles Row */}
      <View style={styles.togglesRow}>
        <Toggle label="Limiter" value={limiter} onToggle={toggleLimiter} />
        <Toggle label="Pitch" value={pitch} onToggle={togglePitch} />
        <Toggle label="Reverb" value={reverb} onToggle={toggleReverb} />
      </View>

      {/* Main EQ Area */}
      <View style={styles.eqArea}>
        <View style={styles.volumeArea}>
           <Text style={styles.label}>Vol</Text>
           <CustomSlider 
             value={volume} min={0} max={100} 
             onValueChange={setVolume} 
           />
           <Text style={styles.label}>{volume}</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bandsContainer}>
          {EQ_BANDS.map((band, index) => (
            <View key={band} style={styles.bandCol}>
              <Text style={styles.bandValue}>{bands[index] > 0 ? `+${bands[index]}` : bands[index]}</Text>
              <CustomSlider 
                value={bands[index]} min={-15} max={15} 
                onValueChange={(val) => setBand(index, val)} 
                label={band}
              />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Presets and Controls */}
      <View style={styles.controlsRow}>
        <Pressable style={styles.button} onPress={reset}>
          <Text style={styles.buttonText}>Reset</Text>
        </Pressable>
        <Text style={styles.presetLabel}>Preset: {activePreset}</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetsList}>
        {eqPresets.map((preset) => (
          <Pressable 
            key={preset.name} 
            style={[styles.presetItem, activePreset === preset.name && styles.presetItemActive]}
            onPress={() => applyPreset(preset.name)}
          >
            <Text style={[styles.presetText, activePreset === preset.name && styles.presetTextActive]}>
              {preset.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

    </ScrollView>
  );
}

const Toggle = ({ label, value, onToggle }: { label: string, value: boolean, onToggle: () => void }) => (
  <View style={styles.toggleContainer}>
    <Text style={styles.toggleLabel}>{label}</Text>
    <Switch value={value} onValueChange={onToggle} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: typography.fonts.primaryBold,
    fontSize: typography.sizes.xl,
    color: colors.text,
  },
  togglesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  toggleContainer: {
    alignItems: 'center',
  },
  toggleLabel: {
    color: colors.text,
    marginBottom: 5,
    fontFamily: typography.fonts.secondary,
  },
  eqArea: {
    flexDirection: 'row',
    marginBottom: 30,
    backgroundColor: '#1a1d24',
    padding: 10,
    borderRadius: 10,
  },
  volumeArea: {
    alignItems: 'center',
    marginRight: 20,
  },
  label: {
    color: colors.text,
    fontSize: 12,
    marginBottom: 5,
  },
  bandsContainer: {
    flex: 1,
  },
  bandCol: {
    alignItems: 'center',
    width: 45,
  },
  bandValue: {
    color: '#00d2ff',
    fontSize: 12,
    marginBottom: 5,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#32353c',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: colors.text,
  },
  presetLabel: {
    color: colors.text,
    fontSize: 16,
    fontFamily: typography.fonts.primaryBold,
  },
  presetsList: {
    flexDirection: 'row',
  },
  presetItem: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#1d2026',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#3c494e',
  },
  presetItemActive: {
    backgroundColor: '#00d2ff',
    borderColor: '#00d2ff',
  },
  presetText: {
    color: colors.textSecondary,
  },
  presetTextActive: {
    color: '#003543',
    fontWeight: 'bold',
  },
});
