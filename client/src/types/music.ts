export interface Song {
  id: number;
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  duration: number; // in seconds
  fileUrl: string;
  coverImageUrl?: string;
  uploadedBy?: string;
  plays?: number;
  isPublic: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Playlist {
  id: number;
  name: string;
  description?: string;
  coverImageUrl?: string;
  userId: string;
  isPublic: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PlaylistSong {
  id: number;
  playlistId: number;
  songId: number;
  position: number;
  createdAt?: string;
  song?: Song;
}

export interface UserLike {
  id: number;
  userId: string;
  songId: number;
  createdAt?: string;
}

export interface MusicPlayerState {
  currentTrack: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  queue: Song[];
  currentIndex: number;
  repeat: 'none' | 'one' | 'all';
  shuffle: boolean;
}
