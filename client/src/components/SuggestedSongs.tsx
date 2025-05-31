import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import { Song } from "@/types/music";
import { Play, Heart, MoreHorizontal } from "lucide-react";
import { useState } from "react";

export default function SuggestedSongs() {
  const { playTrack, isPlaying, currentTrack } = useMusicPlayer();
  const [hoveredSong, setHoveredSong] = useState<number | null>(null);

  const { data: songs, isLoading, error } = useQuery<Song[]>({
    queryKey: ["/api/songs/suggested"],
  });

  if (error) {
    return (
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-400">Failed to load suggested songs. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  const handlePlaySong = (song: Song) => {
    playTrack(song);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <motion.h2 
            className="text-3xl font-bold bg-gradient-to-r from-[#1CDBFF] to-[#FB6E1D] bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Suggested for You
          </motion.h2>
          <Button 
            variant="ghost" 
            className="text-[#FB6E1D] hover:text-[#F8DE6F] transition-colors"
          >
            View All
          </Button>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-effect rounded-xl p-4 animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gray-600 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-600 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/4"></div>
                  </div>
                  <div className="w-20 h-4 bg-gray-600 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {songs?.map((song, index) => (
              <motion.div
                key={song.id}
                className="glass-effect rounded-xl p-4 flex items-center space-x-4 group hover:bg-white/5 transition-all duration-300 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                onMouseEnter={() => setHoveredSong(song.id)}
                onMouseLeave={() => setHoveredSong(null)}
                onClick={() => handlePlaySong(song)}
              >
                <div className="relative">
                  <img
                    src={song.coverImageUrl || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80"}
                    alt={song.title}
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                  <div className={`absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center transition-opacity duration-300 ${
                    hoveredSong === song.id ? "opacity-100" : "opacity-0"
                  }`}>
                    <Button
                      size="sm"
                      className="w-8 h-8 rounded-full bg-[#FB6E1D] hover:bg-[#F8DE6F] p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlaySong(song);
                      }}
                    >
                      <Play className="w-4 h-4 text-white ml-0.5" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white group-hover:text-[#FB6E1D] transition-colors truncate">
                    {song.title}
                  </h3>
                  <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className="text-gray-500 text-sm">{formatDuration(song.duration)}</span>
                  
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle like functionality
                      }}
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white transition-colors p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle more options
                      }}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
