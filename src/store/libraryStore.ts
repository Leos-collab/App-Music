import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Track, Playlist } from '../types';

interface LibraryState {
  tracks: Track[];
  playlists: Playlist[];
  isLoading: boolean;
  addTrack: (track: Track) => Promise<void>;
  loadTracks: () => Promise<void>;
  clearLibrary: () => Promise<void>;
  toggleFavorite: (trackId: string) => void;
  deleteTrack: (trackId: string) => Promise<void>;
  addPlaylist: (name: string) => void;
  addTrackToPlaylist: (playlistId: string, trackId: string) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  tracks: [],
  playlists: [],
  isLoading: false,

  addTrack: async (track) => {
    const currentTracks = get().tracks;
    if (currentTracks.some((t) => t.uri === track.uri)) {
      return;
    }
    const newTracks = [...currentTracks, track];
    set({ tracks: newTracks });
    try {
      await AsyncStorage.setItem('sonicpulse_library', JSON.stringify(newTracks));
    } catch (e) {
      console.error('Failed to save track', e);
    }
  },

  loadTracks: async () => {
    set({ isLoading: true });
    try {
      const storedTracks = await AsyncStorage.getItem('sonicpulse_library');
      const storedPlaylists = await AsyncStorage.getItem('sonicpulse_playlists');
      if (storedTracks) {
        set({ tracks: JSON.parse(storedTracks) });
      }
      if (storedPlaylists) {
        set({ playlists: JSON.parse(storedPlaylists) });
      }
    } catch (e) {
      console.error('Error loading library', e);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteTrack: async (trackId: string) => {
    const { tracks, playlists } = get();
    const updatedTracks = tracks.filter((t) => t.id !== trackId);
    const updatedPlaylists = playlists.map((pl) => ({
      ...pl,
      trackIds: pl.trackIds.filter((id) => id !== trackId),
    }));

    set({ tracks: updatedTracks, playlists: updatedPlaylists });

    try {
      await AsyncStorage.setItem('sonicpulse_library', JSON.stringify(updatedTracks));
      await AsyncStorage.setItem('sonicpulse_playlists', JSON.stringify(updatedPlaylists));
    } catch (e) {
      console.error('Failed to delete track', e);
    }
  },

  clearLibrary: async () => {
    set({ tracks: [] });
    try {
      await AsyncStorage.removeItem('sonicpulse_library');
    } catch (e) {
      console.error('Failed to clear library', e);
    }
  },

  toggleFavorite: (trackId) => {
    const { tracks } = get();
    const newTracks = tracks.map(t => t.id === trackId ? { ...t, isFavorite: !t.isFavorite } : t);
    set({ tracks: newTracks });
    AsyncStorage.setItem('sonicpulse_library', JSON.stringify(newTracks)).catch(e => console.error('Failed to save favorite', e));
  },

  addPlaylist: (name) => {
    const newPlaylist: Playlist = {
      id: `${Date.now()}`,
      name,
      trackIds: [],
      createdAt: Date.now(),
    };
    const updated = [...get().playlists, newPlaylist];
    set({ playlists: updated });
    AsyncStorage.setItem('sonicpulse_playlists', JSON.stringify(updated)).catch(e => console.error('Failed to save playlists', e));
  },

  addTrackToPlaylist: (playlistId, trackId) => {
    const { playlists } = get();
    const updated = playlists.map(pl => pl.id === playlistId ? { ...pl, trackIds: [...pl.trackIds, trackId] } : pl);
    set({ playlists: updated });
    AsyncStorage.setItem('sonicpulse_playlists', JSON.stringify(updated)).catch(e => console.error('Failed to save playlists', e));
  },

  removeTrackFromPlaylist: (playlistId, trackId) => {
    const { playlists } = get();
    const updated = playlists.map(pl => pl.id === playlistId ? { ...pl, trackIds: pl.trackIds.filter(id => id !== trackId) } : pl);
    set({ playlists: updated });
    AsyncStorage.setItem('sonicpulse_playlists', JSON.stringify(updated)).catch(e => console.error('Failed to save playlists', e));
  }
}));
