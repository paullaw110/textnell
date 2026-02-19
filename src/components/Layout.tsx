"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

// Floating confetti component
const ConfettiPiece = ({ delay = 0 }: { delay?: number }) => (
  <div 
    className="absolute animate-confetti opacity-70"
    style={{ 
      left: `${Math.random() * 100}%`, 
      animationDelay: `${delay}s`,
      animationDuration: `${3 + Math.random() * 2}s`
    }}
  >
    <div 
      className="w-2 h-2 rotate-45"
      style={{ 
        backgroundColor: ['#ff6b4a', '#FFD93D', '#ff9f7a', '#ffd93d'][Math.floor(Math.random() * 4)]
      }}
    />
  </div>
);

const BirthdayCakeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="animate-float">
    <rect x="4" y="13" width="16" height="8" rx="2" fill="#ff6b4a" />
    <rect x="6" y="11" width="12" height="4" rx="1" fill="#FFD93D" />
    <rect x="8" y="9" width="8" height="4" rx="1" fill="#ff9f7a" />
    <line x1="10" y1="5" x2="10" y2="9" stroke="#ff6b4a" strokeWidth="2" strokeLinecap="round" />
    <line x1="12" y1="4" x2="12" y2="9" stroke="#ff6b4a" strokeWidth="2" strokeLinecap="round" />
    <line x1="14" y1="5" x2="14" y2="9" stroke="#ff6b4a" strokeWidth="2" strokeLinecap="round" />
    <circle cx="10" cy="4" r="1.5" fill="#FFD93D" />
    <circle cx="12" cy="3" r="1.5" fill="#FFD93D" />
    <circle cx="14" cy="4" r="1.5" fill="#FFD93D" />
  </svg>
);

export default function Layout({ children, showNavigation = true }: LayoutProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Show confetti on page load
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF8F0] text-[#1a1a2e] relative overflow-x-hidden">
      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <ConfettiPiece key={i} delay={i * 0.2} />
          ))}
        </div>
      )}
      
      {showNavigation && (
        <nav className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-[#e5e7eb] shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link 
                href="/" 
                className="flex items-center space-x-2 text-2xl font-display font-bold text-[#1a1a2e] hover:text-[#ff6b4a] transition-colors"
              >
                <BirthdayCakeIcon />
                <span>Nell</span>
              </Link>
              <a
                href="sms:+12795290731"
                className="bg-[#ff6b4a] text-white px-6 py-3 rounded-full font-medium hover:bg-[#e55a3a] transition-all duration-200 btn-bounce shadow-lg"
              >
                Text Nell 💬
              </a>
            </div>
          </div>
        </nav>
      )}
      
      <main className="flex-1 relative z-10">
        {children}
      </main>
      
      <footer className="bg-white border-t border-[#e5e7eb] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-8">
              <Link 
                href="/" 
                className="flex items-center space-x-2 text-xl font-display font-bold text-[#1a1a2e]"
              >
                <BirthdayCakeIcon />
                <span>Nell</span>
              </Link>
              <div className="flex space-x-6 text-sm">
                <Link 
                  href="/privacy" 
                  className="text-[#6b7280] hover:text-[#1a1a2e] transition-colors"
                >
                  Privacy
                </Link>
                <Link 
                  href="/terms" 
                  className="text-[#6b7280] hover:text-[#1a1a2e] transition-colors"
                >
                  Terms
                </Link>
              </div>
            </div>
            <div className="text-sm text-[#6b7280]">
              Made with 💝 by Nell • © 2026
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}