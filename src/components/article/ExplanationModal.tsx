import React from "react";
import { X, Sparkles, Loader2 } from "lucide-react";

interface ExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  text: string;
  explanation: string | null;
  loading: boolean;
}

const ExplanationModal: React.FC<ExplanationModalProps> = ({
  isOpen,
  onClose,
  text,
  explanation,
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-900 flex items-center justify-between bg-gray-50/50 dark:bg-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white">
              <Sparkles size={16} />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest dark:text-white">AI Tutor</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-gray-400"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="mb-6">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-2">Defining</span>
            <p className="text-xl font-bold dark:text-white leading-tight">"{text}"</p>
          </div>

          <div className="min-h-[100px] flex items-center">
            {loading ? (
              <div className="flex flex-col items-center justify-center w-full gap-4 py-8">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Synthesizing explanation...</p>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300 leading-relaxed italic">
                    {explanation || "The tutor is processing your request..."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-gray-50/50 dark:bg-white/5 border-t border-gray-100 dark:border-gray-900 flex justify-end">
             <button 
                onClick={onClose}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20"
             >
                Got it
             </button>
        </div>
      </div>
    </div>
  );
};

export default ExplanationModal;
