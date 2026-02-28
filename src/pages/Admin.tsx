import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Play, Activity, Database, Layers, Search, Check, X, Clock, Terminal } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import type { Candidate, PipelineStatus } from "../types/admin";

const BACKEND_URI = import.meta.env.VITE_API_BASE_URL;

export const Admin: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [pipelineJob, setPipelineJob] = useState<PipelineStatus | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const token = localStorage.getItem("token");

  // API: Fetch Pending Candidates
  const fetchCandidates = useCallback(async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      };

      const res = await fetch(`${BACKEND_URI}/api/admin/candidates/`, { headers });
      const data = await res.json();
      setCandidates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Queue fetch error:", err);
    }
  }, [token]);

  useEffect(() => { fetchCandidates(); }, [fetchCandidates]);

  // API: Pipeline Status Polling
  const checkStatus = useCallback(async (id: string) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      };
      const res = await fetch(`${BACKEND_URI}/api/pipeline/status/${id}/`, { headers });
      const data = await res.json();
      setPipelineJob(data);
      if (data.status === "completed") fetchCandidates();
    } catch (e) { console.error(e); }
  }, [token, fetchCandidates]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (pipelineJob?.job_id && pipelineJob.status !== "completed" && pipelineJob.status !== "failed") {
      interval = setInterval(() => checkStatus(pipelineJob.job_id), 3000);
    }
    return () => clearInterval(interval);
  }, [pipelineJob, checkStatus]);

  const runPipeline = async () => {
    setLoading(true);
    try {
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      };
      const res = await fetch(`${BACKEND_URI}/api/pipeline/run/`, { method: "POST", headers });
      const data = await res.json();
      setPipelineJob({ job_id: data.job_id, status: "pending", result: null, error: null });
    } catch (err) { alert("Pipeline failed"); }
    finally { setLoading(false); }
  };

  const handleAction = async (action: 'approve' | 'reject', id: string) => {
    const url = `${BACKEND_URI}/api/admin/candidates/${action}/${id}/`;
    try {
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      };
      const res = await fetch(url, { 
        method: "POST", 
        headers, 
        body: action === 'reject' ? JSON.stringify({ reason: rejectReason }) : undefined 
      });
      if (res.ok) {
        setCandidates(prev => prev.filter(c => c.id !== id));
        setSelectedArticle(null);
        setIsRejecting(false);
      }
    } catch (e) { alert(`${action} failed`); }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#080808] text-black dark:text-white">
      <Navbar />
      <main className="max-w-[1500px] mx-auto px-6 pt-32 pb-20">
        
        {/* HEADER */}
        <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-2">Internal Tools</p>
            <h1 className="text-6xl font-black uppercase tracking-tighter">Command Center</h1>
          </div>
          <button onClick={runPipeline} disabled={loading} className="px-10 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all">
            {loading ? <Activity className="animate-spin" /> : <Play size={14} className="mr-2 inline" />} Run Pipeline
          </button>
        </header>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* QUEUE */}
          <div className="lg:col-span-4 space-y-6">
            {pipelineJob && (
              <div className="p-6 rounded-3xl bg-blue-600/5 border border-blue-600/20">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-2"><Terminal size={12}/> Job Status</span>
                  <span className="text-[10px] font-black uppercase bg-blue-600 text-white px-2 py-0.5 rounded animate-pulse">{pipelineJob.status}</span>
                </div>
                <p className="font-mono text-[9px] text-gray-400 break-all">{pipelineJob.job_id}</p>
              </div>
            )}

            <div className="bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-gray-900 rounded-[2rem] overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-900 font-black text-[10px] uppercase tracking-widest">Review Queue ({candidates.length})</div>
              {candidates.map(c => (
                <button key={c.id} onClick={() => setSelectedArticle(c)} className={`w-full p-6 text-left border-b border-gray-50 dark:border-gray-900 transition-all ${selectedArticle?.id === c.id ? 'bg-blue-600/10' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                  <h3 className="font-black text-sm uppercase leading-tight">{c.title}</h3>
                  <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase"><Clock size={10} className="inline mr-1"/> {new Date(c.created_at).toLocaleDateString()}</p>
                </button>
              ))}
            </div>
          </div>

          {/* PREVIEW */}
          <div className="lg:col-span-8">
            {selectedArticle ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-gray-900 rounded-[2.5rem] overflow-hidden sticky top-28">
                <div className="p-8 border-b border-gray-100 dark:border-gray-900 flex justify-between items-center">
                  <div className="flex gap-4">
                    <button onClick={() => handleAction('approve', selectedArticle.id)} className="bg-green-600 text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-green-700 transition-all"><Check size={14}/> Approve</button>
                    <button onClick={() => setIsRejecting(true)} className="bg-red-600 text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-red-700 transition-all"><X size={14}/> Reject</button>
                  </div>
                </div>
                <div className="p-12 h-[60vh] overflow-y-auto prose dark:prose-invert max-w-none">
                  <h1 className="text-4xl font-black uppercase tracking-tighter mb-8">{selectedArticle.title}</h1>
                  <ReactMarkdown>{selectedArticle.article_md}</ReactMarkdown>
                  <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4"><Layers size={12} className="inline mr-2"/> Diagram Source</p>
                    <pre className="bg-black text-blue-500 p-6 rounded-xl text-xs overflow-x-auto">{selectedArticle.diagram}</pre>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-[60vh] border-2 border-dashed border-gray-100 dark:border-gray-900 rounded-[3rem] flex items-center justify-center text-gray-400"><Search className="mr-4"/> <span className="font-black uppercase text-[10px] tracking-widest">Select a briefing for review</span></div>
            )}
          </div>
        </div>
      </main>

      {/* REJECT MODAL */}
      <AnimatePresence>
        {isRejecting && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-md bg-black/40">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-[#111] p-10 rounded-[2rem] w-full max-w-lg border border-gray-200 dark:border-gray-800 shadow-2xl">
              <h2 className="text-2xl font-black uppercase tracking-tight mb-4">Rejection Memo</h2>
              <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} className="w-full h-32 bg-gray-50 dark:bg-black p-4 rounded-xl border border-gray-200 dark:border-gray-800 outline-none focus:ring-2 ring-blue-600 mb-6 text-sm" placeholder="Reason for archival..."/>
              <div className="flex gap-4">
                <button onClick={() => handleAction('reject', selectedArticle!.id)} className="flex-1 py-3 bg-red-600 text-white rounded-full font-black text-[10px] uppercase tracking-widest">Confirm Rejection</button>
                <button onClick={() => setIsRejecting(false)} className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-full font-black text-[10px] uppercase tracking-widest">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;