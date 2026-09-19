import { create } from 'zustand';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import type { AudioPlayer } from 'expo-audio';
import { Track } from '../types';

export type RepeatMode = 'off' | 'all' | 'one';

interface PlayerState {
  player: AudioPlayer | null;
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  position: number; // em milissegundos para compatibilidade com a UI
  duration: number; // em milissegundos para compatibilidade com a UI
  isShuffle: boolean;
  repeatMode: RepeatMode; // 'off' | 'all' | 'one'

  playTrack: (track: Track, newQueue?: Track[], forceReplay?: boolean) => Promise<void>;
  pause: () => void;
  resume: () => void;
  seek: (positionSeconds: number) => void;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
}

let audioModeConfigured = false;

async function configureAudioMode() {
  if (audioModeConfigured) return;
  try {
    await setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: 'doNotMix',
    });
    audioModeConfigured = true;
  } catch (e) {
    console.warn('Could not configure audio mode', e);
  }
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  player: null,
  currentTrack: null,
  queue: [],
  isPlaying: false,
  position: 0,
  duration: 0,
  isShuffle: false,
  repeatMode: 'off',

  playTrack: async (track, newQueue, forceReplay = false) => {
    const { player: currentPlayer, currentTrack, isPlaying } = get();

    // Se já estiver tocando exatamente a mesma música e não for um forceReplay
    if (currentTrack?.id === track.id && currentPlayer && !forceReplay) {
      if (!isPlaying) {
        currentPlayer.play();
        set({ isPlaying: true });
      }
      return;
    }

    if (newQueue) {
      set({ queue: newQueue });
    }

    try {
      await configureAudioMode();

      if (currentPlayer) {
        try {
          currentPlayer.pause();
          currentPlayer.remove();
        } catch (err) {
          console.warn('Erro ao remover player anterior', err);
        }
      }

      const player = createAudioPlayer({ uri: track.uri });

      player.addListener('playbackStatusUpdate', (status) => {
        set({
          position: Math.floor((status.currentTime ?? 0) * 1000),
          duration: Math.floor((status.duration ?? 0) * 1000),
          isPlaying: status.playing ?? false,
        });

        if (status.didJustFinish) {
          const { repeatMode } = get();
          if (repeatMode === 'one') {
            // Loop na mesma música: reinicia a música
            get().seek(0);
            player.play();
          } else {
            get().playNext();
          }
        }
      });

      player.play();

      set({
        player,
        currentTrack: track,
        isPlaying: true,
      });
    } catch (e) {
      console.error('Failed to play track', e);
    }
  },

  pause: () => {
    const { player } = get();
    if (player) {
      player.pause();
      set({ isPlaying: false });
    }
  },

  resume: () => {
    const { player } = get();
    if (player) {
      player.play();
      set({ isPlaying: true });
    }
  },

  seek: (positionSeconds: number) => {
    const { player } = get();
    if (player) {
      player.seekTo(positionSeconds);
      set({ position: Math.floor(positionSeconds * 1000) });
    }
  },

  toggleShuffle: () => {
    set((state) => ({ isShuffle: !state.isShuffle }));
  },

  toggleRepeat: () => {
    set((state) => {
      if (state.repeatMode === 'off') return { repeatMode: 'all' };
      if (state.repeatMode === 'all') return { repeatMode: 'one' };
      return { repeatMode: 'off' };
    });
  },

  playNext: async () => {
    const { currentTrack, queue, playTrack, isShuffle, repeatMode } = get();
    if (!currentTrack || queue.length === 0) return;

    if (isShuffle && queue.length > 1) {
      // Ordem aleatória selecionando outro item aleatório da lista
      const availableTracks = queue.filter((t) => t.id !== currentTrack.id);
      const randomIndex = Math.floor(Math.random() * availableTracks.length);
      const nextTrack = availableTracks[randomIndex];
      await playTrack(nextTrack, undefined, true);
      return;
    }

    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
    if (currentIndex !== -1 && currentIndex < queue.length - 1) {
      await playTrack(queue[currentIndex + 1], undefined, true);
    } else if (repeatMode === 'all' && queue.length > 0) {
      // Volta para o início da lista quando repeatMode é 'all'
      await playTrack(queue[0], undefined, true);
    } else {
      const { player } = get();
      if (player) {
        player.pause();
        player.seekTo(0);
        set({ isPlaying: false, position: 0 });
      }
    }
  },

  playPrevious: async () => {
    const { currentTrack, queue, playTrack, position, isShuffle, repeatMode } = get();
    if (!currentTrack || queue.length === 0) return;

    if (position > 3000) {
      get().seek(0);
      return;
    }

    if (isShuffle && queue.length > 1) {
      const availableTracks = queue.filter((t) => t.id !== currentTrack.id);
      const randomIndex = Math.floor(Math.random() * availableTracks.length);
      const prevTrack = availableTracks[randomIndex];
      await playTrack(prevTrack, undefined, true);
      return;
    }

    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
    if (currentIndex > 0) {
      await playTrack(queue[currentIndex - 1], undefined, true);
    } else if (repeatMode === 'all' && queue.length > 0) {
      await playTrack(queue[queue.length - 1], undefined, true);
    } else {
      get().seek(0);
    }
  },
}));
