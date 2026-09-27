import { create } from 'zustand';

export const eqPresets = [
  { name: 'Normal', values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  { name: 'Acoustic', values: [5, 5, 4, 1, 1, 1, 3, 4, 3, 2] },
  { name: 'Bass Booster', values: [6, 5, 4, 3, 1, 0, 0, 0, 0, 0] },
  { name: 'Classical', values: [5, 4, 3, 2, -2, -2, 0, 3, 4, 4] },
  { name: 'Dance', values: [7, 6, 2, 0, 0, -4, -6, -6, 0, 0] },
  { name: 'Electronic', values: [4, 4, -2, -3, 0, 2, 4, 5, 5, 4] },
  { name: 'Hip-Hop', values: [5, 4, 2, 3, -1, -1, 2, -1, 2, 3] },
  { name: 'Jazz', values: [4, 3, 1, 2, -2, -2, 0, 1, 3, 4] },
  { name: 'Pop', values: [-2, -1, 2, 3, 4, 4, 2, 0, -1, -2] },
  { name: 'Rock', values: [5, 4, 3, 1, -1, -2, 0, 2, 4, 5] },
];

export const EQ_BANDS = ['32', '64', '125', '250', '500', '1k', '2k', '4k', '8k', '16k'];

interface EqualizerState {
  isOn: boolean;
  limiter: boolean;
  pitch: boolean;
  reverb: boolean;
  activePreset: string;
  bands: number[];
  volume: number;
  toggleEqualizer: () => void;
  toggleLimiter: () => void;
  togglePitch: () => void;
  toggleReverb: () => void;
  setBand: (index: number, value: number) => void;
  setVolume: (value: number) => void;
  applyPreset: (presetName: string) => void;
  reset: () => void;
}

export const useEqualizerStore = create<EqualizerState>((set) => ({
  isOn: false,
  limiter: false,
  pitch: false,
  reverb: false,
  activePreset: 'Normal',
  bands: [...eqPresets[0].values],
  volume: 50,
  
  toggleEqualizer: () => set((state) => ({ isOn: !state.isOn })),
  toggleLimiter: () => set((state) => ({ limiter: !state.limiter })),
  togglePitch: () => set((state) => ({ pitch: !state.pitch })),
  toggleReverb: () => set((state) => ({ reverb: !state.reverb })),
  
  setBand: (index, value) => set((state) => {
    const newBads = [...state.bands];
    newBads[index] = value;
    return { bands: newBads, activePreset: 'Custom' };
  }),
  
  setVolume: (value) => set({ volume: value }),
  
  applyPreset: (presetName) => set((state) => {
    const preset = eqPresets.find((p) => p.name === presetName);
    if (preset) {
      return { activePreset: presetName, bands: [...preset.values] };
    }
    return state;
  }),
  
  reset: () => set({ 
    activePreset: 'Normal', 
    bands: [...eqPresets[0].values],
    limiter: false,
    pitch: false,
    reverb: false,
    volume: 50
  })
}));
