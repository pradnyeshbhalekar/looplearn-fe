import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import mermaid from "mermaid";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Layers, Search, Check, X, Clock, Calendar, ZoomIn, ZoomOut, Maximize } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import type { Candidate } from "../types/admin";
import { Loader2 } from "lucide-react";
import AdminSkeleton from "../components/skeletons/AdminSkeleton";

mermaid.initialize({ startOnLoad: false, theme: 'dark' });

const BACKEND_URI = import.meta.env.VITE_API_BASE_URL;

export const Admin: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [queued, setQueued] = useState<Candidate[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Candidate | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'queued'>('pending');

  const mermaidRef = useRef<HTMLDivElement>(null);

  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const [isApproving, setIsApproving] = useState(false);
  const [publishDate, setPublishDate] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isActionInProgress, setIsActionInProgress] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch Candidates
  const fetchCandidates = useCallback(async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      };

      const [pendingRes, queuedRes] = await Promise.all([
        fetch(`${BACKEND_URI}/api/admin/candidates/`, { headers }),
        fetch(`${BACKEND_URI}/api/admin/candidates/queue`, { headers })
      ]);

      const pendingData = await pendingRes.json();
      const queuedData = await queuedRes.json();

      setCandidates(Array.isArray(pendingData) ? pendingData : []);
      setQueued(Array.isArray(queuedData) ? queuedData : []);
    } catch (err) {
      console.error("Queue fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchCandidates(); }, [fetchCandidates]);

  // Render Mermaid Diagram
  useEffect(() => {
    if (selectedArticle && selectedArticle.diagram && mermaidRef.current) {
      mermaidRef.current.innerHTML = "";
      try {
        mermaid.render(`mermaid-${selectedArticle.id}`, selectedArticle.diagram).then((result) => {
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = result.svg;
          }
        });
      } catch (err) {
        console.error("Mermaid parsing error:", err);
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = `<p class="text-red-500 text-xs">Failed to render diagram.</p>`;
        }
      }
    }
  }, [selectedArticle]);

  // Handle Approve / Reject
  const handleAction = async (action: 'approve' | 'reject', id: string) => {
    const url = `${BACKEND_URI}/api/admin/candidates/${action}/${id}`;

    try {
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      };

      let body;

      if (action === "reject") {
        if (!rejectReason.trim()) {
          alert("Rejection reason is required");
          return;
        }
        body = JSON.stringify({ reason: rejectReason });
      }

      if (action === "approve") {
        if (!publishDate) {
          alert("Publish date is required");
          return;
        }

        // Convert to ISO with time (00:00:00Z)
        const isoDate = new Date(publishDate).toISOString();

        body = JSON.stringify({ publish_date: isoDate });
      }

      setIsActionInProgress(true);
      const res = await fetch(url, {
        method: "POST",
        headers,
        body,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Request failed");
      }

      // Reset & Refresh
      await fetchCandidates();
      setSelectedArticle(null);
      setIsRejecting(false);
      setIsApproving(false);
      setRejectReason("");
      setPublishDate("");

    } catch (e: any) {
      alert(`${action} failed: ${e.message}`);
    } finally {
      setIsActionInProgress(false);
    }
  };

  const displayList = activeTab === 'pending' ? candidates : queued;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-black dark:text-white font-sans">
      <Navbar />

      <main className="max-w-[1500px] mx-auto px-4 sm:px-6 pt-32 pb-20">
        <header className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight">Command Center</h1>
          <p className="text-gray-500 mt-2 text-sm max-w-2xl leading-relaxed">
            Manage your daily article pipeline. Review AI-generated pending content or audit upcoming published drops.
          </p>
        </header>

        {isLoading ? (
          <AdminSkeleton />
        ) : (
          <div className="grid lg:grid-cols-12 gap-8">

          {/* Sidebar Queue List */}
          <div className="lg:col-span-4 flex flex-col h-[75vh]">
            <div className="bg-white dark:bg-[#0c0c0c] border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden flex flex-col h-full shadow-sm">

              {/* Tabs */}
              <div className="flex bg-gray-50 dark:bg-black/50 p-2 gap-2 border-b border-gray-200 dark:border-white/10">
                <button
                  onClick={() => { setActiveTab('pending'); setSelectedArticle(null); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${activeTab === 'pending' ? 'bg-white dark:bg-[#111] shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-black dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'}`}
                >
                  <Layers size={14} /> PENDING ({candidates.length})
                </button>
                <button
                  onClick={() => { setActiveTab('queued'); setSelectedArticle(null); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${activeTab === 'queued' ? 'bg-white dark:bg-[#111] shadow-sm text-green-600 dark:text-green-400' : 'text-gray-500 hover:text-black dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'}`}
                >
                  <Calendar size={14} /> SCHEDULED ({queued.length})
                </button>
              </div>

              {/* List */}
              <div className="overflow-y-auto flex-1 p-2">
                {displayList.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center gap-3">
                    <Check size={32} className="opacity-20" />
                    <p className="text-sm">No items in this queue.</p>
                  </div>
                ) : (
                  displayList.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedArticle(c)}
                      className={`w-full p-5 mb-2 rounded-2xl text-left border border-transparent transition-all ${selectedArticle?.id === c.id ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}
                    >
                      <h3 className={`font-bold text-sm leading-snug mb-2 ${selectedArticle?.id === c.id ? 'text-blue-700 dark:text-blue-300' : ''}`}>{c.title}</h3>
                      <div className="flex items-center gap-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                        <span className="flex items-center">
                          <Clock size={12} className="mr-1.5" />
                          {new Date(c.created_at).toLocaleDateString()}
                        </span>
                        {c.status === 'approved' && c.scheduled_for && (
                          <span className="flex items-center text-green-600/70 dark:text-green-400/70">
                            • {new Date(c.scheduled_for).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Main Preview Area */}
          <div className="lg:col-span-8 flex flex-col h-[75vh]">
            {selectedArticle ? (
              <div className="bg-white dark:bg-[#0c0c0c] border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden flex flex-col h-full shadow-sm">

                {/* Top Action Bar */}
                <div className="px-8 py-5 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-black/20">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${selectedArticle.status === 'pending' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'}`}>
                      {selectedArticle.status}
                    </span>
                    {selectedArticle.status === 'approved' && selectedArticle.scheduled_for && (
                      <span className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
                        <Calendar size={14} /> Drops on {new Date(selectedArticle.scheduled_for).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  {selectedArticle.status === 'pending' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => setIsApproving(true)}
                        disabled={isActionInProgress}
                        className="bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase flex items-center gap-2 hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                      >
                        {isActionInProgress ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Approve
                      </button>
                      <button
                        onClick={() => setIsRejecting(true)}
                        disabled={isActionInProgress}
                        className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-6 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase flex items-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50"
                      >
                        {isActionInProgress ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />} Reject
                      </button>
                    </div>
                  )}
                </div>

                {/* Article Content */}
                <div className="flex-1 p-8 sm:p-12 overflow-y-auto custom-scrollbar">
                  <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-8 leading-tight">{selectedArticle.title}</h1>

                    <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none prose-headings:font-black prose-h2:text-2xl prose-h3:text-xl prose-a:text-blue-500 hover:prose-a:text-blue-600 prose-img:rounded-xl">
                      <ReactMarkdown>{selectedArticle.article_md}</ReactMarkdown>
                    </div>

                    {selectedArticle.diagram && (
                      <div className="mt-16 pt-10 border-t border-gray-100 dark:border-white/5">
                        <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                          <Layers size={14} /> Mermaid Diagram Source
                        </p>
                        <TransformWrapper
                          initialScale={1}
                          minScale={0.2}
                          maxScale={5}
                          centerOnInit={true}
                        >
                          {({ zoomIn, zoomOut, resetTransform }) => (
                            <div className="relative border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-[#111] shadow-inner group cursor-grab active:cursor-grabbing">
                              {/* Zoom Controls */}
                              <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button
                                  onClick={() => zoomIn(0.5)}
                                  className="p-2.5 bg-white/90 dark:bg-black/90 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 backdrop-blur-md transition-all border border-gray-200 dark:border-gray-700 shadow-sm text-gray-700 dark:text-gray-300 hover:scale-105 active:scale-95"
                                  title="Zoom In"
                                >
                                  <ZoomIn size={16} />
                                </button>
                                <button
                                  onClick={() => zoomOut(0.5)}
                                  className="p-2.5 bg-white/90 dark:bg-black/90 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 backdrop-blur-md transition-all border border-gray-200 dark:border-gray-700 shadow-sm text-gray-700 dark:text-gray-300 hover:scale-105 active:scale-95"
                                  title="Zoom Out"
                                >
                                  <ZoomOut size={16} />
                                </button>
                                <button
                                  onClick={() => resetTransform()}
                                  className="p-2.5 bg-white/90 dark:bg-black/90 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 backdrop-blur-md transition-all border border-gray-200 dark:border-gray-700 shadow-sm text-gray-700 dark:text-gray-300 hover:scale-105 active:scale-95"
                                  title="Reset Zoom"
                                >
                                  <Maximize size={16} />
                                </button>
                              </div>

                              <TransformComponent wrapperClass="!w-full !h-full" contentClass="w-full flex justify-center min-h-[300px] p-6 sm:p-10">
                                <div ref={mermaidRef} className="w-full flex justify-center items-center" />
                              </TransformComponent>

                              <p className="absolute bottom-4 left-4 text-[10px] uppercase font-bold tracking-widest text-gray-400 opacity-50 select-none pointer-events-none">Scroll to zoom • Drag to pan</p>
                            </div>
                          )}
                        </TransformWrapper>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full bg-white dark:bg-[#0c0c0c] border border-gray-200 dark:border-white/10 rounded-3xl flex flex-col items-center justify-center text-gray-400 shadow-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative z-10 flex flex-col items-center"
                >
                  <div className="w-16 h-16 mb-6 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center">
                    <Search size={24} className="text-gray-400" />
                  </div>
                  <p className="font-bold text-lg text-gray-900 dark:text-gray-100">No Selection</p>
                  <p className="text-sm mt-2 max-w-[250px] text-center">Select an article from the sidebar queue to review its content and metadata.</p>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>

      {/* APPROVE MODAL */}
      <AnimatePresence>
        {isApproving && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-md p-6 z-[200]">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.2 }}
              className="bg-white dark:bg-[#111] p-8 border border-gray-200 dark:border-gray-800 rounded-3xl w-full max-w-md shadow-2xl"
            >
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center mb-6">
                <Calendar size={20} />
              </div>
              <h2 className="text-2xl font-black tracking-tight mb-2">Schedule Release</h2>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">Select the date this article should be published and sent to subscribed users.</p>

              <div className="mb-8">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 ml-1">Publish Date</label>
                <input
                  type="date"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className="w-full p-4 border border-gray-200 dark:border-gray-800 rounded-2xl dark:bg-black text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleAction("approve", selectedArticle!.id)}
                  className="flex-1 bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl text-xs font-black tracking-widest uppercase hover:scale-[1.02] transition-transform"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setIsApproving(false)}
                  className="flex-1 border border-gray-200 dark:border-gray-800 py-4 rounded-2xl text-xs font-black tracking-widest uppercase hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REJECT MODAL */}
      <AnimatePresence>
        {isRejecting && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-md p-6 z-[200]">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.2 }}
              className="bg-white dark:bg-[#111] p-8 border border-gray-200 dark:border-gray-800 rounded-3xl w-full max-w-md shadow-2xl"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center mb-6">
                <X size={20} />
              </div>
              <h2 className="text-2xl font-black tracking-tight mb-2">Reject Article</h2>
              <p className="text-gray-500 text-sm mb-8 leading-relaxed">Provide a reason for rejecting this AI-generated candidate. It will be moved out of the queue.</p>

              <div className="mb-8">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 ml-1">Rejection Note</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full h-32 p-4 border border-gray-200 dark:border-gray-800 rounded-2xl dark:bg-black text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Explain what went wrong..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleAction("reject", selectedArticle!.id)}
                  className="flex-1 bg-red-600 text-white py-4 rounded-2xl text-xs font-black tracking-widest uppercase hover:scale-[1.02] transition-transform"
                >
                  Reject Item
                </button>
                <button
                  onClick={() => setIsRejecting(false)}
                  className="flex-1 border border-gray-200 dark:border-gray-800 py-4 rounded-2xl text-xs font-black tracking-widest uppercase hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;