import Logo from "../Logo"

const Footer = () => {
  return (
    <footer className="relative bg-white dark:bg-black border-t border-gray-100 dark:border-white/5 pt-24 pb-12 overflow-hidden text-black dark:text-white transition-colors duration-500">
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-12">
          <div className="flex flex-col items-start gap-6">
            <Logo className="text-xl font-black tracking-widest" />
            <p className="max-w-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              Distilling engineering complexity into high-signal briefings. Built for persistence, delivered every 24 hours.
            </p>
          </div>

          <div className="flex gap-12">
            <div className="flex flex-col gap-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 dark:text-blue-500 mb-2">Protocol</h4>
              <a href="#why" className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors no-underline font-medium">Concept</a>
              <a href="#who" className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors no-underline font-medium">Audience</a>
              <a href="#how" className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors no-underline font-medium">Methodology</a>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-gray-100 dark:border-white/5 flex flex-col md:md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-mono text-gray-400 dark:text-gray-600 uppercase tracking-widest">
            © {new Date().getFullYear()} LoopLearn. Secure Transmission.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer
