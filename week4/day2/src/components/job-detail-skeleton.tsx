export function JobDetailSkeleton() {
  return (
    <main className="mx-auto max-w-app px-6 pb-32 mt-24">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg animate-pulse">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded" />
          <div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-2" />
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            </div>
          </div>
          
          <div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-28 mb-2" />
            <div className="mb-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-1" />
              <div className="flex flex-wrap gap-2 mt-1">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-18" />
              </div>
            </div>
            <div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-1" />
              <div className="flex flex-wrap gap-2 mt-1">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-14" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20" />
        </div>
      </div>
    </main>
  );
}