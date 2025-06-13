import DashboardLayout from '@/components/layout/DashboardLayout';
import ChildProfileForm from '@/components/profile/ChildProfileForm';

export default function AddChildPage() {
  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Add Child</h1>
            <p className="mt-2 text-sm text-gray-700">
              Create a new profile for your child with all the necessary information.
            </p>
          </div>
        </div>
        
        <div className="mt-8">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <ChildProfileForm />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}