import React, { useState, useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
import { explainApi } from "../../api/explain";
import ExplanationPopover from "./ExplanationPopover";

const TextSelectionExplainer: React.FC = () => {
  const [selectedText, setSelectedText] = useState("");
  const [context, setContext] = useState("");
  const [buttonPosition, setButtonPosition] = useState<{ top: number; left: number } | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<{ top: number; left: number } | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const explainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseUp = () => {
      // If popover is already open, don't show the explain button again for a new selection
      if (isPopoverOpen) return;

      const selection = window.getSelection();
      const text = selection?.toString().trim();

      if (text && text.length > 0 && text.length < 100) {
        const range = selection?.getRangeAt(0);
        if (range) {
          const rect = range.getBoundingClientRect();
          
          // Verify if selection is within the content area
          let isWithinContentArea = false;
          let node: HTMLElement | null = range.startContainer.parentElement;
          while (node && !["P", "LI", "H1", "H2", "H3", "ARTICLE"].includes(node.tagName)) {
            if (node.classList.contains("explain-content-area")) {
                isWithinContentArea = true;
                break;
            }
            node = node.parentElement;
          }
          
          // Double check parent if it's strictly one of the allowed tags but might have the class
          if (!isWithinContentArea && node?.classList.contains("explain-content-area")) {
              isWithinContentArea = true;
          }

          if (!isWithinContentArea) {
              setButtonPosition(null);
              return;
          }

          const contextText = node?.innerText || "";

          setSelectedText(text);
          setContext(contextText);
          setButtonPosition({
            top: rect.top - 45,
            left: rect.left + rect.width / 2,
          });
        }
      } else {
        setButtonPosition(null);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
        if (explainerRef.current && !explainerRef.current.contains(e.target as Node)) {
            setButtonPosition(null);
            
            // Also close popover if clicking outside
            const popoverEl = document.querySelector('.explanation-popover');
            if (popoverEl && !popoverEl.contains(e.target as Node)) {
                setIsPopoverOpen(false);
            }
        }
    };

    const handleScroll = () => {
        setButtonPosition(null);
        setIsPopoverOpen(false);
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isPopoverOpen]);

  const handleExplain = async () => {
    if (!buttonPosition) return;
    
    setPopoverPosition(buttonPosition);
    setIsPopoverOpen(true);
    setLoading(true);
    setExplanation(null);
    setButtonPosition(null);

    try {
      const data = await explainApi.fetchExplanation(selectedText, context);
      setExplanation(data.explanation);
    } catch (error) {
      setExplanation("Could not get explanation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {buttonPosition && (
        <div
          ref={explainerRef}
          style={{
            position: "fixed",
            top: buttonPosition.top,
            left: buttonPosition.left,
            transform: "translateX(-50%)",
            zIndex: 50,
          }}
          className="animate-in fade-in zoom-in-95 duration-200"
        >
          <button
            onClick={(e) => {
                e.stopPropagation();
                handleExplain();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl shadow-blue-500/30 transition-all hover:scale-105 active:scale-95 group"
          >
            <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Explain</span>
          </button>
        </div>
      )}

      {popoverPosition && (
          <ExplanationPopover
            isOpen={isPopoverOpen}
            onClose={() => setIsPopoverOpen(false)}
            explanation={explanation}
            loading={loading}
            position={popoverPosition}
          />
      )}
    </>
  );
};

export default TextSelectionExplainer;
