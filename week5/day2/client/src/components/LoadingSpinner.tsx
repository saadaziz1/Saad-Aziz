export const LoadingSpinner = () => (
  <div className="min-h-screen py-4 px-4 sm:py-8 sm:px-6 lg:px-8 flex items-center justify-center">
    <div className="text-center">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-400">Loading...</p>
    </div>
  </div>
);