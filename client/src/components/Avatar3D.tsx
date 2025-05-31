import { motion } from "framer-motion";
import { Music, Headphones, Waves, Zap } from "lucide-react";

export default function Avatar3D() {
  return (
    <div className="relative flex justify-center lg:justify-end">
      <div className="relative w-96 h-96">
        {/* Main Avatar Container */}
        <motion.div 
          className="relative w-full h-full"
          animate={{ 
            y: [0, -15, 0],
            rotateY: [0, 5, 0, -5, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Central Avatar Circle */}
          <div className="absolute inset-8 rounded-full glass-effect-strong animate-pulse-glow flex items-center justify-center overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FB6E1D]/30 via-transparent to-[#1CDBFF]/30"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(251,110,29,0.1)_0%,transparent_50%)]"></div>
            </div>
            
            {/* Headphones Icon */}
            <motion.div 
              className="relative z-10"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Headphones className="w-32 h-32 text-[#FB6E1D]" />
            </motion.div>
            
            {/* Sound Waves */}
            <motion.div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Waves className="w-24 h-24 text-[#1CDBFF] opacity-50" />
            </motion.div>
          </div>
          
          {/* Floating Music Elements */}
          <motion.div 
            className="absolute -top-6 -right-6 w-16 h-16 rounded-full glass-effect flex items-center justify-center glow-orange"
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 15, 0]
            }}
            transition={{ 
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Music className="w-8 h-8 text-[#F8DE6F]" />
          </motion.div>
          
          <motion.div 
            className="absolute -bottom-6 -left-6 w-12 h-12 rounded-full glass-effect flex items-center justify-center glow-blue"
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, -20, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            <Music className="w-6 h-6 text-[#1CDBFF]" />
          </motion.div>
          
          <motion.div 
            className="absolute top-8 -left-8 w-10 h-10 rounded-full glass-effect flex items-center justify-center glow-yellow"
            animate={{ 
              y: [0, -12, 0],
              x: [0, 8, 0]
            }}
            transition={{ 
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          >
            <Zap className="w-5 h-5 text-[#F8DE6F]" />
          </motion.div>
          
          {/* Energy Rings */}
          <motion.div 
            className="absolute inset-0 rounded-full border-2 border-[#FB6E1D]/30"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.8, 0.3, 0.8]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div 
            className="absolute inset-4 rounded-full border border-[#1CDBFF]/40"
            animate={{ 
              scale: [1, 1.15, 1],
              opacity: [0.6, 0.2, 0.6]
            }}
            transition={{ 
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
          
          {/* Particle Effects */}
          <div className="absolute inset-0">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-[#F8DE6F] rounded-full"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 3) * 20}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </motion.div>
        
        {/* Ambient Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FB6E1D]/20 via-[#F8DE6F]/10 to-[#1CDBFF]/20 animate-glow -z-10 blur-xl"></div>
        
        {/* Base Shadow */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-black/20 rounded-full blur-lg"></div>
      </div>
    </div>
  );
}