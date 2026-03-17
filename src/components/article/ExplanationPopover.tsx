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
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        transform: "translateX(-50%) translateY(-100%) translateY(-10px)",
        zIndex: 60,
      }}
      className="explanation-popover w-[450px] bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl p-3 px-5 animate-in fade-in zoom-in-95 duration-200"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Sparkles size={12} className="text-blue-600" />
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tutor</span>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
          <X size={14} />
        </button>
      </div>

      <div className="min-h-[40px]">
        {loading ? (
          <div className="flex items-center gap-3 py-1">
            <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Studying...</span>
          </div>
        ) : (
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed">
            {explanation || "Processing..."}
          </p>
        )}
      </div>
      
      {/* Arrow Down */}
      <div 
        className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-[#111] border-r border-b border-gray-200 dark:border-gray-800 rotate-45"
      />
    </div>
  );
};

export default ExplanationPopover;
