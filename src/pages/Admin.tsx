import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Play, Activity, Layers, Search, Check, X, Clock, Terminal } from "lucide-react";
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

  const [isApproving, setIsApproving] = useState(false);
  const [publishDate, setPublishDate] = useState("");

  const token = localStorage.getItem("token");

  // Fetch Candidates
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

      const res = await fetch(url, {
        method: "POST",
        headers,
        body,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Request failed");
      }

      // Reset
      setCandidates(prev => prev.filter(c => c.id !== id));
      setSelectedArticle(null);
      setIsRejecting(false);
      setIsApproving(false);
      setRejectReason("");
      setPublishDate("");

    } catch (e: any) {
      alert(`${action} failed: ${e.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#080808] text-black dark:text-white">
      <Navbar />

      <main className="max-w-[1500px] mx-auto px-6 pt-32 pb-20">
        <header className="mb-10">
          <h1 className="text-5xl font-black uppercase">Command Center</h1>
        </header>

        <div className="grid lg:grid-cols-12 gap-10">

          {/* Queue */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-[#0c0c0c] border rounded-2xl overflow-hidden">
              <div className="p-6 font-bold text-sm uppercase">
                Review Queue ({candidates.length})
              </div>

              {candidates.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedArticle(c)}
                  className="w-full p-6 text-left border-t hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  <h3 className="font-bold">{c.title}</h3>
                  <p className="text-xs text-gray-400 mt-2">
                    <Clock size={10} className="inline mr-1"/>
                    {new Date(c.created_at).toLocaleDateString()}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-8">
            {selectedArticle ? (
              <div className="bg-white dark:bg-[#0c0c0c] border rounded-2xl overflow-hidden">

                {/* Actions */}
                <div className="p-6 border-b flex gap-4">
                  <button
                    onClick={() => setIsApproving(true)}
                    className="bg-green-600 text-white px-6 py-2 rounded-full text-xs font-bold flex items-center gap-2"
                  >
                    <Check size={14}/> Approve
                  </button>

                  <button
                    onClick={() => setIsRejecting(true)}
                    className="bg-red-600 text-white px-6 py-2 rounded-full text-xs font-bold flex items-center gap-2"
                  >
                    <X size={14}/> Reject
                  </button>
                </div>

                <div className="p-8 h-[60vh] overflow-y-auto">
                  <h1 className="text-3xl font-bold mb-6">{selectedArticle.title}</h1>
                  <ReactMarkdown>{selectedArticle.article_md}</ReactMarkdown>

                  <div className="mt-10">
                    <p className="text-xs font-bold uppercase text-gray-400 mb-2">
                      <Layers size={12} className="inline mr-2"/> Diagram
                    </p>
                    <pre className="bg-black text-blue-400 p-4 rounded-lg text-xs overflow-x-auto">
                      {selectedArticle.diagram}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[60vh] border-dashed border-2 flex items-center justify-center text-gray-400 rounded-3xl">
                <Search className="mr-3"/>
                Select article
              </div>
            )}
          </div>
        </div>
      </main>

      {/* APPROVE MODAL */}
      <AnimatePresence>
        {isApproving && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md p-6 z-50">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-[#111] p-10 rounded-2xl w-full max-w-md"
            >
              <h2 className="text-xl font-bold mb-4">Set Publish Date</h2>

              <input
                type="date"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                className="w-full p-3 border rounded-lg mb-6 dark:bg-black"
              />

              <div className="flex gap-4">
                <button
                  onClick={() => handleAction("approve", selectedArticle!.id)}
                  className="flex-1 bg-green-600 text-white py-3 rounded-full text-xs font-bold"
                >
                  Confirm Approval
                </button>

                <button
                  onClick={() => setIsApproving(false)}
                  className="px-6 py-3 border rounded-full text-xs font-bold"
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
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md p-6 z-50">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-[#111] p-10 rounded-2xl w-full max-w-md"
            >
              <h2 className="text-xl font-bold mb-4">Rejection Reason</h2>

              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full h-32 p-3 border rounded-lg mb-6 dark:bg-black"
                placeholder="Reason..."
              />

              <div className="flex gap-4">
                <button
                  onClick={() => handleAction("reject", selectedArticle!.id)}
                  className="flex-1 bg-red-600 text-white py-3 rounded-full text-xs font-bold"
                >
                  Confirm Rejection
                </button>

                <button
                  onClick={() => setIsRejecting(false)}
                  className="px-6 py-3 border rounded-full text-xs font-bold"
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