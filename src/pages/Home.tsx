import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useSpring, useInView, AnimatePresence } from "framer-motion";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { ArrowRight, Users, Headphones, Zap, AlignLeft, Network, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import TextSelectionExplainer from "../components/article/TextSelectionExplainer";
import { useIsMobile } from "../hooks/useMediaQuery";

/* ─────────────────────────────────────────────
   TYPING TEXT
───────────────────────────────────────────── */
const TypingText = ({
  phrases,
}: {
  phrases: { text: string; className?: string }[];
}) => {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const cur = phrases[phraseIdx];
    if (!cur) { setDone(true); return; }
    if (displayed.length < cur.text.length) {
      t = setTimeout(() => setDisplayed(cur.text.slice(0, displayed.length + 1)), 65);
    } else if (phraseIdx < phrases.length - 1) {
      t = setTimeout(() => { setPhraseIdx((p) => p + 1); setDisplayed(""); }, 500);
    } else {
      setDone(true);
    }
    return () => clearTimeout(t);
  }, [displayed, phraseIdx, phrases]);

  return (
    <div>
      {phrases.map((phrase, idx) => (
        <div key={idx} className="min-h-[1.1em] flex items-center justify-center">
          <span className={phrase.className || ""}>
            {idx < phraseIdx ? phrase.text : idx === phraseIdx ? displayed : ""}
            {idx === phraseIdx && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className="inline-block w-[3px] h-[0.85em] bg-blue-500 ml-1 translate-y-[2px]"
                style={{
                  display:
                    (done && idx === phrases.length - 1) || (!done && idx === phraseIdx)
                      ? "inline-block"
                      : "none",
                }}
              />
            )}
          </span>
        </div>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────────
   REVEAL WRAPPER
───────────────────────────────────────────── */
const Reveal = ({
  children,
  delay = 0,
  className = "",
  from = "bottom",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  from?: "bottom" | "left" | "right";
}) => {
  const isMobile = useIsMobile();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: isMobile ? "-20px 0px" : "-60px 0px" });
  const initial = {
    bottom: { opacity: 0, y: isMobile ? 20 : 40 },
    left: { opacity: 0, x: isMobile ? -20 : -40 },
    right: { opacity: 0, x: isMobile ? 20 : 40 },
  }[from];
  const animate = inView ? { opacity: 1, y: 0, x: 0 } : {};

  // Slow down animation on mobile
  const duration = isMobile ? 1.2 : 0.7;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={initial}
      animate={animate}
      transition={{ duration, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
};


const features = [
  {
    id: "workspaces",
    title: "Team Workspaces",
    tagline: "Team Infrastructure",
    description: "Onboard your junior developers with high-yield seat packs. As a senior engineer, oversee their daily loops and ensure your team is mastering the stack at scale.",
    icon: <Users size={28} />,
    color: "blue",
    accent: "text-blue-600",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20"
  },
  {
    id: "tutor",
    title: "AI Tutor",
    tagline: "Personal Insight",
    description: "Highlight any complex technical term or concept across our platform to invoke your personal AI Tutor. Get instant, high-fidelity context without breaking flow.",
    icon: <Sparkles size={28} />,
    color: "orange",
    accent: "text-orange-600",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20"
  },
  {
    id: "commuter",
    title: "Commuter Mode",
    tagline: "Neural Synthesis",
    description: "High-quality neural audio synthesis. Listen to the daily briefing in Commuter Mode—anywhere, any device, with seamless state persistence.",
    icon: <Headphones size={28} />,
    color: "violet",
    accent: "text-violet-600",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20"
  }
];

const FeatureSlideshow = () => {
  const [idx, setIdx] = useState(0);
  const active = features[idx];
  const isMobile = useIsMobile();

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx((prev) => (prev + 1) % features.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto min-h-[340px] flex flex-col justify-center items-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -10 }}
          transition={{ duration: isMobile ? 0.8 : 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-full"
        >
          <div className="relative h-[300px] flex flex-col justify-center rounded-[1.25rem] bg-white dark:bg-zinc-950 border border-gray-100 dark:border-white/5 p-6 sm:p-10 overflow-hidden shadow-2xl shadow-black/5">
            {/* Ambient Background Glow */}
            <div className={`absolute -top-12 -right-12 w-40 h-40 rounded-full ${active.bg} blur-[80px] transition-colors duration-1000`} />

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className={`w-12 h-12 rounded-xl ${active.bg} flex items-center justify-center mb-5 transition-colors duration-1000`}>
                <div className={active.accent}>{active.icon}</div>
              </div>

              <span className={`text-[8px] font-black uppercase tracking-[0.3em] ${active.accent} mb-2 transition-colors duration-1000`}>
                {active.tagline}
              </span>

              <h3 className="text-xl sm:text-3xl font-black uppercase tracking-tight text-black dark:text-white mb-3 leading-none">
                {active.title}
              </h3>

              <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-base font-medium leading-relaxed max-w-md mx-auto leading-normal">
                {active.description}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress Indicators */}
      <div className="flex gap-3 mt-12">
        {features.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className="group relative h-1.5 w-12 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden"
          >
            <motion.div
              className={`absolute inset-0 h-full rounded-full transition-colors duration-1000 ${features[i].accent.replace("text-", "bg-")}`}
              initial={false}
              animate={{
                width: i === idx ? "100%" : "0%",
                opacity: i === idx ? 1 : 0
              }}
              transition={{ duration: 0.5 }}
            />
            {i === idx && (
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 6, ease: "linear" }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none px-4 sm:-mx-16">
        <button
          onClick={() => setIdx((prev) => (prev === 0 ? features.length - 1 : prev - 1))}
          className="w-12 h-12 rounded-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white hover:scale-110 transition-all pointer-events-auto shadow-xl"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => setIdx((prev) => (prev + 1) % features.length)}
          className="w-12 h-12 rounded-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 flex items-center justify-center text-gray-400 hover:text-black dark:hover:text-white hover:scale-110 transition-all pointer-events-auto shadow-xl"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MARQUEE STRIP
───────────────────────────────────────────── */
const marqueeItems = [
  "System Design", "Distributed Systems", "Database Internals",
  "Cloud Infrastructure", "Kubernetes", "Zero Trust Security",
  "Event-Driven Architecture", "Service Mesh", "DevSecOps",
];

const Marquee = () => (
  <div className="overflow-hidden py-4 border-y border-gray-100 dark:border-white/5 bg-gray-50/80 dark:bg-[#080808]">
    <motion.div
      className="flex gap-12 whitespace-nowrap"
      animate={{ x: ["0%", "-50%"] }}
      transition={{ duration: 30, ease: "linear", repeat: Infinity }}
      style={{ width: "max-content" }}
    >
      {[...marqueeItems, ...marqueeItems].map((item, i) => (
        <span key={i} className="text-[10px] font-mono uppercase tracking-widest text-gray-400 dark:text-gray-600 flex items-center gap-3">
          <span className="w-1 h-1 rounded-full bg-blue-500 inline-block flex-shrink-0" />
          {item}
        </span>
      ))}
    </motion.div>
  </div>
);

/* ─────────────────────────────────────────────
   COUNTER STAT
───────────────────────────────────────────── */
const Stat = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col items-center gap-1">
    <span className="text-2xl sm:text-3xl font-black text-black dark:text-white tabular-nums">{value}</span>
    <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">{label}</span>
  </div>
);

/* ─────────────────────────────────────────────
   HOME PAGE
───────────────────────────────────────────── */
const Home = () => {
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // audience items
  const audiences = [
    { title: "Architects", desc: "For those who need to understand the 'why' before the 'how'. We map mental models to production reality.", code: "PROF 01" },
    { title: "Senior Engineers", desc: "Skip the basics. We go deep on internals, performance trade-offs, and system constraints.", code: "PROF 02" },
    { title: "Full Stack", desc: "Bridge the gap between infrastructure and application. 5 minutes total daily commitment.", code: "PROF 03" },
  ];

  // protocol steps
  const steps = [
    { icon: AlignLeft, title: "Distilled Briefing", desc: "No fluff. High-signal technical extraction that respects your flow state. We optimize for the first 300 seconds of your day." },
    { icon: Network, title: "Structural Blueprint", desc: "Architecture mapping. Spatially visualize the concept to anchor the mental model permanently." },
    { icon: Zap, title: "Implementation Vector", desc: "Direct production implementation. We provide the 'how' through high-fidelity case studies and walkthroughs." },
  ];

  return (
    <div className={`min-h-screen bg-white dark:bg-black transition-colors ${isMobile ? 'duration-1000' : 'duration-500'} scroll-smooth selection:bg-blue-500/30 font-sans overflow-x-hidden`}>
      <TextSelectionExplainer />

      {/* Grain */}
      <div
        className="fixed inset-0 z-[120] pointer-events-none opacity-[0.025] dark:opacity-[0.045]"
        style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
      />

      {/* Scroll bar */}
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-blue-600 z-[110] origin-left" style={{ scaleX }} />

      <Navbar />

      {/* ───────────── HERO ───────────── */}
      <section className="relative pt-28 sm:pt-36 md:pt-48 pb-12 sm:pb-20 px-5 sm:px-6 overflow-hidden min-h-[90svh] flex flex-col justify-center">
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.05] pointer-events-none"
          style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "60px 60px" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-6xl mx-auto relative z-10 w-full flex flex-col items-center text-center"
        >
          {/* Headline */}
          <h1 className="text-[clamp(3rem,11vw,7.5rem)] font-black leading-[1.0] tracking-[-0.04em] text-black dark:text-white mb-5 sm:mb-8 w-full">
            <TypingText
              phrases={[
                { text: "One topic a day." },
                { text: "Mastered.", className: "text-blue-600 " },
              ]}
            />
          </h1>

          <p className="explain-content-area max-w-lg text-base sm:text-lg text-gray-500 dark:text-gray-400 font-semibold leading-relaxed tracking-tight mb-8 sm:mb-10 mx-auto">
            LoopLearn delivers a single, high-signal technical briefing every 24 hours.
            Built for engineering minds who value depth over volume.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            <Link
              to={isAuthenticated ? "/todays" : "/login"}
              className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 no-underline shadow-xl shadow-black/15 dark:shadow-white/10 overflow-hidden"
            >
              <span className="relative z-10">{isAuthenticated ? "Enter Command Center" : "Access Briefing"}</span>
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform relative z-10" />
              <motion.div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" initial={false} />
            </Link>
            <a
              href="#how"
              className="flex items-center justify-center px-8 py-4 border border-gray-200 dark:border-gray-700 text-black dark:text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-white/5 active:scale-[0.97] transition-all no-underline"
            >
              Methodology
            </a>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex justify-center gap-8 sm:gap-12 mt-10 sm:mt-14 pt-8 sm:pt-10 border-t border-gray-100 dark:border-white/5 w-full"
          >
            <Stat value="1" label="Topic Daily" />
            <Stat value="5 min" label="Deep Read" />
            <Stat value="∞" label="Retention" />
          </motion.div>
        </motion.div>
      </section>

      {/* ───────────── MARQUEE ───────────── */}
      <Marquee />

      {/* ───────────── NOISE / SIGNAL ───────────── */}
      <section id="why" className="py-16 sm:py-28 px-5 sm:px-6 bg-white dark:bg-black">
        <div className="max-w-6xl mx-auto">
          {/* Section label */}
          <Reveal className="mb-10 sm:mb-16">
            <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">The Problem</span>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-5 sm:gap-8 explain-content-area">
            {/* The Noise */}
            <Reveal delay={0} from="left">
              <div className="relative group rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#0d0d0d] p-7 sm:p-10 overflow-hidden h-full">
                <div className="w-10 h-[2px] bg-red-400/60 mb-6" />
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter text-black dark:text-white uppercase mb-4">The Noise.</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base leading-relaxed font-medium">
                  Tutorial hell is a symptom of information overflow. Most platforms optimize for watch-time. We optimize for high-signal technical retention.
                </p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {["Infinite courses", "Zero retention", "Tutorial hell"].map((t) => (
                    <span key={t} className="px-3 py-1 rounded-full bg-red-500/5 border border-red-500/10 text-[10px] font-mono uppercase tracking-widest text-red-400">{t}</span>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* The Signal */}
            <Reveal delay={0.12} from="right">
              <div className="relative group rounded-2xl sm:rounded-3xl border border-blue-500/20 bg-blue-600/[0.03] dark:bg-blue-600/[0.05] p-7 sm:p-10 overflow-hidden h-full">
                <div className="w-10 h-[2px] bg-blue-600 mb-6" />
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter text-black dark:text-white uppercase mb-4">The Signal.</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base leading-relaxed font-medium">
                  One structured entry point daily. No backlogs. Just one core concept, one visual blueprint, and one high-fidelity implementation guide.
                </p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {["One topic", "Deep mastery", "No backlog"].map((t) => (
                    <span key={t} className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono uppercase tracking-widest text-blue-600">{t}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────────── CORE FEATURES ───────────── */}
      <section className="py-16 sm:py-28 px-5 sm:px-6 border-y border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#080808]">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-10 sm:mb-16">
            <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">What You Get</span>
          </Reveal>

          <FeatureSlideshow />
        </div>
      </section>

      {/* ───────────── WHO IS IT FOR ───────────── */}
      <section id="who" className="py-16 sm:py-32 px-5 sm:px-6 bg-white dark:bg-black overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-12 sm:mb-20">
            <h2 className="text-[clamp(2.6rem,8vw,6rem)] font-black tracking-tighter text-black dark:text-white uppercase leading-[0.88]">
              Built for the <br />
              <span className="text-gray-200 dark:text-white/10 italic">Deep thinkers.</span>
            </h2>
          </Reveal>

          {/* Audience cards — stacked on mobile, horizontal on desktop */}
          <div className="flex flex-col sm:grid sm:grid-cols-3 gap-4 sm:gap-0 sm:divide-x divide-gray-100 dark:divide-white/5">
            {audiences.map((item, i) => (
              <Reveal key={i} delay={i * 0.1} className="sm:px-8 first:pl-0 last:pr-0 group">
                <div className="sm:border-0 border border-gray-100 dark:border-white/5 rounded-2xl sm:rounded-none p-6 sm:p-0 sm:pt-8">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-blue-600 mb-4 block">{item.code}</span>
                  <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black dark:text-white mb-3 leading-tight group-hover:text-blue-600 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base leading-relaxed font-medium">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── PROTOCOL ───────────── */}
      <section id="how" className="py-16 sm:py-36 px-5 sm:px-6 bg-white dark:bg-black text-black dark:text-white overflow-hidden transition-colors duration-500">
        <div className="max-w-5xl mx-auto">
          <Reveal className="mb-12 sm:mb-20">
            <div className="flex items-start gap-4 sm:gap-6">
              <div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3 block">Standardized Learning Flow</span>
                <h2 className="text-[clamp(2.6rem,8vw,6rem)] font-black tracking-tighter uppercase leading-none">The Protocol.</h2>
              </div>
            </div>
          </Reveal>

          <div className="relative">
            {/* Vertical track line — desktop only */}
            <div className="hidden sm:block absolute left-4 top-3 bottom-12 w-px bg-gray-100 dark:bg-white/5" />

            <div className="space-y-8 sm:space-y-0">
              {steps.map((item, i) => {
                const Icon = item.icon;
                return (
                  <Reveal key={i} delay={i * 0.1}>
                    <div className="sm:grid sm:grid-cols-[auto_1fr] sm:gap-x-10 sm:gap-y-0 group sm:py-10 border-b border-gray-100 dark:border-white/5 last:border-0">
                      {/* Step indicator */}
                      <div className="flex items-start gap-4 sm:block sm:pt-1">
                        <div className="w-9 h-9 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-all duration-300">
                          <Icon size={14} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        {/* Mobile inline content */}
                        <div className="sm:hidden flex-1">
                          <span className="text-[9px] font-mono uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2 block">Step 0{i + 1}</span>
                          <h3 className="text-xl font-black uppercase tracking-tight mb-2 leading-tight">{item.title}</h3>
                          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                      {/* Desktop content */}
                      <div className="hidden sm:block">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3 block">Step 0{i + 1}</span>
                        <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mb-4 leading-none group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                          {item.title}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed max-w-xl">{item.desc}</p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── CTA ───────────── */}
      <section className="relative py-24 sm:py-40 px-5 sm:px-6 bg-white dark:bg-black text-black dark:text-white text-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.05]"
          style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "60px 60px" }}
        />

        {/* Drifting lines */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute w-px sm:w-[1px] h-24 sm:h-36 bg-blue-600/15 rounded-full pointer-events-none"
            style={{ left: `${22 + i * 28}%`, top: `${12 + i * 18}%`, rotate: i * 40 }}
            animate={{ y: [0, -35, 0], opacity: [0.08, 0.25, 0.08] }}
            transition={{ duration: 6 + i * 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        <Reveal className="relative z-10 max-w-5xl mx-auto">
          <h2 className="text-[clamp(3rem,10vw,7rem)] font-black tracking-tighter uppercase mb-8 sm:mb-12 leading-[0.88]">
            Close{" "}
            <span
              className="italic text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800"
              style={{ backgroundSize: "200% 200%", animation: "gradient 8s ease infinite" }}
            >
              The Loop.
            </span>
          </h2>

          <Link
            to={isAuthenticated ? "/todays" : "/login"}
            className="group inline-flex items-center gap-3 px-10 sm:px-16 py-4 sm:py-5 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] hover:scale-[1.04] active:scale-[0.97] transition-all duration-400 no-underline overflow-hidden relative"
          >
            <span className="relative z-10">{isAuthenticated ? "Enter Command Center" : "Initialize Briefing"}</span>
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform relative z-10" />
            <motion.div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-400" initial={false} />
          </Link>
        </Reveal>

        <style dangerouslySetInnerHTML={{
          __html: `@keyframes gradient{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}`
        }} />
      </section>

      <Footer />
    </div>
  );
};

export default Home;
