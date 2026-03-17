import React from "react";
import { Sparkles, Loader2, X } from "lucide-react";

interface ExplanationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  explanation: string | null;
  loading: boolean;
  position: { top: number; left: number };
}

const ExplanationPopover: React.FC<ExplanationPopoverProps> = ({
  isOpen,
  onClose,
  explanation,
  loading,
  position,
}) => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isOpen) return null;

  const style = isMobile 
    ? {
        position: "fixed" as const,
        top: position.top,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 100,
      }
    : {
        position: "fixed" as const,
        top: position.top,
        left: position.left,
        transform: "translateX(-50%) translateY(-100%) translateY(-10px)",
        zIndex: 60,
      };

  return (
    <div
      style={style}
      className={`explanation-popover bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl p-4 px-6 animate-in fade-in zoom-in-95 duration-200 ${
        isMobile ? 'w-[calc(100%-2rem)] max-w-sm' : 'w-[450px]'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-blue-600 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">AI Tutor Analysis</span>
        </div>
        <button onClick={onClose} className="p-1 -mr-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="min-h-[60px] max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-6 gap-3">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 animate-pulse">Synthesizing Context</span>
          </div>
        ) : (
          <p className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 leading-relaxed">
            {explanation || "Processing..."}
          </p>
        )}
      </div>
      
      {/* Arrow - Only on Desktop */}
      {!isMobile && (
        <div 
          className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-[#111] border-r border-b border-gray-200 dark:border-gray-800 rotate-45"
        />
      )}
    </div>
  );
};

export default ExplanationPopover;
