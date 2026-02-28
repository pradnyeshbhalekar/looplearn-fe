import { Link } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion"; // For scroll animations
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { 
  Zap, 
  Target, 
  Infinity, 
  Code2, 
  GraduationCap, 
  Repeat, 
  ArrowRight, 
  XCircle, 
  CheckCircle2,
  Terminal,
  Layers
} from "lucide-react";

// Animation Variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" }
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
    <div className="min-h-screen bg-white dark:bg-[#080808] transition-colors duration-300 scroll-smooth">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 z-[110] origin-left"
        style={{ scaleX }}
      />
      
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="pt-44 pb-24 px-6 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto text-center"
        >

          <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-[-0.05em] text-black dark:text-white mb-10">
            One topic a day. <br />
            <span className="text-blue-600">Mastered.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-12">
            LoopLearn delivers a single, high-signal technical briefing every 24 hours. 
            Built for engineering minds who value depth over volume.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={isAuthenticated ? "/todays" : "/login"}
              className="group flex items-center gap-3 px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all no-underline"
            >
              {isAuthenticated ? "Enter Briefing" : "Begin Learning"}
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#how"
              className="px-8 py-4 border border-gray-200 dark:border-gray-800 text-black dark:text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-white/5 transition-all no-underline"
            >
              The Methodology
            </a>
          </div>
        </motion.div>
      </section>

      {/* --- PROBLEM / SOLUTION --- */}
      <section id="why" className="py-24 px-6 border-y border-gray-100 dark:border-gray-900 bg-[#fafafa] dark:bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
          <motion.div {...fadeInUp} className="space-y-6">
            <XCircle size={32} className="text-red-500/50" />
            <h2 className="text-3xl font-black tracking-tighter text-black dark:text-white uppercase">The Noise</h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed font-medium">
              Tutorial hell is real. 100-hour courses and endless tabs. Most platforms optimize for "watch time," not retention.
            </p>
          </motion.div>
          <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="space-y-6">
            <CheckCircle2 size={32} className="text-blue-600" />
            <h2 className="text-3xl font-black tracking-tighter text-black dark:text-white uppercase">The Loop</h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed font-medium">
              We provide one structured entry point daily. No backlogs. Just one core concept, one visual blueprint, and one application. 
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- TARGET AUDIENCE (Bento Grid) --- */}
      <section id="who" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="mb-16">
            <p className="text-[10px] font-black tracking-[0.3em] uppercase text-blue-600 mb-4">Audience Profile</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-black dark:text-white uppercase">Built for the persistent.</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: <Code2 size={24} />, title: "Developers", desc: "Strengthen your mental model of systems without leaving your flow state." },
              { icon: <GraduationCap size={24} />, title: "Engineers", desc: "Bridge the gap between theory and production with daily briefings." },
              { icon: <Infinity size={24} />, title: "Architects", desc: "Understand the full stack by spending 5 minutes a day on diverse domains." },
            ].map((item, i) => (
              <motion.div 
                key={i} 
                {...fadeInUp}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl border border-gray-100 dark:border-gray-900 bg-white dark:bg-[#0c0c0c] hover:border-blue-500/30 transition-colors"
              >
                <div className="text-blue-600 mb-6">{item.icon}</div>
                <h3 className="text-xl font-black uppercase tracking-tight text-black dark:text-white mb-4">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- STEPS (The Daily Protocol - Improved Colors) --- */}
      <section id="how" className="py-32 px-6 bg-gray-50 dark:bg-black text-black dark:text-white transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6">The Daily Protocol</h2>
            <div className="h-1 w-24 bg-blue-600 mx-auto" />
          </motion.div>

          <div className="space-y-24 relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-200 dark:bg-white/10 hidden md:block" />

            {[
              { icon: <Terminal />, title: "Distilled Explanation", desc: "We strip away the fluff. You get the 'why' and the 'how' in a format that respects your time." },
              { icon: <Layers />, title: "System Blueprint", desc: "Every topic includes a visual architecture diagram to help you map the concept spatially." },
              { icon: <Target />, title: "Case Implementation", desc: "Connect theory to reality with a focused case study on how this concept solves actual problems." },
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="relative flex flex-col md:flex-row gap-8 md:gap-16 items-start group"
              >
                <div className="hidden md:flex absolute left-0 w-12 h-12 rounded-full bg-blue-600 items-center justify-center ring-8 ring-gray-50 dark:ring-black z-10 text-white">
                  <span className="text-xs font-black">{i + 1}</span>
                </div>
                <div className="md:pl-24">
                  <div className="flex items-center gap-3 text-blue-600 dark:text-blue-500 mb-4 uppercase font-black tracking-widest text-xs">
                    {item.icon} Step 0{i + 1}
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-tight mb-4 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed font-medium">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-40 px-6 text-center">
        <motion.div {...fadeInUp}>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-8"
          >
            <Repeat size={48} className="text-blue-600" />
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-black dark:text-white uppercase mb-8">
            Close the loop.
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-12">
            The best time to start learning was yesterday. The second best time is today.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-3 px-10 py-5 bg-black dark:bg-white text-white dark:text-black rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all no-underline shadow-2xl"
          >
            Start Your First Briefing
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;