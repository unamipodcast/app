'use client';

import { Suspense } from 'react';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Loading component for better UX
const DashboardLoading = () => (
  <div className="flex justify-center items-center h-64">
    <LoadingSpinner size="large" color="primary" />
  </div>
);

export default function AuthorityDashboard() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardOverview role="authority" />
    </Suspense>
  );
}