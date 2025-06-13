import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function AlertConfirmationPage() {
  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              
              <h2 className="mt-4 text-2xl font-bold text-gray-900">Alert Submitted Successfully</h2>
              
              <p className="mt-2 text-lg text-gray-600">
                Your missing child alert has been submitted and is now active.
              </p>
              
              <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 text-left">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Important Next Steps
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Contact local police if you haven't already done so</li>
                        <li>Stay near your phone for updates from authorities</li>
                        <li>Check places your child frequently visits</li>
                        <li>Contact friends and family who might have information</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900">Alert Details</h3>
                
                <div className="mt-4 bg-gray-50 p-4 rounded-md">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Alert Status</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Active
                        </span>
                      </dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Date Submitted</dt>
                      <dd className="mt-1 text-sm text-gray-900">{new Date().toLocaleDateString()}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Time Submitted</dt>
                      <dd className="mt-1 text-sm text-gray-900">{new Date().toLocaleTimeString()}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500">Alert ID</dt>
                      <dd className="mt-1 text-sm text-gray-900">{`ALT${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`}</dd>
                    </div>
                  </dl>
                </div>
                
                <div className="mt-8 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 justify-center">
                  <Link
                    href="/dashboard/parent"
                    className="btn btn-outline"
                  >
                    Return to Dashboard
                  </Link>
                  <Link
                    href="/dashboard/parent/alerts"
                    className="btn btn-primary"
                  >
                    View Active Alerts
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Emergency Contact Information</h3>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="border border-gray-200 rounded-md p-4">
                  <h4 className="text-md font-medium text-gray-900">Police Emergency</h4>
                  <p className="mt-1 text-2xl font-bold text-red-600">10111</p>
                </div>
                <div className="border border-gray-200 rounded-md p-4">
                  <h4 className="text-md font-medium text-gray-900">Child Protection Hotline</h4>
                  <p className="mt-1 text-2xl font-bold text-red-600">0800 055 555</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}