import { useRef, useEffect, useState } from "react";
import { Song } from "@/types/music";

interface AudioPlayerProps {
  song: Song | null;
  isPlaying: boolean;
  volume: number;
  onTimeUpdate: (currentTime: number) => void;
  onLoadedMetadata: (duration: number) => void;
  onEnded: () => void;
}

export default function AudioPlayer({
  song,
  isPlaying,
  volume,
  onTimeUpdate,
  onLoadedMetadata,
  onEnded
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !song) return;

    const handleTimeUpdate = () => {
      onTimeUpdate(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      onLoadedMetadata(audio.duration);
      setIsLoaded(true);
    };

    const handleEnded = () => {
      onEnded();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [song, onTimeUpdate, onLoadedMetadata, onEnded]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isLoaded) return;

    if (isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [isPlaying, isLoaded]);

  if (!song) return null;

  return (
    <audio
      ref={audioRef}
      src={song.fileUrl}
      preload="metadata"
      className="hidden"
    />
  );
}
