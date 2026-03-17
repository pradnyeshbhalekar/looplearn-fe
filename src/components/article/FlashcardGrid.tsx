import React from "react";
import { HelpCircle, ChevronRight, MessageSquare } from "lucide-react";

interface Flashcard {
  question: string;
  answer: string;
}

interface FlashcardGridProps {
  flashcards: Flashcard[];
}

const FlashcardGrid: React.FC<FlashcardGridProps> = ({ flashcards }) => {
  if (!flashcards || flashcards.length === 0) return null;

  return (
    <div className="my-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600">
          <MessageSquare size={20} />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tight dark:text-white">Active Recall (Interview Ready)</h2>
      </div>
      
      <div className="grid gap-4">
        {flashcards.map((card, i) => (
          <details key={i} className="group bg-white dark:bg-[#0A0A0A] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-300 hover:border-orange-500/30">
            <summary className="p-6 cursor-pointer list-none flex items-center justify-between font-bold text-gray-800 dark:text-gray-200">
              <span className="flex items-center gap-4">
                <HelpCircle size={18} className="text-orange-500" />
                {card.question}
              </span>
              <ChevronRight size={18} className="transition-transform group-open:rotate-90 text-gray-400" />
            </summary>
            <div className="px-6 pb-6 text-gray-600 dark:text-gray-400 font-medium leading-relaxed border-t border-gray-50 dark:border-gray-900/50 pt-4 animate-in fade-in slide-in-from-top-2">
              {card.answer}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
};

export default FlashcardGrid;
