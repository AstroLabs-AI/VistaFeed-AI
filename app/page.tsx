export default function HomePage() {
  // Simple redirect using meta refresh
  return (
    <>
      <meta httpEquiv="refresh" content="0; url=/dashboard" />
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading VistaFeed AI...</p>
          <p className="text-sm text-gray-500 mt-2">
            <a href="/dashboard" className="underline">Click here if not redirected</a>
          </p>
        </div>
      </div>
    </>
  );
}