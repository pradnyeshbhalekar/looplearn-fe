import React from "react";

const SkeletonBlock = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-800 rounded ${className}`} />
);

const TodaysSkeleton: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-500">
      {/* Domain */}
      <SkeletonBlock className="h-3 w-32 mb-6" />

      {/* Title */}
      <SkeletonBlock className="h-14 w-full mb-4" />
      <SkeletonBlock className="h-14 w-5/6 mb-12" />

      {/* Meta */}
      <div className="flex gap-6 mb-16">
        <SkeletonBlock className="h-4 w-32" />
        <SkeletonBlock className="h-4 w-24" />
      </div>

      {/* Content */}
      <div className="space-y-6">
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-11/12" />
        <SkeletonBlock className="h-4 w-10/12" />
        <SkeletonBlock className="h-4 w-9/12" />
      </div>

      {/* Section Header */}
      <SkeletonBlock className="h-8 w-48 mt-20 mb-6" />

      {/* Paragraph */}
      <div className="space-y-6">
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-11/12" />
        <SkeletonBlock className="h-4 w-10/12" />
      </div>

      {/* Diagram Placeholder */}
      <div className="mt-20">
        <SkeletonBlock className="h-6 w-40 mb-4" />
        <SkeletonBlock className="h-[280px] w-full rounded-xl" />
      </div>
    </div>
  );
};

export default TodaysSkeleton;