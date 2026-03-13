
const PricingSkeleton = () => {
    return (
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full">
            {[1, 2].map((i) => (
                <div
                    key={i}
                    className="relative bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-gray-800 rounded-3xl p-8 shadow-2xl overflow-hidden animate-pulse"
                >
                    <div className="flex flex-col h-full">
                        <div className="mb-8">
                            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded-full mb-4" />
                            <div className="h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded-xl mb-4" />
                            <div className="h-12 w-32 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                        </div>

                        <div className="flex-grow">
                            <ul className="space-y-4 mb-8">
                                {[1, 2, 3].map((j) => (
                                    <li key={j} className="flex items-center gap-3">
                                        <div className="w-5 h-5 bg-gray-200 dark:bg-gray-800 rounded-full" />
                                        <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded-lg" />
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="h-14 w-full bg-gray-200 dark:bg-gray-800 rounded-xl mt-auto" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PricingSkeleton;
