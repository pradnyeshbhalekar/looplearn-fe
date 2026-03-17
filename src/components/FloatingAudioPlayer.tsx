import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import AudioPlayer from "./AudioPlayer";
import { Headphones, X } from "lucide-react";

interface FloatingAudioPlayerProps {
  src: string;
}

const FloatingAudioPlayer: React.FC<FloatingAudioPlayerProps> = ({ src }) => {
  const [isFloating, setIsFloating] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // We float when the sentinel is NOT intersecting and it's ABOVE the viewport
        setIsFloating(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 }
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative w-full min-h-[160px] mb-12">
      {/* Sentinel for scroll detection */}
      <div ref={sentinelRef} className="absolute top-0 left-0 w-full h-1 pointer-events-none" />

      <motion.div
        layout
        transition={{ type: "spring", stiffness: 400, damping: 35, mass: 0.8 }}
        className={`z-[100] transition-all duration-500 overflow-hidden ${
          isFloating 
            ? "fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm md:left-auto md:translate-x-0 md:right-8 md:w-80 bg-white/70 dark:bg-black/70 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]" 
            : "relative w-full bg-blue-50/30 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/20"
        }`}
      >
        {/* Header - Floating version */}
        {isFloating && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-600/90 backdrop-blur-md p-3 px-4 flex items-center justify-between border-b border-white/10"
          >
            <div className="flex items-center gap-2 text-white">
              <Headphones size={16} strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live Audio</span>
            </div>
            <button 
              onClick={() => setIsFloating(false)}
              className="text-white/60 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X size={16} strokeWidth={3} />
            </button>
          </motion.div>
        )}

        {/* Header - Static version (only when not floating) */}
        {!isFloating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-4 p-6 pb-0"
          >
            <div className="p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/30">
              <Headphones size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight text-gray-900 dark:text-white uppercase">Commuter Mode</h3>
              <p className="text-xs font-bold text-blue-600/60 dark:text-blue-400/60 tracking-widest uppercase">Direct Neural Audio</p>
            </div>
          </motion.div>
        )}

        <div className={isFloating ? "p-4" : "p-6 pt-2"}>
          <AudioPlayer src={src} isFloating={isFloating} />
        </div>

        {/* Decorative element - Static version */}
        {!isFloating && (
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        )}
      </motion.div>
    </div>
  );
};

export default FloatingAudioPlayer;
