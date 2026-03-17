import React from "react";
import { Terminal } from "lucide-react";

interface Breakdown {
  line: string;
  explanation: string;
}

interface PracticalArtifactProps {
  artifact_type: string;
  language: string;
  code: string;
  breakdown?: Breakdown[];
}

const PracticalArtifact: React.FC<PracticalArtifactProps> = ({ artifact_type, language, code, breakdown }) => {
  return (
    <div className="my-16 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
          <Terminal size={20} />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tight dark:text-white">Practical Artifact: {artifact_type}</h2>
      </div>

      <div className="bg-[#0D0D0D] rounded-[2rem] overflow-hidden border border-gray-800 shadow-2xl">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
            </div>
            <span className="ml-4 text-[10px] font-black tracking-widest text-white/40 uppercase font-mono">{language}</span>
          </div>
        </div>
        <pre className="p-8 text-sm font-mono text-emerald-400/90 overflow-x-auto leading-relaxed scrollbar-hide">
          <code>{code}</code>
        </pre>
      </div>

      {breakdown && breakdown.length > 0 && (
        <div className="grid gap-3">
          {breakdown.map((item, i) => (
            <div key={i} className="flex gap-4 p-5 rounded-2xl bg-gray-50/50 dark:bg-[#111]/50 border border-gray-100 dark:border-gray-800 group hover:border-emerald-500/30 transition-colors">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-500/5 flex items-center justify-center text-[10px] font-mono text-emerald-600/50">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="space-y-1">
                <code className="text-xs font-mono text-gray-900 dark:text-gray-100 font-bold block mb-1">{item.line}</code>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed italic">{item.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PracticalArtifact;
