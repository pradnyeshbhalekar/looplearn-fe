const WorkspaceSkeleton = () => {
  return (
    <div className="grid md:grid-cols-2 gap-8 animate-pulse">
      {[1, 2].map((i) => (
        <div key={i} className="bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 h-56 shadow-sm">
          <div className="h-6 w-20 bg-purple-100 dark:bg-purple-900/20 rounded-full mb-4" />
          <div className="h-8 w-40 bg-gray-200 dark:bg-gray-800 rounded-lg mb-6" />
          <div className="h-12 w-full bg-gray-100 dark:bg-gray-800/50 rounded-2xl mt-auto" />
        </div>
      ))}
    </div>
  );
};

export default WorkspaceSkeleton;
