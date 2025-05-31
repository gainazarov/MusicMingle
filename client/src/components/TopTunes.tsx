import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import { Song } from "@/types/music";
import { Play, TrendingUp } from "lucide-react";

export default function TopTunes() {
  const { playTrack } = useMusicPlayer();

  const { data: topTunes, isLoading, error } = useQuery<Song[]>({
    queryKey: ["/api/songs/top-tunes?limit=6"],
  });

  if (error) {
    return (
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-400">Failed to load top tunes. Please try again later.</p>
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

  const formatPlays = (plays: number) => {
    if (plays >= 1000000) {
      return `${(plays / 1000000).toFixed(1)}M`;
    } else if (plays >= 1000) {
      return `${(plays / 1000).toFixed(1)}K`;
    }
    return plays.toString();
  };

  return (
    <section className="py-20 bg-gradient-to-r from-[#040A06] via-gray-900 to-[#040A06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-[#1CDBFF] to-[#F8DE6F] bg-clip-text text-transparent mb-4">
            Top Tunes of the Day
          </h2>
          <p className="text-gray-400 text-lg">Handpicked tracks that are trending right now</p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="song-card rounded-xl p-6 animate-pulse">
                <div className="w-full h-48 bg-gray-600 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topTunes?.map((song, index) => (
              <motion.div
                key={song.id}
                className="song-card rounded-xl p-6 group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, rotateY: 2 }}
                onClick={() => handlePlaySong(song)}
              >
                <div className="relative mb-4">
                  <img
                    src={song.coverImageUrl || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400"}
                    alt={song.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  
                  {/* Rank Badge */}
                  <div className="absolute top-3 left-3 w-8 h-8 bg-gradient-to-r from-[#FB6E1D] to-[#F8DE6F] rounded-full flex items-center justify-center text-white font-bold text-sm glow-orange">
                    #{index + 1}
                  </div>
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                    <Button
                      className="w-16 h-16 bg-gradient-to-r from-[#FB6E1D] to-[#F8DE6F] rounded-full flex items-center justify-center text-white glow-orange hover:scale-110 transition-transform duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlaySong(song);
                      }}
                    >
                      <Play className="w-6 h-6 ml-1" />
                    </Button>
                  </div>
                  
                  {/* Trending Icon */}
                  <div className="absolute top-3 right-3 p-2 bg-black/50 rounded-full">
                    <TrendingUp className="w-4 h-4 text-[#1CDBFF]" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-white group-hover:text-[#FB6E1D] transition-colors">
                    {song.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{song.artist}</p>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-gray-500">{formatDuration(song.duration)}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-[#1CDBFF] text-sm font-medium">
                        {formatPlays(song.plays || 0)} plays
                      </span>
                      
                      {/* Music Visualizer */}
                      <div className="music-visualizer">
                        <div className="bar"></div>
                        <div className="bar"></div>
                        <div className="bar"></div>
                        <div className="bar"></div>
                        <div className="bar"></div>
                      </div>
                    </div>
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
