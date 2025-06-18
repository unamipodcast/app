'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useChildProfiles } from '@/hooks/useChildProfiles';
import DataTable from '@/components/ui/DataTable';
import { toast } from 'react-hot-toast';

export default function ChildrenPage() {
  const router = useRouter();
  const { children, loading, error, fetchChildren } = useChildProfiles();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchChildren();
      } catch (error) {
        console.error('Error fetching children:', error);
        toast.error('Failed to load children profiles');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [fetchChildren]);

  const handleAddChild = () => {
    router.push('/dashboard/parent/children/add');
  };

  const handleViewChild = (child: any) => {
    router.push(`/dashboard/parent/children/${child.id}`);
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} years`;
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (child: any) => (
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            {child.photoURL ? (
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={child.photoURL}
                alt={`${child.firstName} ${child.lastName}`}
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 font-medium">
                  {child.firstName.charAt(0)}
                  {child.lastName.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">
              {child.firstName} {child.lastName}
            </div>
            {child.identificationNumber && (
              <div className="text-gray-500">
                ID: {child.identificationNumber}
              </div>
            )}
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      key: 'age',
      header: 'Age',
      render: (child: any) => calculateAge(child.dateOfBirth),
      sortable: true,
    },
    {
      key: 'gender',
      header: 'Gender',
      render: (child: any) => child.gender.charAt(0).toUpperCase() + child.gender.slice(1),
      sortable: true,
    },
    {
      key: 'schoolName',
      header: 'School',
      render: (child: any) => child.schoolName || 'Not specified',
      sortable: true,
    },
  ];

  const renderActions = (child: any) => (
    <div className="flex space-x-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/dashboard/parent/children/${child.id}`);
        }}
        className="text-blue-600 hover:text-blue-900"
      >
        View
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/dashboard/parent/children/${child.id}/edit`);
        }}
        className="text-blue-600 hover:text-blue-900"
      >
        Edit
      </button>
    </div>
  );

  const emptyState = (
    <div className="p-8 text-center">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">No children</h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new child profile.
      </p>
      <div className="mt-6">
        <button
          onClick={handleAddChild}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg
            className="-ml-1 mr-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add child
        </button>
      </div>
    </div>
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">My Children</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all your registered children and their basic information.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={handleAddChild}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            Add child
          </button>
        </div>
      </div>

      <div className="mt-8">
        {children.length === 0 && !isLoading && !loading ? (
          emptyState
        ) : (
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <DataTable
              data={children}
              columns={columns}
              keyField="id"
              isLoading={isLoading || loading}
              emptyMessage="No children found"
              onRowClick={handleViewChild}
              actions={renderActions}
            />
          </div>
        )}
      </div>
    </div>
  );
}