import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Volume2, 
  Heart,
  List,
  Monitor
} from "lucide-react";

export default function MusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlay,
    nextTrack,
    previousTrack,
    setVolume,
    seekTo,
    toggleLike,
    isLiked
  } = useMusicPlayer();

  const [showVolume, setShowVolume] = useState(false);

  if (!currentTrack) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed bottom-0 left-0 right-0 glass-effect border-t border-[#FB6E1D]/20 z-40"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Currently Playing */}
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <img 
                src={currentTrack.coverImageUrl || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60"}
                alt={currentTrack.title}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-white truncate">{currentTrack.title}</h4>
                <p className="text-sm text-gray-400 truncate">{currentTrack.artist}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className={`transition-colors ${
                  isLiked ? "text-red-500 hover:text-red-400" : "text-gray-400 hover:text-[#FB6E1D]"
                }`}
                onClick={toggleLike}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
              </Button>
            </div>

            {/* Player Controls */}
            <div className="flex flex-col items-center space-y-2 flex-1 max-w-md">
              <div className="flex items-center space-x-6">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Shuffle className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={previousTrack}
                >
                  <SkipBack className="w-5 h-5" />
                </Button>
                
                <Button
                  className="play-button w-12 h-12 rounded-full flex items-center justify-center"
                  onClick={togglePlay}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white ml-1" />
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={nextTrack}
                >
                  <SkipForward className="w-5 h-5" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Repeat className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Progress Bar */}
              <div className="flex items-center space-x-3 w-full">
                <span className="text-xs text-gray-400 w-10 text-right">
                  {formatTime(currentTime)}
                </span>
                <div className="flex-1 relative">
                  <div className="w-full h-1 bg-gray-600 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#FB6E1D] to-[#F8DE6F] rounded-full transition-all duration-100"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <Slider
                    value={[progressPercentage]}
                    max={100}
                    step={0.1}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onValueChange={(value) => {
                      const newTime = (value[0] / 100) * duration;
                      seekTo(newTime);
                    }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-10">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Volume and Additional Controls */}
            <div className="flex items-center space-x-4 flex-1 justify-end">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <List className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Monitor className="w-4 h-4" />
              </Button>
              
              <div 
                className="flex items-center space-x-2"
                onMouseEnter={() => setShowVolume(true)}
                onMouseLeave={() => setShowVolume(false)}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
                
                <AnimatePresence>
                  {showVolume && (
                    <motion.div 
                      className="w-20 flex items-center"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 80 }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="w-full h-1 bg-gray-600 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#1CDBFF] rounded-full"
                          style={{ width: `${volume}%` }}
                        />
                      </div>
                      <Slider
                        value={[volume]}
                        max={100}
                        step={1}
                        className="absolute w-20 opacity-0 cursor-pointer"
                        onValueChange={(value) => setVolume(value[0])}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
