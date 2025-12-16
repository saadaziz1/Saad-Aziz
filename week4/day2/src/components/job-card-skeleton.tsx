export function JobCardSkeleton() {
  return (
    <div className="relative mx-auto flex w-full max-w-job rounded-lg bg-white dark:bg-gray-800 px-10 py-8 animate-pulse shadow-lg">
      <div className="mr-6 h-[88px] w-[88px] bg-gray-200 dark:bg-gray-700 rounded" />
      
      <div className="flex flex-col justify-between flex-1">
        <div className="space-y-2">
          <div className="flex space-x-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
          </div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48" />
          <div className="flex space-x-4">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
          </div>
        </div>
      </div>
      
      <div className="ml-auto self-center flex gap-2">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16" />
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20" />
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-18" />
      </div>
    </div>
  );
}