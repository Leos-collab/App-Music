export interface Track {
  id: string;
  uri: string;
  title: string;
  artist?: string;
  album?: string;
  duration?: number;
  coverUri?: string;
  format?: string;
  filename?: string;
  isFavorite?: boolean; // new field for favorite status
}

export interface Playlist {
  id: string;               // UUID
  name: string;              // playlist name
  trackIds: string[];        // ordered list of track IDs
  createdAt: number;         // timestamp of creation
}
