import React from "react";

const AdminSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Sidebar Queue List Skeleton */}
        <div className="lg:col-span-4 flex flex-col h-[75vh]">
          <div className="bg-white dark:bg-[#0c0c0c] border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden flex flex-col h-full shadow-sm">
            {/* Tabs Skeleton */}
            <div className="flex bg-gray-50 dark:bg-black/50 p-2 gap-2 border-b border-gray-200 dark:border-white/10">
              <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
              <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
            </div>
            {/* List Skeleton */}
            <div className="overflow-y-auto flex-1 p-2 space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-full p-5 bg-gray-50 dark:bg-white/5 border border-transparent rounded-2xl">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-3" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Preview Area Skeleton */}
        <div className="lg:col-span-8 flex flex-col h-[75vh]">
          <div className="bg-white dark:bg-[#0c0c0c] border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden flex flex-col h-full shadow-sm">
            {/* Top Bar Skeleton */}
            <div className="px-8 py-5 border-b border-gray-200 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-black/20">
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24" />
              <div className="flex gap-3">
                <div className="h-9 bg-gray-200 dark:bg-gray-800 rounded-full w-24" />
                <div className="h-9 bg-gray-200 dark:bg-gray-800 rounded-full w-24" />
              </div>
            </div>
            {/* Content Skeleton */}
            <div className="flex-1 p-8 sm:p-12 overflow-y-auto">
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-4/5" />
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                </div>
                <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl w-full mt-10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSkeleton;
