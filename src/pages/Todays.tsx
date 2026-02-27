import React, { useState, useEffect, useRef } from "react";
import mermaid from "mermaid";

export const Todays = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const diagramRef = useRef(null);

  const BACKEND_URI = import.meta.env.VITE_API_BASE_URL;

  // Fetch Article Data
  useEffect(() => {
    const fetchTodayArticle = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BACKEND_URI}/api/articles/today`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to load today's article.");
        }

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

  // Initialize Mermaid for the diagram (runs when theme changes or data loads)
  useEffect(() => {
    if (!article?.diagram) return;

    mermaid.initialize({
      startOnLoad: false,
      theme: isDarkMode ? "dark" : "default",
      fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    });

    if (diagramRef.current) {
      diagramRef.current.removeAttribute("data-processed");
      diagramRef.current.innerHTML = article.diagram;
      mermaid.run({ nodes: [diagramRef.current] }).catch((err) => console.error(err));
    }
  }, [isDarkMode, article?.diagram]);

  // Editorial Markdown Parser
  const renderContent = (content) => {
    if (!content) return null;
    
    return content.split("\n").map((line, idx) => {
      // H2 Headings
      if (line.startsWith("## ")) {
        return (
          <h2 key={idx} className="text-3xl font-bold tracking-tight mt-16 mb-6 text-slate-900 dark:text-white">
            {line.replace("## ", "")}
          </h2>
        );
      }
      // H3 Headings
      if (line.startsWith("### ")) {
        return (
          <h3 key={idx} className="text-xl font-semibold mt-10 mb-4 text-slate-800 dark:text-slate-200">
            {line.replace("### ", "")}
          </h3>
        );
      }
      // Skip H1 as it's the article title
      if (line.startsWith("# ")) return null;

      // Lists
      if (line.startsWith("- ")) {
        return (
          <li key={idx} className="flex items-start ml-2 mb-3 text-lg text-slate-600 dark:text-slate-300">
            <span className="mr-4 mt-1 text-slate-400 dark:text-slate-500 text-sm">■</span>
            <span>{line.replace("- ", "")}</span>
          </li>
        );
      }

      // Empty Lines (Spacing)
      if (line.trim() === "") {
        return <div key={idx} className="h-4" />;
      }
      
      // Paragraphs with Bold text support
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={idx} className="mb-6 text-lg leading-loose text-slate-600 dark:text-slate-300">
          {parts.map((part, i) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <strong key={i} className="font-semibold text-slate-900 dark:text-white">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className={`${isDarkMode ? "dark" : ""} transition-colors duration-200`}>
      <div className="min-h-screen bg-white dark:bg-[#0A0A0A] font-sans selection:bg-blue-200 selection:text-blue-900 dark:selection:bg-blue-900 dark:selection:text-blue-100">
        
        {/* Top Navigation Bar */}
        <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-[#0A0A0A]/80 border-b border-slate-200 dark:border-slate-800 transition-colors">
          <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="font-bold text-xl tracking-tighter text-slate-900 dark:text-white">
              TechDaily.
            </div>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Main Article Container */}
        <main className="max-w-2xl mx-auto px-6 py-16 sm:py-24">
          
          {/* Loading State Skeleton */}
          {loading && (
            <div className="animate-pulse">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24 mb-6"></div>
              <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-10"></div>
              <div className="flex items-center space-x-4 border-t border-b border-slate-100 dark:border-slate-800 py-6 mb-14">
                <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-32"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-24"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Failed to load article</h2>
              <p className="text-slate-500 dark:text-slate-400">{error}</p>
            </div>
          )}

          {/* Loaded Article Content */}
          {!loading && !error && article && (
            <>
              {/* Article Header */}
              <header className="mb-14">
                <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm tracking-widest uppercase mb-4 block">
                  System Design
                </span>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-8">
                  {article.title}
                </h1>
                
                {/* Author / Meta Block */}
                <div className="flex items-center space-x-4 border-t border-b border-slate-100 dark:border-slate-800 py-6">
                  <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                    <svg className="w-6 h-6 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">TechDaily Editorial</p>
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mt-1">
                      <span>
                        {article.published_at 
                          ? new Date(article.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) 
                          : "Today"}
                      </span>
                      <span className="mx-2">•</span>
                      <span>5 min read</span>
                    </div>
                  </div>
                </div>
              </header>

              {/* Article Markdown Content */}
              <article className="prose-lg">
                {renderContent(article.content)}

                {/* Featured Diagram Section (if exists) */}
                {article.diagram && (
                  <figure className="mt-16 mb-12">
                    <div className="bg-[#f8f9fa] dark:bg-[#111111] p-8 sm:p-12 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-center items-center overflow-x-auto">
                      <div ref={diagramRef} className="mermaid flex justify-center">
                        {/* Mermaid injects SVG here */}
                      </div>
                    </div>
                    <figcaption className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
                      System Architecture Diagram
                    </figcaption>
                  </figure>
                )}

                {/* Conclusion / End Marker */}
                <div className="mt-20 flex justify-center">
                  <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700 mx-1"></span>
                  <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700 mx-1"></span>
                  <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700 mx-1"></span>
                </div>
              </article>
            </>
          )}

        </main>
      </div>
    </div>
  );
};