import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { subscriptionApi, type UserSubscription } from "../api/subscription";
import { Loader2, ArrowRight, Calendar, Clock } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [subs, setSubs] = useState<UserSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingDomain, setProcessingDomain] = useState<string | null>(null);

  useEffect(() => {
    const loadSubs = async () => {
      try {
        const data = await subscriptionApi.listMySubscriptions();
        const activeSubs = data.filter((s) => s.status === "active");
        setSubs(activeSubs);
      } catch {
        setError("Failed to load subscriptions");
      } finally {
        setLoading(false);
      }
    };
    loadSubs();
  }, []);

  const openTodayForDomain = async (domain: string) => {
    try {
      setProcessingDomain(domain);
      const formattedDomain = domain.replace(/_/g, " ");
      const article = await subscriptionApi.getTodayArticleByDomain(formattedDomain);
      navigate(`/subscriptions/article/${article.slug}`, { state: { article } });
    } catch {
      setError("Could not load today's article for selected subscription");
    } finally {
      setProcessingDomain(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-black dark:text-white flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-grow pt-24 pb-24 px-6 max-w-6xl mx-auto w-full">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">Your Subscriptions</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg mb-10">
          Select a subscribed plan below to read today’s briefing.
        </p>

        {loading ? (
          <div className="flex items-center gap-3 text-blue-600">
            <Loader2 className="w-6 h-6 animate-spin" /> Loading your subscriptions…
          </div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Global Daily Briefing Card */}
            <div
              onClick={() => navigate("/todays")}
              className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white border border-blue-500 rounded-3xl p-6 shadow-2xl flex flex-col cursor-pointer transition-all hover:scale-[1.02] hover:shadow-blue-900/50"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-black uppercase tracking-wider rounded-full backdrop-blur-sm">
                    Free Tier
                  </span>
                  <h3 className="text-3xl font-black mt-3">Today's Briefing</h3>
                  <div className="mt-2 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-blue-100">
                    <Calendar size={14} />
                    DAILY DROP
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between font-bold text-white">
                <span>Read General Briefing</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>

            {/* Subscriptions */}
            {subs.length === 0 ? (
              <div className="bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-center items-center text-center">
                <p className="text-gray-500 dark:text-gray-400 mb-4 font-medium">No active premium plan subscriptions yet.</p>
                <button onClick={() => navigate("/pricing")} className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">
                  View Pricing
                </button>
              </div>
            ) : subs.map((s) => (
              <div
                key={s.subscription_id}
                onClick={() => {
                  if (processingDomain !== s.domain) openTodayForDomain(s.domain);
                }}
                className={`bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-2xl flex flex-col transition-all ${processingDomain === s.domain ? "opacity-75 pointer-events-none cursor-wait" : "cursor-pointer hover:border-blue-500 hover:scale-[1.02]"
                  }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider rounded-full">
                      {s.domain}
                    </span>
                    <h3 className="text-2xl font-black mt-3">{s.plan_name}</h3>
                    <div className="mt-2 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-gray-500">
                      <Calendar size={14} />
                      {s.ends_at ? new Date(s.ends_at).toLocaleDateString() : "No end date"}
                      <Clock size={14} />
                      {s.status.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between text-blue-600 dark:text-blue-400 font-bold">
                  <span>{processingDomain === s.domain ? "Opening..." : "Read Today's Briefing"}</span>
                  {processingDomain === s.domain ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;
