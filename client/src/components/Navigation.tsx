import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Menu, Search, Music, X } from "lucide-react";

export default function Navigation() {
  const [location, setLocation] = useLocation();
  type User = {
    firstName?: string;
    email?: string;
    profileImageUrl?: string;
  };
  // Передаём redirectOn401: false, если Navigation используется на публичной странице
  // Для универсальности: определяем публичность через пропс или контекст, либо временно отключаем редирект всегда
  const { isAuthenticated, user } = useAuth(false) as { isAuthenticated: boolean; user?: User };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState("en");

  const navItems = [
    { href: "/discover", label: "Discover" },
    { href: "/library", label: "Library" },
    { href: "/playlists", label: "Playlists" },
    { href: "/upload", label: "Upload" },
  ];

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      // Если используете localStorage/cookie для токена, очистите здесь
      setLocation("/login");
    } catch (e) {
      setLocation("/login");
    }
  }

  return (
    <nav className="fixed top-0 w-full z-50 glass-effect-strong">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FB6E1D] to-[#F8DE6F] flex items-center justify-center glow-orange">
              <Music className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#FB6E1D] to-[#F8DE6F] bg-clip-text text-transparent">
              BeatFlow
            </span>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href}
                  className={`transition-colors duration-300 ${
                    location === item.href 
                      ? "text-[#FB6E1D]" 
                      : "text-white hover:text-[#FB6E1D]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          {/* Search Bar (Desktop) */}
          {isAuthenticated && (
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Search songs, artists, playlists..."
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 text-white placeholder-white/60 focus:border-[#1CDBFF] focus:ring-2 focus:ring-[#1CDBFF]/30"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
              </div>
            </div>
          )}

          {/* Right Side Controls */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-20 bg-transparent border-white/30 text-white focus:border-[#FB6E1D]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="tj">TJ</SelectItem>
                <SelectItem value="ru">RU</SelectItem>
              </SelectContent>
            </Select>

            {/* Auth Buttons */}
            {!isAuthenticated ? (
              <>
                <Button 
                  variant="ghost" 
                  className="text-white hover:text-[#FB6E1D] transition-colors"
                  onClick={() => window.location.href = "/api/login"}
                >
                  Sign In
                </Button>
                <Button 
                  className="bg-gradient-to-r from-[#FB6E1D] to-[#F8DE6F] text-white hover:shadow-lg hover:shadow-[#FB6E1D]/30 transition-all duration-300"
                  onClick={() => window.location.href = "/api/login"}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                {user?.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FB6E1D] to-[#F8DE6F] flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user?.firstName?.[0] || user?.email?.[0] || "U"}
                    </span>
                  </div>
                )}
                <Button 
                  variant="ghost" 
                  className="text-white hover:text-[#FB6E1D] transition-colors"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 py-4">
            {/* Mobile Search */}
            {isAuthenticated && (
              <div className="mb-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search..."
                    className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 text-white placeholder-white/60"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
                </div>
              </div>
            )}

            {/* Mobile Navigation Items */}
            {isAuthenticated && (
              <div className="space-y-2">
                {navItems.map((item) => (
                  <Link 
                    key={item.href}
                    href={item.href}
                    className={`block py-2 px-4 rounded-lg transition-colors ${
                      location === item.href 
                        ? "bg-[#FB6E1D]/20 text-[#FB6E1D]" 
                        : "text-white hover:bg-white/10"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
