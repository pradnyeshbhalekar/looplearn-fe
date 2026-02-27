import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useTheme } from "../context/ThemeContext";
import { Clock, Calendar, ArrowRight, Layout } from "lucide-react";

export const Todays = () => {
  const { theme } = useTheme();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const diagramRef = useRef(null);

  const BACKEND_URI = import.meta.env.VITE_API_BASE_URL;

  // Reading Progress Logic
  useEffect(() => {
    const updateScroll = () => {
      const currentScroll = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress((currentScroll / scrollHeight) * 100);
    };
    window.addEventListener("scroll", updateScroll);
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  useEffect(() => {
    const fetchTodayArticle = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BACKEND_URI}/api/articles/today`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to load today's article.");
        const data = await response.json();
        setArticle(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTodayArticle();
  }, []);

  useEffect(() => {
    if (!article?.diagram) return;
    mermaid.initialize({
      startOnLoad: false,
      theme: theme === "dark" ? "dark" : "neutral",
      fontFamily: "Inter, ui-sans-serif, system-ui",
      look: "handDrawn", // Gives a slightly more custom feel
    });
    if (diagramRef.current) {
      diagramRef.current.removeAttribute("data-processed");
      diagramRef.current.innerHTML = article.diagram;
      mermaid.run({ nodes: [diagramRef.current] }).catch((err) => console.error(err));
    }
  }, [theme, article?.diagram]);

  const parseLine = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <span key={i} className="font-bold text-black dark:text-white underline decoration-blue-500/30 decoration-2 underline-offset-2">
          {part.slice(2, -2)}
        </span>
      ) : (
        part
      )
    );
  };

  const renderContent = (content) => {
    if (!content) return null;
    const lines = content.split("\n");
    const elements = [];
    let listBuffer = [];

    const flushList = (idx) => {
      if (listBuffer.length > 0) {
        elements.push(
          <ul key={`ul-${idx}`} className="my-10 space-y-5">
            {listBuffer}
          </ul>
        );
        listBuffer = [];
      }
    };

    lines.forEach((line, idx) => {
      if (line.startsWith("## ")) {
        flushList(idx);
        elements.push(
          <h2 key={idx} className="text-3xl font-black text-black dark:text-white mt-16 mb-6 tracking-tighter uppercase border-l-4 border-blue-600 pl-6">
            {line.replace("## ", "")}
          </h2>
        );
      } else if (line.startsWith("### ")) {
        flushList(idx);
        elements.push(
          <h3 key={idx} className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-12 mb-4 tracking-[0.2em] uppercase">
            {line.replace("### ", "")}
          </h3>
        );
      } else if (line.startsWith("- ")) {
        listBuffer.push(
          <li key={idx} className="flex items-start gap-4 text-gray-700 dark:text-gray-300 text-[1.1rem] leading-relaxed">
            <div className="mt-2 w-1.5 h-1.5 bg-blue-600 shrink-0 rotate-45" />
            <span>{parseLine(line.replace("- ", ""))}</span>
          </li>
        );
      } else if (line.trim() !== "") {
        flushList(idx);
        elements.push(
          <p key={idx} className="text-gray-700 dark:text-gray-300 text-[1.15rem] leading-[1.8] mb-8 font-medium opacity-90">
            {parseLine(line)}
          </p>
        );
      }
    });

    flushList(lines.length);
    return elements;
  };

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-gray-100 dark:bg-gray-900">
        <div 
          className="h-full bg-blue-600 transition-all duration-150" 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="min-h-screen bg-white dark:bg-[#080808] transition-colors duration-300">
        <Navbar />

        <main className="max-w-[740px] mx-auto px-6 pt-24 pb-32">
          
          {loading && <div className="animate-pulse space-y-6 pt-12">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-16 w-full bg-gray-200 dark:bg-gray-800 rounded" />
            <div className="h-64 w-full bg-gray-200 dark:bg-gray-800 rounded" />
          </div>}

          {!loading && !error && article && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
              
              {/* --- OVER-TITLE --- */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-[11px] font-black tracking-[0.3em] text-blue-600 uppercase">
                  {article.domain || "Technical Report"}
                </span>
                <div className="h-px flex-1 bg-gray-100 dark:bg-gray-900" />
              </div>

              {/* --- HEADLINE --- */}
              <h1 className="text-5xl sm:text-7xl font-black text-black dark:text-white leading-[0.95] tracking-[-0.04em] mb-12">
                {article.title}
              </h1>

              {/* --- METADATA --- */}
              <div className="flex flex-wrap items-center gap-6 mb-16 pb-8 border-b border-gray-100 dark:border-gray-900">
                <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-widest">
                  <Calendar size={14} className="text-blue-600" />
                  {article.published_at ? new Date(article.published_at).toLocaleDateString() : "Today"}
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-widest">
                  <Clock size={14} className="text-blue-600" />
                  6 MIN READ
                </div>
              </div>

              {/* --- MAIN CONTENT --- */}
              <article className="content-container">
                {renderContent(article.content)}

                {/* --- DIAGRAM CANVAS --- */}
                {article.diagram && (
                  <div className="my-20">
                    <div className="flex items-center gap-2 mb-4">
                      <Layout size={16} className="text-blue-600" />
                      <span className="text-[10px] font-black tracking-widest uppercase text-gray-400">System Blueprint</span>
                    </div>
                    <div className="relative rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0c0c0c] overflow-hidden">
                      {/* Grid Background */}
                      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
                        style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '20px 20px' }} 
                      />
                      <div className="p-12 flex justify-center overflow-x-auto relative z-10">
                        <div ref={diagramRef} className="mermaid scale-110 sm:scale-125 transition-transform" />
                      </div>
                    </div>
                  </div>
                )}
              </article>

              {/* --- SIGNATURE --- */}
              <div className="mt-32 pt-12 border-t-2 border-black dark:border-white flex justify-between items-start">
                <div className="max-w-[200px]">
                  <p className="text-[10px] font-black tracking-widest uppercase text-black dark:text-white mb-2">End of Briefing</p>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">
                    New insights are delivered every 24 hours. Stay sharp.
                  </p>
                </div>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="group flex items-center gap-2 text-[10px] font-black tracking-widest uppercase hover:text-blue-600 transition-colors"
                >
                  Back to Top <ArrowRight size={14} className="-rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </div>

            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
};