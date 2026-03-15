import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion"; // For scroll animations
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import {
  ArrowRight,
} from "lucide-react";

// Animation Variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" as any }
};

const TypingText = ({ phrases, className = "" }: { phrases: { text: string, className?: string }[], className?: string }) => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    let timeout: any;
    const currentPhrase = phrases[currentPhraseIndex];

    if (!currentPhrase) {
      setComplete(true);
      return;
    }

    if (displayedText.length < currentPhrase.text.length) {
      timeout = setTimeout(() => {
        setDisplayedText(currentPhrase.text.slice(0, displayedText.length + 1));
      }, 70);
    } else if (currentPhraseIndex < phrases.length - 1) {
      // Move to next phrase after a short pause
      timeout = setTimeout(() => {
        setCurrentPhraseIndex(prev => prev + 1);
        setDisplayedText("");
      }, 500);
    } else {
      setComplete(true);
    }

    return () => clearTimeout(timeout);
  }, [displayedText, currentPhraseIndex, phrases]);

  return (
    <div className={className}>
      {phrases.map((phrase, idx) => (
        <div key={idx} className="min-h-[1.2em] flex items-center justify-start md:justify-center">
          <span className={phrase.className || ""}>
            {idx < currentPhraseIndex ? phrase.text : idx === currentPhraseIndex ? displayedText : ""}
            {idx === currentPhraseIndex && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className="inline-block w-[4px] h-[0.9em] bg-blue-600 ml-1 translate-y-1"
                style={{ display: complete && idx === phrases.length - 1 ? "inline-block" : !complete && idx === currentPhraseIndex ? "inline-block" : "none" }}
              />
            )}
          </span>
        </div>
      ))}
    </div>
  );
};

const Home = () => {
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  // Reading progress bar logic
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-500 scroll-smooth selection:bg-blue-500/30 font-sans">
      {/* Subtle Grain Overlay */}
      <div className="fixed inset-0 z-[120] pointer-events-none opacity-[0.03] dark:opacity-[0.05] contrast-150 brightness-150" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 z-[110] origin-left"
        style={{ scaleX }}
      />

      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-64 pb-32 px-6 flex flex-col items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto flex flex-col items-center relative z-10 w-full"
        >
          <div className="w-full max-w-5xl">
            <h1 className="text-5xl md:text-[6rem] font-black leading-[1.1] tracking-[-0.05em] text-black dark:text-white mb-10 min-h-[2.5em]">
              <TypingText 
                phrases={[
                  { text: "One topic a day." },
                  { text: "Mastered.", className: "text-blue-600 italic" }
                ]} 
              />
            </h1>
          </div>

          <p className="max-w-2xl mx-auto text-center text-xl md:text-2xl text-gray-400 dark:text-gray-500 font-semibold leading-relaxed mb-16 tracking-tight">
            LoopLearn delivers a single, high-signal technical briefing every 24 hours. 
            Built for engineering minds who value depth over volume.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              to={isAuthenticated ? "/todays" : "/login"}
              className="group relative flex items-center gap-4 px-12 py-5 bg-black dark:bg-white text-white dark:text-black rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all no-underline shadow-2xl"
            >
              {isAuthenticated ? "Enter Command Center" : "Access Briefing"}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#how"
              className="px-10 py-5 border border-gray-200 dark:border-gray-800 text-black dark:text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-white/5 transition-all no-underline"
            >
              Methodology
            </a>
          </div>
        </motion.div>
      </section>

      {/* --- PROBLEM / SOLUTION --- */}
      <section id="why" className="py-32 px-6 relative border-y border-gray-100 dark:border-white/5 bg-[#fafafa] dark:bg-black overflow-hidden">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 relative z-10">
          <motion.div {...fadeInUp} className="space-y-8">
            <div className="w-12 h-1 bg-red-500/30" />
            <h2 className="text-4xl font-black tracking-tighter text-black dark:text-white uppercase leading-none">The Noise.</h2>
            <p className="text-gray-500 dark:text-gray-400 text-xl leading-relaxed font-medium tracking-tight">
              Tutorial hell is a symptom of information overflow. Most platforms optimize for watch-time. We optimize for high-signal technical retention.
            </p>
          </motion.div>
          
          <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="space-y-8">
            <div className="w-12 h-1 bg-blue-600" />
            <h2 className="text-4xl font-black tracking-tighter text-black dark:text-white uppercase leading-none">The Signal.</h2>
            <p className="text-gray-500 dark:text-gray-400 text-xl leading-relaxed font-medium tracking-tight">
              One structured entry point daily. No backlogs. Just one core concept, one visual blueprint, and one high-fidelity implementation guide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- CORE FEATURES --- */}
      <section className="py-24 px-6 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
          <motion.div {...fadeInUp} className="p-12 rounded-[2.5rem] bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-white/5">
            <span className="text-[10px] font-mono text-blue-600 uppercase tracking-widest mb-6 block">TEAM INFRASTRUCTURE</span>
            <h3 className="text-3xl font-black uppercase tracking-tight text-black dark:text-white mb-6">Team Workspaces</h3>
            <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed font-medium">
              Onboard your junior developers with high-yield seat packs. As a senior engineer, oversee their daily loops and ensure your team is mastering the stack at scale.
            </p>
          </motion.div>
 
          <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="p-12 rounded-[2.5rem] bg-gray-50 dark:bg-zinc-950 border border-gray-100 dark:border-white/5">
            <span className="text-[10px] font-mono text-blue-600 uppercase tracking-widest mb-6 block">NEURAL SYNTHESIS</span>
            <h3 className="text-3xl font-black uppercase tracking-tight text-black dark:text-white mb-6">Commuter Mode</h3>
            <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed font-medium">
              High-quality neural audio synthesis. Listen to the daily briefing in Commuter Mode—anywhere, any device, with seamless state persistence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- TARGET AUDIENCE --- */}
      <section id="who" className="py-44 px-6 relative bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeInUp} className="mb-32">
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-black dark:text-white uppercase leading-[0.85]">
              Built for the <br />
              <span className="text-gray-300 dark:text-white/20 italic">Deep thinkers.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { title: "Architects", desc: "For those who need to understand the 'why' before the 'how'. We map mental models to production reality." },
              { title: "Senior Engineers", desc: "Skip the basics. We go deep on internals, performance trade-offs, and system constraints." },
              { title: "Full Stack", desc: "Bridge the gap between infrastructure and application. 5 minutes total daily commitment." },
            ].map((item, i) => (
              <motion.div
                key={i}
                {...fadeInUp}
                transition={{ delay: i * 0.1 }}
                className="group border-t border-gray-100 dark:border-white/10 pt-10"
              >
                <span className="text-blue-600 font-mono text-xs mb-6 block">PROF 0{i + 1}</span>
                <h3 className="text-3xl font-black uppercase tracking-tight text-black dark:text-white mb-6 leading-tight group-hover:text-blue-600 transition-colors">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed font-medium opacity-80">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PROTOCOL (Methodology) --- */}
      <section id="how" className="py-44 px-6 bg-gray-50 dark:bg-black text-black dark:text-white selection:bg-black selection:text-white">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp} className="mb-32">
             <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase mb-6 leading-none">The Protocol.</h2>
             <p className="text-gray-500 font-bold uppercase tracking-[0.4em] text-xs">Standardized Learning Flow</p>
          </motion.div>

          <div className="space-y-40 relative">
            {[
              { title: "Distilled Briefing", desc: "No fluff. High-signal technical extraction that respects your flow state. We optimize for the first 300 seconds of your day." },
              { title: "Structural Blueprint", desc: "Architecture mapping. Spatially visualize the concept to anchor the mental model permanently." },
              { title: "Implementation Vector", desc: "Direct production implementation. We provide the 'how' through high-fidelity case studies and walkthroughs." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="relative group"
              >
                <div className="mb-4 text-blue-600 font-mono text-xs tracking-widest">STEP 0{i + 1}</div>
                <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-8 leading-none">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-xl leading-relaxed font-medium max-w-2xl">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA SECTION (Cinematic Redesign) --- */}
      <section className="py-72 px-6 relative overflow-hidden bg-white dark:bg-black text-black dark:text-white text-center">
        {/* Cinematic Backdrop */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 dark:bg-blue-600/20 blur-[150px] opacity-40 animate-pulse" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,white_85%)] dark:bg-[radial-gradient(circle_at_50%_50%,transparent_0%,black_85%)]" />
          
          {/* Technical Grid Overlay */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
               style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-32 bg-blue-600/10 dark:bg-blue-600/20 rounded-full"
              style={{ 
                left: `${20 + i * 30}%`, 
                top: `${10 + i * 20}%`,
                rotate: i * 45
              }}
              animate={{ 
                y: [0, -40, 0],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{ 
                duration: 5 + i, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-6xl mx-auto"
        >
          {/* Technical SVG Ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none">
            <motion.svg 
              width="800" 
              height="800" 
              viewBox="0 0 100 100" 
              className="opacity-[0.1] dark:opacity-[0.05]"
              animate={{ rotate: 360 }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            >
              <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.05" strokeDasharray="1 2" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="0.02" opacity="0.5" />
            </motion.svg>
          </div>

          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-24 leading-[0.8] selection:bg-blue-600/30">
            Close <br />
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800 animate-gradient">The Loop.</span>
          </h2>
          
          <div className="flex justify-center group/cta">
            <Link
              to={isAuthenticated ? "/todays" : "/login"}
              className="relative px-20 py-8 bg-black dark:bg-white text-white dark:text-black rounded-full font-black text-xs uppercase tracking-[0.5em] hover:scale-105 transition-all duration-500 no-underline overflow-hidden border border-black/20 dark:border-white/20"
            >
              <span className="relative z-10 transition-colors duration-500">
                {isAuthenticated ? "Enter Command Center" : "Initialize Briefing"}
              </span>
              <motion.div 
                className="absolute inset-0 bg-blue-600 opacity-0 group-hover/cta:opacity-100 transition-opacity duration-500"
                initial={false}
              />
            </Link>
          </div>
        </motion.div>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 8s ease infinite;
          }
        `}} />
      </section>

      <Footer />
    </div>
  );
};

export default Home;
