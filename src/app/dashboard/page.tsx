'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardRedirect() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (userProfile) {
      switch (userProfile.role) {
        case 'parent':
          router.push('/dashboard/parent');
          break;
        case 'school':
          router.push('/dashboard/school');
          break;
        case 'authority':
          router.push('/dashboard/authority');
          break;
        case 'community':
          router.push('/dashboard/community');
          break;
        case 'admin':
          router.push('/dashboard/admin');
          break;
        default:
          router.push('/dashboard/parent');
      }
    }
  }, [user, userProfile, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  );
}