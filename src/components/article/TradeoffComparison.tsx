import React from "react";
import { CheckCircle2, XCircle, Scale } from "lucide-react";

interface Tradeoff {
  strategy: string;
  pros: string[];
  cons: string[];
}

interface TradeoffComparisonProps {
  tradeoffs: Tradeoff[];
}

const TradeoffComparison: React.FC<TradeoffComparisonProps> = ({ tradeoffs }) => {
  if (!tradeoffs || tradeoffs.length === 0) return null;

  return (
    <section className="my-20">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
          <Scale size={20} />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tight dark:text-white">Trade-off Comparison</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {tradeoffs.map((item, index) => (
          <div 
            key={index} 
            className="group relative bg-[#fafafa] dark:bg-[#0c0c0c] border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-8 transition-all hover:border-amber-500/20 shadow-sm"
          >
            <div className="mb-8">
              <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] block mb-2">Strategy</span>
              <h3 className="text-2xl font-black tracking-tight dark:text-white group-hover:text-amber-600 transition-colors">
                {item.strategy}
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-10">
              {/* Pros */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-500 font-black text-[10px] uppercase tracking-widest">
                  <CheckCircle2 size={14} /> Advantages
                </div>
                <ul className="space-y-3">
                  {item.pros.map((pro, i) => (
                    <li key={i} className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed flex items-start gap-2">
                       <span className="mt-1.5 w-1 h-1 rounded-full bg-green-500 shrink-0" />
                       {pro}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-500 font-black text-[10px] uppercase tracking-widest">
                  <XCircle size={14} /> Disadvantages
                </div>
                <ul className="space-y-3">
                  {item.cons.map((con, i) => (
                    <li key={i} className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed flex items-start gap-2">
                       <span className="mt-1.5 w-1 h-1 rounded-full bg-red-500 shrink-0" />
                       {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TradeoffComparison;
