import { Link } from "react-router-dom"
import Navbar from "../components/layout/Navbar"
import Footer from "../components/layout/Footer"

const Home = () => {
  const token = localStorage.getItem("token")
  const isAuthenticated = !!token
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Tagline */}
          <p className="text-sm font-mono font-medium tracking-widest uppercase text-gray-500 dark:text-gray-400 mb-4">
            <span className="text-secondary dark:text-white">Learn.</span>{" "}
            <span className="text-primary">Repeat.</span>
          </p>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight text-secondary dark:text-white">
            One topic a day.
            <br />
            <span className="text-primary">Zero overwhelm.</span>
          </h1>

          {/* Sub-headline */}
          <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            LoopLearn delivers one carefully selected topic every day — broken
            into a concise explanation, a practical example, and a short case
            study. Built for retention, not cramming.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
           to={isAuthenticated ? "/todays" : "/login"}
        className="px-8 py-3.5 text-base font-semibold rounded-xl bg-primary text-white hover:bg-blue-700 no-underline shadow-lg shadow-primary/25"
        >
              {isAuthenticated ? "Go to Dashboard" : "Get Started — It's Free"}
        </Link>
            <a
              href="#how"
              className="px-8 py-3.5 text-base font-semibold rounded-xl border border-gray-300 dark:border-gray-700 text-secondary dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 no-underline"
            >
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Why This Exists */}
      <section id="why" className="py-20 px-6 bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-mono font-medium tracking-widest uppercase text-primary mb-3">
            Why This Exists
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-secondary dark:text-white mb-6">
            Most learning platforms give you too much, too fast.
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mt-10">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800">
              <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-secondary dark:text-white mb-2">
                The Problem
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Tutorials pile up. Courses go unfinished. Information overload
                kills motivation and retention. You forget what you learned
                yesterday.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-secondary dark:text-white mb-2">
                Our Solution
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                One topic per day. Structured, concise, and repeatable.
                LoopLearn reduces cognitive overload while improving retention
                through spaced, deliberate progression.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section id="who" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-mono font-medium tracking-widest uppercase text-primary mb-3">
            Who It's For
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-secondary dark:text-white mb-10">
            Built for people who want to learn consistently.
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: "💻",
                title: "Developers",
                desc: "Stay sharp on fundamentals and pick up new concepts without context-switching out of your workflow.",
              },
              {
                icon: "🎓",
                title: "Students",
                desc: "Supplement your coursework with structured daily reviews that actually stick in your memory.",
              },
              {
                icon: "🔁",
                title: "Lifelong Learners",
                desc: "Build a sustainable learning habit without the guilt of unfinished courses or mounting tabs.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-primary/50 dark:hover:border-primary/50 group"
              >
                <span className="text-3xl mb-4 block">{item.icon}</span>
                <h3 className="text-lg font-semibold text-secondary dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20 px-6 bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm font-mono font-medium tracking-widest uppercase text-primary mb-3">
            How It Works
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-secondary dark:text-white mb-10">
            Three parts. One topic. Every day.
          </h2>
          <div className="space-y-6">
            {[
              {
                step: "01",
                title: "Concise Explanation",
                desc: "Each day, you receive a carefully selected topic broken down into a clear, digestible explanation. No fluff.",
              },
              {
                step: "02",
                title: "Practical Example",
                desc: "See the concept in action with a real-world code example or scenario you can immediately relate to.",
              },
              {
                step: "03",
                title: "Short Case Study",
                desc: "Understand how the concept applies in context through a brief case study that reinforces retention.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex gap-6 p-6 rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800"
              >
                <span className="text-4xl font-extrabold text-primary/20 font-mono shrink-0">
                  {item.step}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-secondary dark:text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary dark:text-white mb-4">
            Ready to learn smarter?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Start your daily learning loop. It only takes a minute a day.
          </p>
          <Link
            to="/login"
            className="inline-block px-8 py-3.5 text-base font-semibold rounded-xl bg-primary text-white hover:bg-blue-700 no-underline shadow-lg shadow-primary/25"
          >
            Start Learning Today
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home
