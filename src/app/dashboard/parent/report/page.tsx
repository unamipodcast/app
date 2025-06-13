import DashboardLayout from '@/components/layout/DashboardLayout';
import MissingChildForm from '@/components/emergency/MissingChildForm';

export default function ReportMissingChildPage() {
  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Report Missing Child</h1>
            <p className="mt-2 text-sm text-gray-700">
              Use this form to report a missing child and initiate an emergency alert.
            </p>
          </div>
        </div>
        
        <div className="mt-8">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <MissingChildForm />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}