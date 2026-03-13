import SubscriptionSkeleton from "./SubscriptionSkeleton";
import WorkspaceSkeleton from "./WorkspaceSkeleton";

const DashboardSkeleton = () => {
  return (
    <div className="animate-pulse">
      <SubscriptionSkeleton />

      <div className="mt-20 border-t border-gray-100 dark:border-gray-900 pt-16">
        <div className="flex items-center justify-between mb-10">
            <div className="h-10 w-48 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
            <div className="h-10 w-40 bg-gray-200 dark:bg-gray-800 rounded-full" />
        </div>
        <WorkspaceSkeleton />
      </div>
    </div>
  );
};

export default DashboardSkeleton;
