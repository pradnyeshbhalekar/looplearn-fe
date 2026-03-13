const SubscriptionSkeleton = () => {
  return (
    <div className="grid md:grid-cols-2 gap-8 mb-12 animate-pulse">
      {/* Main briefing card skeleton */}
      <div className="bg-gray-200 dark:bg-gray-800 rounded-3xl p-6 h-48" />
      {/* Subscription card skeleton */}
      <div className="bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 h-48" />
    </div>
  );
};

export default SubscriptionSkeleton;
