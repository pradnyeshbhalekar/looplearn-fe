import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, ArrowRight, AlertTriangle, X } from "lucide-react";
import type { AppDispatch, RootState } from "../app/store";
import { fetchPlans, createSubscription, clearSubscriptionState } from "../features/subscriptions/subscriptionSlice";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const Pricing = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
    const { plans, loadingPlans, subscribing, subscribeError } = useSelector(
        (state: RootState) => state.subscription
    );

    const token = localStorage.getItem("token");
    const isAuthenticated = !!token;

    useEffect(() => {
        dispatch(fetchPlans());
    }, [dispatch]);

    const handleSubscribe = async (planId: string) => {
        if (!isAuthenticated) {
            window.location.href = "/login";
            return;
        }

        try {
            setProcessingPlanId(planId);
            const response = await dispatch(createSubscription(planId)).unwrap();
            if (response && response.razorpay && response.razorpay.short_url) {
                window.location.href = response.razorpay.short_url;
            } else {
                console.error("No short_url returned", response);
            }
        } catch (error) {
            console.error("Subscription error:", error);
        } finally {
            setProcessingPlanId(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] text-black dark:text-white flex flex-col font-sans transition-colors duration-300">
            <Navbar />

            <main className="flex-grow pt-32 pb-24 px-6 flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
                        Invest in your <span className="text-blue-600 dark:text-blue-500">mastery</span>.
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl font-medium">
                        Join the elite developers who accelerate their learning with one high-signal briefing daily.
                    </p>
                </motion.div>

                {/* subscribeError is handled via centered modal below */}

                {loadingPlans ? (
                    <div className="flex justify-center items-center py-20 text-blue-500">
                        <Loader2 className="animate-spin w-10 h-10" />
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full">
                        {plans.map((plan, index) => (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                className="relative bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-gray-800 rounded-3xl p-8 shadow-2xl overflow-hidden group hover:border-blue-500/30 transition-all"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="mb-8">
                                        <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                                            {plan.domain}
                                        </span>
                                        <h2 className="text-3xl font-black mb-2 text-black dark:text-white">{plan.name}</h2>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-5xl font-black tracking-tighter text-black dark:text-white">₹{plan.monthly_price}</span>
                                            <span className="text-gray-500 font-medium">/{plan.billing_cycle || "month"}</span>
                                        </div>
                                    </div>

                                    <div className="flex-grow">
                                        <ul className="space-y-4 mb-8">
                                            {plan.features.length > 0 ? (
                                                plan.features.map((feature, i) => (
                                                    <li key={i} className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                                                        <Check className="w-5 h-5 text-blue-600 dark:text-blue-500 shrink-0 mt-0.5" />
                                                        <span>{feature}</span>
                                                    </li>
                                                ))
                                            ) : (
                                                <>
                                                    <li className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                                                        <Check className="w-5 h-5 text-blue-600 dark:text-blue-500 shrink-0 mt-0.5" />
                                                        <span>Daily high-signal technical briefings</span>
                                                    </li>
                                                    <li className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                                                        <Check className="w-5 h-5 text-blue-600 dark:text-blue-500 shrink-0 mt-0.5" />
                                                        <span>System architecture blueprints</span>
                                                    </li>
                                                    <li className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                                                        <Check className="w-5 h-5 text-blue-600 dark:text-blue-500 shrink-0 mt-0.5" />
                                                        <span>Practical case implementations</span>
                                                    </li>
                                                </>
                                            )}
                                        </ul>
                                    </div>

                                    <button
                                        onClick={() => handleSubscribe(plan.id)}
                                        disabled={subscribing}
                                        className="w-full py-4 mt-auto bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-black rounded-xl font-bold transition-colors flex items-center justify-center gap-2 group/btn disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {subscribing && processingPlanId === plan.id ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" /> Processing...
                                            </>
                                        ) : (
                                            <>
                                                {isAuthenticated ? "Subscribe Now" : "Login to Subscribe"}
                                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>

            {/* Centered Error Modal */}
            <AnimatePresence>
                {subscribeError && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-[#111] border border-red-100 dark:border-red-900/30 rounded-2xl p-6 md:p-8 max-w-sm w-full shadow-2xl relative"
                        >
                            <button
                                onClick={() => dispatch(clearSubscriptionState())}
                                className="absolute top-4 right-4 text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                                    <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-500" />
                                </div>
                                <h3 className="text-2xl font-black mb-2 text-black dark:text-white">Payment Failed</h3>
                                <p className="text-gray-500 dark:text-gray-400 font-medium">
                                    {subscribeError}
                                </p>
                                <button
                                    onClick={() => dispatch(clearSubscriptionState())}
                                    className="mt-8 w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
};

export default Pricing;
