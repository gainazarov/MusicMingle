import { useState, useCallback, useRef } from "react";
import { Song } from "@/types/music";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useMusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(75);
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedSongs, setLikedSongs] = useState<Set<number>>(new Set());

  const audioRef = useRef<HTMLAudioElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Play count mutation
  const playCountMutation = useMutation({
    mutationFn: async (songId: number) => {
      await apiRequest("POST", `/api/songs/${songId}/play`);
    },
    onError: (error) => {
      console.error("Failed to update play count:", error);
    }
  });

  // Like song mutation
  const likeMutation = useMutation({
    mutationFn: async (songId: number) => {
      await apiRequest("POST", `/api/songs/${songId}/like`);
    },
    onSuccess: (_, songId) => {
      setLikedSongs(prev => new Set(prev).add(songId));
      toast({
        title: "Song liked!",
        description: "Added to your liked songs.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to like song. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Unlike song mutation
  const unlikeMutation = useMutation({
    mutationFn: async (songId: number) => {
      await apiRequest("DELETE", `/api/songs/${songId}/like`);
    },
    onSuccess: (_, songId) => {
      setLikedSongs(prev => {
        const newSet = new Set(prev);
        newSet.delete(songId);
        return newSet;
      });
      toast({
        title: "Song unliked",
        description: "Removed from your liked songs.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to unlike song. Please try again.",
        variant: "destructive",
      });
    }
  });

  const playTrack = useCallback((song: Song, playlist?: Song[]) => {
    if (playlist) {
      setQueue(playlist);
      const index = playlist.findIndex(s => s.id === song.id);
      setCurrentIndex(index >= 0 ? index : 0);
    }
    
    setCurrentTrack(song);
    setIsPlaying(true);
    setCurrentTime(0);
    
    // Update play count
    playCountMutation.mutate(song.id);
    
    // Create and play audio
    if (audioRef.current) {
      audioRef.current.src = song.fileUrl;
      audioRef.current.load();
      audioRef.current.play().catch(console.error);
    }
  }, [playCountMutation]);

  const togglePlay = useCallback(() => {
    if (!currentTrack) return;
    
    const newIsPlaying = !isPlaying;
    setIsPlaying(newIsPlaying);
    
    if (audioRef.current) {
      if (newIsPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  const nextTrack = useCallback(() => {
    if (queue.length === 0) return;
    
    const nextIndex = (currentIndex + 1) % queue.length;
    setCurrentIndex(nextIndex);
    playTrack(queue[nextIndex], queue);
  }, [queue, currentIndex, playTrack]);

  const previousTrack = useCallback(() => {
    if (queue.length === 0) return;
    
    const prevIndex = currentIndex === 0 ? queue.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    playTrack(queue[prevIndex], queue);
  }, [queue, currentIndex, playTrack]);

  const seekTo = useCallback((time: number) => {
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);

  const toggleLike = useCallback(() => {
    if (!currentTrack) return;
    
    const isLiked = likedSongs.has(currentTrack.id);
    
    if (isLiked) {
      unlikeMutation.mutate(currentTrack.id);
    } else {
      likeMutation.mutate(currentTrack.id);
    }
  }, [currentTrack, likedSongs, likeMutation, unlikeMutation]);

  // Audio event handlers
  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  }, []);

  const handleEnded = useCallback(() => {
    nextTrack();
  }, [nextTrack]);

  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  }, []);

  // Initialize audio element
  if (!audioRef.current && typeof window !== 'undefined') {
    audioRef.current = new Audio();
    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioRef.current.addEventListener('ended', handleEnded);
    audioRef.current.volume = volume / 100;
  }

  return {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    queue,
    playTrack,
    togglePlay,
    nextTrack,
    previousTrack,
    seekTo,
    setVolume: handleVolumeChange,
    toggleLike,
    isLiked: currentTrack ? likedSongs.has(currentTrack.id) : false,
  };
}
