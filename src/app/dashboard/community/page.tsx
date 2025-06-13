export default function CommunityDashboard() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Community Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            Welcome to your dashboard. Here you can monitor community alerts, access resources, and view safety information.
          </p>
        </div>
      </div>
        
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Quick Actions Card */}
          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <a href="/dashboard/community/alerts" className="flex items-center text-primary-600 hover:text-primary-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                View Community Alerts
              </a>
              <a href="/dashboard/community/resources" className="flex items-center text-primary-600 hover:text-primary-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Access Resources
              </a>
              <a href="/dashboard/community/map" className="flex items-center text-primary-600 hover:text-primary-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                View Safety Map
              </a>
            </div>
          </div>
          
          {/* Active Alerts Card */}
          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Active Alerts</h2>
            <div className="space-y-4">
              <p className="text-gray-500 text-sm italic">No active alerts in your community</p>
              {/* Alert items would be mapped here */}
            </div>
            <div className="mt-4 text-right">
              <a href="/dashboard/community/alerts" className="text-sm font-medium text-primary-600 hover:text-primary-800">
                View all alerts →
              </a>
            </div>
          </div>
          
          {/* Resources Card */}
          <div className="card">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Resources</h2>
            <div className="space-y-3">
              <a href="#" className="flex items-center text-primary-600 hover:text-primary-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Community Safety Guide
              </a>
              <a href="#" className="flex items-center text-primary-600 hover:text-primary-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Emergency Response Plan
              </a>
              <a href="#" className="flex items-center text-primary-600 hover:text-primary-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                FAQ
              </a>
            </div>
          </div>
        </div>
        
        {/* Community Safety Map */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Community Safety Map</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No map data available</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Safety map will be displayed here once data is available.
                  </p>
                  <div className="mt-6">
                    <a
                      href="/dashboard/community/map"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                    >
                      View Full Map
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Community Statistics */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Community Statistics</h2>
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">Registered Children</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">0</dd>
                </div>
                
                <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">Registered Schools</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">0</dd>
                </div>
                
                <div className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Alerts</dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">0</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
  );
}