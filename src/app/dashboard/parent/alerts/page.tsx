import DashboardLayout from '@/components/layout/DashboardLayout';
import AlertsList from '@/components/emergency/AlertsList';

export default function ParentAlertsPage() {
  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">My Alerts</h1>
            <p className="mt-2 text-sm text-gray-700">
              View and manage alerts for your children.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <a
              href="/dashboard/parent/report"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto"
            >
              Report Missing Child
            </a>
          </div>
        </div>
        
        <div className="mt-8">
          <AlertsList role="parent" />
        </div>
      </div>
    </DashboardLayout>
  );
}