import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import MusicPlayer from "@/components/MusicPlayer";
import SuggestedSongs from "@/components/SuggestedSongs";
import TopTunes from "@/components/TopTunes";
import { motion } from "framer-motion";
import { Music, TrendingUp, Heart, List } from "lucide-react";

export default function Home() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FB6E1D]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen pb-24">
      <Navigation />
      
      {/* Welcome Section */}
      <section className="hero-gradient pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl lg:text-6xl font-bold">
              <span className="text-white">Welcome back, </span>
              <span className="bg-gradient-to-r from-[#FB6E1D] to-[#F8DE6F] bg-clip-text text-transparent">
                {user?.firstName || 'Music Lover'}
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Ready to discover your next favorite track? Dive into personalized recommendations and trending hits.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div 
              className="song-card rounded-xl p-6 text-center group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-[#FB6E1D] to-[#F8DE6F] rounded-full flex items-center justify-center mx-auto mb-3">
                <Music className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-white group-hover:text-[#FB6E1D] transition-colors">Discovery</h3>
              <p className="text-sm text-gray-400">Find new music</p>
            </motion.div>

            <motion.div 
              className="song-card rounded-xl p-6 text-center group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-[#1CDBFF] to-[#F8DE6F] rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-white group-hover:text-[#1CDBFF] transition-colors">Trending</h3>
              <p className="text-sm text-gray-400">What's hot now</p>
            </motion.div>

            <motion.div 
              className="song-card rounded-xl p-6 text-center group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-[#F8DE6F] to-[#FB6E1D] rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-white group-hover:text-[#F8DE6F] transition-colors">Liked Songs</h3>
              <p className="text-sm text-gray-400">Your favorites</p>
            </motion.div>

            <motion.div 
              className="song-card rounded-xl p-6 text-center group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-[#1CDBFF] to-[#FB6E1D] rounded-full flex items-center justify-center mx-auto mb-3">
                <List className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-white group-hover:text-[#1CDBFF] transition-colors">Playlists</h3>
              <p className="text-sm text-gray-400">Your collections</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Top Tunes Section */}
      <TopTunes />

      {/* Suggested Songs Section */}
      <SuggestedSongs />

      {/* Music Player */}
      <MusicPlayer />
    </div>
  );
}
