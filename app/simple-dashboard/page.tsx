export default function SimpleDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">VistaFeed AI Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">AI Agents</h3>
            <p className="text-3xl font-bold text-blue-600">5</p>
            <p className="text-gray-600 dark:text-gray-400">Active agents</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Videos Analyzed</h3>
            <p className="text-3xl font-bold text-green-600">128</p>
            <p className="text-gray-600 dark:text-gray-400">This month</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Connections</h3>
            <p className="text-3xl font-bold text-purple-600">24</p>
            <p className="text-gray-600 dark:text-gray-400">Social network</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a href="/videos" className="p-4 text-center border rounded hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="text-2xl mb-2">🎥</div>
              <div>Search Videos</div>
            </a>
            <a href="/agents" className="p-4 text-center border rounded hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="text-2xl mb-2">🤖</div>
              <div>Manage Agents</div>
            </a>
            <a href="/social" className="p-4 text-center border rounded hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="text-2xl mb-2">👥</div>
              <div>Social Hub</div>
            </a>
            <a href="/discovery" className="p-4 text-center border rounded hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="text-2xl mb-2">🔍</div>
              <div>Discover</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}