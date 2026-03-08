import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { subscriptionApi } from "../api/subscription";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const SubscriptionSuccess = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState<"polling" | "success" | "timeout" | "error">("polling");
    const pollCount = useRef(0);
    const MAX_POLLS = 20; // e.g. 60 seconds of polling roughly if 3s interval
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                pollCount.current += 1;
                const data = await subscriptionApi.getSubscriptionStatus();

                if (data.status === "active") {
                    setStatus("success");
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    // Add slight delay before redirect for user to see success
                    setTimeout(() => {
                        navigate("/dashboard");
                    }, 2000);
                } else if (pollCount.current >= MAX_POLLS) {
                    setStatus("timeout");
                    if (intervalRef.current) clearInterval(intervalRef.current);
                }
            } catch (err) {
                console.error("Failed to fetch subscription status:", err);
                // We keep polling in case it's a transient network error, until max polls
                if (pollCount.current >= MAX_POLLS) {
                    setStatus("error");
                    if (intervalRef.current) clearInterval(intervalRef.current);
                }
            }
        };

        // Initial check immediately just in case webhook was instantaneous
        checkStatus();

        // Start interval
        intervalRef.current = setInterval(checkStatus, 3000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [navigate]);

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-black dark:text-white flex flex-col font-sans transition-colors duration-300">
            <Navbar />

            <main className="flex-grow pt-40 pb-24 px-6 flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                    {status === "polling" && (
                        <motion.div
                            key="polling"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.5, type: "spring" }}
                            className="text-center max-w-2xl mx-auto"
                        >
                            <div className="flex justify-center mb-8">
                                <div className="w-24 h-24 bg-blue-100 dark:bg-blue-500/10 rounded-full flex items-center justify-center">
                                    <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-500 animate-spin" />
                                </div>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                                Activating <span className="text-blue-600 dark:text-blue-500">your subscription…</span>
                            </h1>

                            <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl font-medium leading-relaxed mb-12">
                                We are verifying your payment and unlocking your access. Please do not close this window.
                            </p>
                        </motion.div>
                    )}

                    {status === "success" && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.5, type: "spring" }}
                            className="text-center max-w-2xl mx-auto"
                        >
                            <div className="flex justify-center mb-8">
                                <div className="w-24 h-24 bg-green-100 dark:bg-green-500/10 rounded-full flex items-center justify-center text-green-600 dark:text-green-500">
                                    <CheckCircle className="w-12 h-12" />
                                </div>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                                Payment <span className="text-green-600 dark:text-green-500">Successful</span>
                            </h1>

                            <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl font-medium leading-relaxed mb-12">
                                You are now subscribed to LoopLearn. Redirecting you to your dashboard...
                            </p>

                            <Link
                                to="/dashboard"
                                className="inline-flex items-center gap-3 px-10 py-5 bg-black dark:bg-white text-white dark:text-black rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl group no-underline"
                            >
                                Go to Dashboard manually
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    )}

                    {(status === "timeout" || status === "error") && (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.5, type: "spring" }}
                            className="text-center max-w-2xl mx-auto"
                        >
                            <div className="flex justify-center mb-8">
                                <div className="w-24 h-24 bg-orange-100 dark:bg-orange-500/10 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-500">
                                    <AlertCircle className="w-12 h-12" />
                                </div>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                                Still <span className="text-orange-600 dark:text-orange-500">Verifying...</span>
                            </h1>

                            <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl font-medium leading-relaxed mb-12">
                                Your payment might take a little longer to process. Don't worry, once Razorpay completes the verification, your subscription will be automatically activated.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="inline-flex items-center gap-3 px-10 py-5 bg-black dark:bg-white text-white dark:text-black rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-xl group no-underline"
                                >
                                    Refresh Page
                                </button>
                                <a
                                    href="mailto:support@looplearn.app"
                                    className="px-10 py-5 border border-gray-200 dark:border-gray-800 text-black dark:text-white rounded-full font-black text-sm uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-white/5 transition-all no-underline"
                                >
                                    Contact Support
                                </a>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <Footer />
        </div>
    );
};

export default SubscriptionSuccess;
