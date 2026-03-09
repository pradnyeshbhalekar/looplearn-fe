import { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";

interface AudioPlayerProps {
    src: string;
}

const AudioPlayer = ({ src }: AudioPlayerProps) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        // Reset state when src changes
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
        <div className="flex flex-col gap-2 mt-4 relative z-10 w-full bg-white dark:bg-[#0c0c0c] rounded-xl p-3 sm:p-4 border border-blue-100 dark:border-blue-900/40 shadow-sm transition-colors">
            <div className="flex items-center gap-4">
                <button
                    onClick={togglePlay}
                    className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-[#0c0c0c]"
                    aria-label={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? (
                        <Pause size={18} fill="currentColor" />
                    ) : (
                        <Play size={18} fill="currentColor" className="ml-1" />
                    )}
                </button>

                <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                    <div
                        className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden cursor-pointer flex items-center"
                        onClick={handleSeek}
                    >
                        <div
                            className="h-full bg-blue-600 transition-all duration-100 ease-linear rounded-full relative"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-sm" />
                        </div>
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
