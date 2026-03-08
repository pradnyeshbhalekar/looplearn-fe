import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useTheme } from "../context/ThemeContext";
import { Clock, Calendar, Layout } from "lucide-react";
import TodaysSkeleton from "../components/skeletons/TodaysSkeleton";
import { useParams } from "react-router-dom";
import { subscriptionApi, type Article } from "../api/subscription";

interface ArticleWithDomain extends Article {
  domain?: string;
}

const SubscribedArticle: React.FC = () => {
  const { theme } = useTheme();
  const { slug } = useParams<{ slug: string }>();

  const [article, setArticle] = useState<ArticleWithDomain | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  const diagramRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateScroll = () => {
      const currentScroll = window.scrollY;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress((currentScroll / scrollHeight) * 100);
    };

    window.addEventListener("scroll", updateScroll);
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;
      try {
        const data = await subscriptionApi.getArticleBySlug(slug);
        setArticle(data);
      } catch {
        setError("Failed to load article.");
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  useEffect(() => {
    if (!article?.diagram || !diagramRef.current) return;

    mermaid.initialize({
      startOnLoad: false,
      theme: theme === "dark" ? "dark" : "neutral",
      fontFamily: "Inter, ui-sans-serif, system-ui",
      look: "handDrawn",
    });

    diagramRef.current.removeAttribute("data-processed");
    diagramRef.current.innerHTML = article.diagram;

    mermaid
      .run({ nodes: [diagramRef.current] })
      .catch((err) => console.error(err));
  }, [theme, article?.diagram]);

  const parseLine = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);

    return parts.map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <span
          key={i}
          className="font-bold text-black dark:text-white underline decoration-blue-500/30 decoration-2 underline-offset-2"
        >
          {part.slice(2, -2)}
        </span>
      ) : (
        part
      )
    );
  };

  const renderContent = (content?: string) => {
    if (!content) return null;

    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let listBuffer: React.ReactNode[] = [];

    const flushList = (idx: number) => {
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
          <h2
            key={idx}
            className="text-3xl font-black mt-16 mb-6 tracking-tighter uppercase border-l-4 border-blue-600 pl-6"
          >
            {line.replace("## ", "")}
          </h2>
        );
      } else if (line.startsWith("### ")) {
        flushList(idx);
        elements.push(
          <h3
            key={idx}
            className="text-sm font-bold text-blue-600 mt-12 mb-4 tracking-[0.2em] uppercase"
          >
            {line.replace("### ", "")}
          </h3>
        );
      } else if (line.startsWith("- ")) {
        listBuffer.push(
          <li
            key={idx}
            className="flex items-start gap-4 text-gray-700 dark:text-gray-300 text-[1.1rem] leading-relaxed"
          >
            <div className="mt-2 w-1.5 h-1.5 bg-blue-600 rotate-45" />
            <span>{parseLine(line.replace("- ", ""))}</span>
          </li>
        );
      } else if (line.trim() !== "") {
        flushList(idx);
        elements.push(
          <p
            key={idx}
            className="text-gray-700 dark:text-gray-300 text-[1.15rem] leading-[1.8] mb-8 font-medium opacity-90"
          >
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
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-gray-100 dark:bg-gray-900">
        <div
          className="h-full bg-blue-600 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="min-h-screen bg-white dark:bg-[#080808]">
        <Navbar />

        <main className="max-w-185 mx-auto px-6 pt-24 pb-32">
          {loading && <TodaysSkeleton />}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && article && (
            <>
              <span className="text-[11px] font-black tracking-[0.3em] text-blue-600 uppercase">
                {article.domain ?? "Technical Brief"}
              </span>

              <h1 className="text-5xl sm:text-7xl font-black mt-6 mb-12">
                {article.title}
              </h1>

              <div className="flex gap-6 mb-12 text-xs font-bold uppercase tracking-widest text-gray-500">
                <Calendar size={14} />
                {article.published_at
                  ? new Date(article.published_at).toLocaleDateString()
                  : "Today"}
                <Clock size={14} />
                6 MIN READ
              </div>

              <article>{renderContent(article.content)}</article>

              {article.diagram && (
                <div className="my-20">
                  <Layout size={16} />
                  <div ref={diagramRef} className="mermaid mt-6" />
                </div>
              )}
            </>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default SubscribedArticle;
