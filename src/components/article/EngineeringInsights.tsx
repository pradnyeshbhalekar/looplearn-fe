import React from "react";
import { Activity, AlertTriangle, ShieldCheck, Zap } from "lucide-react";

interface Metric {
  metric: string;
  importance: string;
}

interface AntiPattern {
  pattern: string;
  why_it_happens: string;
  consequence: string;
}

interface EngineeringInsightsProps {
  metrics?: Metric[];
  antiPatterns?: AntiPattern[];
}

const EngineeringInsights: React.FC<EngineeringInsightsProps> = ({ metrics, antiPatterns }) => {
  return (
    <div className="my-20 space-y-16">
      {metrics && metrics.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
              <Activity size={20} />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight dark:text-white">Observability Metrics</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {metrics.map((m, i) => (
              <div key={i} className="p-6 rounded-3xl bg-blue-50/30 dark:bg-blue-950/5 border border-blue-100/30 dark:border-blue-900/10">
                <div className="flex items-center gap-2 mb-2 text-blue-600 font-black text-xs uppercase tracking-widest">
                  <Zap size={14} /> {m.metric}
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed">
                  {m.importance}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {antiPatterns && antiPatterns.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-600">
              <AlertTriangle size={20} />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight dark:text-white">Common Anti-Patterns</h2>
          </div>
          <div className="space-y-4">
            {antiPatterns.map((a, i) => (
              <div key={i} className="p-8 rounded-[2rem] bg-red-50/10 dark:bg-red-950/5 border border-red-100/10 dark:border-red-900/10">
                <h3 className="text-lg font-black text-red-600 uppercase tracking-tight mb-2 flex items-center gap-2">
                   <ShieldCheck size={18} /> {a.pattern}
                </h3>
                <div className="grid sm:grid-cols-2 gap-6 mt-4">
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Root Cause</span>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 italic">{a.why_it_happens}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Consequence</span>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{a.consequence}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default EngineeringInsights;
