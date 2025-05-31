import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import SuggestedSongs from "@/components/SuggestedSongs";
import TopTunes from "@/components/TopTunes";
import Avatar3D from "@/components/Avatar3D";
import { Button } from "@/components/ui/button";
import { Music, Play, Download, Star, Users, TrendingUp } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="hero-gradient min-h-screen flex items-center pt-16 relative overflow-hidden">
        {/* Floating Orbs */}
        <div className="floating-orb w-64 h-64 top-20 left-10 animate-orb-float"></div>
        <div className="floating-orb-blue w-48 h-48 top-40 right-20 animate-orb-float" style={{ animationDelay: '2s' }}></div>
        <div className="floating-orb-yellow w-32 h-32 bottom-32 left-1/4 animate-orb-float" style={{ animationDelay: '4s' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-4">
                <motion.h1 
                  className="text-5xl lg:text-7xl font-bold leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <span className="bg-gradient-to-r from-[#FB6E1D] via-[#F8DE6F] to-[#1CDBFF] bg-clip-text text-transparent animate-gradient bg-[length:200%_200%]">
                    Experience
                  </span>
                  <br />
                  <span className="neon-text text-white">Music Like</span>
                  <br />
                  <span className="bg-gradient-to-r from-[#1CDBFF] to-[#FB6E1D] bg-clip-text text-transparent animate-gradient bg-[length:200%_200%]">
                    Never Before
                  </span>
                </motion.h1>
                <motion.p 
                  className="text-xl text-gray-300 max-w-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  Discover, stream, and share music with the most immersive platform designed for the next generation of music lovers.
                </motion.p>
              </div>
              
              {/* Stats */}
              <motion.div 
                className="flex space-x-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#1CDBFF]">5.2M</div>
                  <div className="text-sm text-gray-400">Total Plays</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#F8DE6F]">150K</div>
                  <div className="text-sm text-gray-400">Artists</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#FB6E1D]">2.1M</div>
                  <div className="text-sm text-gray-400">Users</div>
                </div>
              </motion.div>
              
              {/* CTA Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-[#FB6E1D] to-[#F8DE6F] text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:shadow-[#FB6E1D]/30 transition-all duration-300 transform hover:scale-105"
                  onClick={() => window.location.href = "/api/login"}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start Listening
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="glass-effect border-[#1CDBFF]/50 text-[#1CDBFF] px-8 py-4 rounded-xl font-semibold hover:bg-[#1CDBFF]/10 transition-all duration-300"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download App
                </Button>
              </motion.div>
            </motion.div>
            
            {/* Right Content - Enhanced 3D Avatar */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Avatar3D />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Top Tunes Section */}
      <TopTunes />

      {/* Suggested Songs Section */}
      <SuggestedSongs />

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose BeatFlow?</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Experience music like never before with our cutting-edge features and immersive design
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="text-center p-8 song-card rounded-xl group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-[#FB6E1D] to-[#F8DE6F] rounded-full flex items-center justify-center mx-auto mb-6 glow-orange group-hover:scale-110 transition-transform duration-300">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">AI-Powered Discovery</h3>
              <p className="text-gray-400">Smart algorithms that learn your taste and suggest perfect tracks tailored just for you.</p>
            </motion.div>

            <motion.div 
              className="text-center p-8 song-card rounded-xl group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-[#1CDBFF] to-[#F8DE6F] rounded-full flex items-center justify-center mx-auto mb-6 glow-blue group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">High-Quality Audio</h3>
              <p className="text-gray-400">Crystal clear sound with lossless audio streaming for the ultimate listening experience.</p>
            </motion.div>

            <motion.div 
              className="text-center p-8 song-card rounded-xl group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-[#F8DE6F] to-[#FB6E1D] rounded-full flex items-center justify-center mx-auto mb-6 glow-yellow group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Social Sharing</h3>
              <p className="text-gray-400">Connect with friends, share playlists, and discover music through your social network.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 mt-20 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-[#FB6E1D] to-[#F8DE6F] bg-clip-text text-transparent">
                BeatFlow
              </h3>
              <p className="text-gray-400">
                The next-generation music platform for discovering, streaming, and sharing music.
              </p>
            </div>
            
            {/* Product */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Product</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-[#FB6E1D] transition-colors">Features</a>
                <a href="#" className="block text-gray-400 hover:text-[#FB6E1D] transition-colors">Pricing</a>
                <a href="#" className="block text-gray-400 hover:text-[#FB6E1D] transition-colors">API</a>
                <a href="#" className="block text-gray-400 hover:text-[#FB6E1D] transition-colors">Mobile App</a>
              </div>
            </div>
            
            {/* Company */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Company</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-[#FB6E1D] transition-colors">About</a>
                <a href="#" className="block text-gray-400 hover:text-[#FB6E1D] transition-colors">Blog</a>
                <a href="#" className="block text-gray-400 hover:text-[#FB6E1D] transition-colors">Careers</a>
                <a href="#" className="block text-gray-400 hover:text-[#FB6E1D] transition-colors">Press</a>
              </div>
            </div>
            
            {/* Support */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Support</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-[#FB6E1D] transition-colors">Help Center</a>
                <a href="#" className="block text-gray-400 hover:text-[#FB6E1D] transition-colors">Contact Us</a>
                <a href="#" className="block text-gray-400 hover:text-[#FB6E1D] transition-colors">Privacy Policy</a>
                <a href="#" className="block text-gray-400 hover:text-[#FB6E1D] transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 BeatFlow. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">Privacy</span>
              <span className="text-gray-400 text-sm">Terms</span>
              <span className="text-gray-400 text-sm">Cookies</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
