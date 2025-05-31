import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = () => {
    // Redirect to Replit Auth
    window.location.href = "/api/login";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass-effect border border-[#FB6E1D]/20">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-white">
              {isLogin ? "Welcome Back" : "Join BeatFlow"}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        <motion.div 
          className="space-y-6 pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-center space-y-4">
            <p className="text-gray-300">
              {isLogin 
                ? "Sign in to access your music library and personalized recommendations." 
                : "Create an account to start your musical journey with BeatFlow."
              }
            </p>
            
            <Button
              onClick={handleAuth}
              className="w-full bg-gradient-to-r from-[#FB6E1D] to-[#F8DE6F] text-white py-3 rounded-lg font-semibold hover:shadow-xl hover:shadow-[#FB6E1D]/30 transition-all duration-300"
            >
              {isLogin ? "Sign In with Replit" : "Sign Up with Replit"}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-gray-400">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-[#1CDBFF] hover:text-[#F8DE6F] transition-colors font-medium"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
