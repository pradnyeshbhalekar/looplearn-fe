import React, { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AudioPlayerProps {
    src: string;
    isFloating?: boolean;
}

const AudioPlayer = ({ src, isFloating }: AudioPlayerProps) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
    }, [src]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100 || 0);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (audioRef.current) {
            const rect = e.currentTarget.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            audioRef.current.currentTime = pos * audioRef.current.duration;
        }
    };

    const formatTime = (time: number) => {
        if (isNaN(time) || !isFinite(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    return (
        <div className={`flex flex-col gap-2 relative z-10 w-full rounded-xl transition-all duration-200 ${
            isFloating ? "" : "mt-4 bg-white/50 dark:bg-black/20 backdrop-blur-sm p-4 border border-blue-100/50 dark:border-blue-900/20"
        }`}>
            <div className="flex items-center gap-4">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={togglePlay}
                    className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 flex items-center justify-center bg-blue-600 text-white rounded-full transition-all shadow-lg shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    aria-label={isPlaying ? "Pause" : "Play"}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isPlaying ? "pause" : "play"}
                            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                            animate={{ opacity: 1, rotate: 0, scale: 1 }}
                            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                            transition={{ duration: 0.15 }}
                        >
                            {isPlaying ? (
                                <Pause size={20} fill="currentColor" />
                            ) : (
                                <Play size={20} fill="currentColor" className="ml-1" />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </motion.button>

                <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-[11px] font-bold text-gray-400 dark:text-gray-500 mb-2 tabular-nums tracking-widest uppercase">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                    <div
                        className="h-1.5 w-full bg-gray-200/50 dark:bg-gray-800/50 rounded-full overflow-hidden cursor-pointer flex items-center relative group"
                        onClick={handleSeek}
                    >
                        {/* Background line */}
                        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 opacity-30" />
                        
                        {/* Progress line */}
                        <motion.div
                            className="h-full bg-blue-600 rounded-full relative z-10"
                            animate={{ width: `${progress}%` }}
                            transition={{ type: "spring", bounce: 0, duration: 0.1 }}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg border border-blue-100 dark:border-blue-900/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                    </div>
                </div>
            </div>
            <audio
                ref={audioRef}
                src={src}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
            />
        </div>
    );
};

export default AudioPlayer;
