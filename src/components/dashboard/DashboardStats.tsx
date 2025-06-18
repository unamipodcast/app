'use client';

import { useState, useEffect } from 'react';
import { UserRole } from '@/types/user';
import { useChildProfiles } from '@/hooks/useChildProfiles';
import { useAlerts } from '@/hooks/useAlerts';
import { useResources } from '@/hooks/useResources';
import { useAuth } from '@/hooks/useAuth';

interface DashboardStatsProps {
  role: UserRole;
}

export default function DashboardStats({ role }: DashboardStatsProps) {
  const { children } = useChildProfiles();
  const { alerts } = useAlerts();
  const { resources } = useResources();
  const { userProfile } = useAuth();
  const [childrenChange, setChildrenChange] = useState('0%');
  const [childrenChangeType, setChildrenChangeType] = useState<'increase' | 'decrease' | 'neutral'>('neutral');
  
  // Calculate change percentage for children (simulated for now)
  useEffect(() => {
    // In a real app, you would compare with historical data
    // For now, we'll just set a neutral value if no children, or a small increase if there are children
    if (children.length === 0) {
      setChildrenChange('0%');
      setChildrenChangeType('neutral');
    } else {
      setChildrenChange('+1.2%');
      setChildrenChangeType('increase');
    }
  }, [children.length]);
  
  // Get stats based on user role
  const getStats = () => {
    const defaultStats = [
      {
        name: 'Total Children',
        value: children.length,
        change: childrenChange,
        changeType: childrenChangeType,
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        ),
      },
      {
        name: 'Active Alerts',
        value: alerts.filter(alert => alert.status === 'active').length,
        change: '-1.39%',
        changeType: 'decrease' as const,
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        ),
      },
      {
        name: 'Resources',
        value: resources.length,
        change: '+2.4%',
        changeType: 'increase' as const,
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        ),
      },
      {
        name: 'Reports',
        value: 0, // Changed from hardcoded 12 to 0
        change: '0%', // Changed from hardcoded +5.25% to 0%
        changeType: 'neutral' as const,
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
      },
    ];
    
    // Return appropriate stats based on role
    switch (role) {
      case 'parent':
        return defaultStats;
      case 'admin':
        // Admin stats would be implemented here
        return defaultStats;
      case 'school':
        // School stats would be implemented here
        return defaultStats;
      case 'authority':
        // Authority stats would be implemented here
        return defaultStats;
      default:
        return defaultStats;
    }
  };

  const stats = getStats();

  return (
    <div>
      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="relative bg-white pt-5 px-4 pb-6 sm:pt-6 sm:px-6 shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <dt>
              <div className="absolute rounded-md p-3 bg-indigo-50">
                {stat.icon}
              </div>
              <p className="ml-16 text-sm font-medium text-gray-500 truncate">{stat.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              <p
                className={`ml-2 flex items-baseline text-sm font-semibold ${
                  stat.changeType === 'increase' ? 'text-green-600' : 
                  stat.changeType === 'decrease' ? 'text-red-600' : 'text-gray-500'
                }`}
              >
                {stat.changeType === 'increase' ? (
                  <svg className="self-center flex-shrink-0 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                ) : stat.changeType === 'decrease' ? (
                  <svg className="self-center flex-shrink-0 h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : null}
                <span className="sr-only">
                  {stat.changeType === 'increase' ? 'Increased' : stat.changeType === 'decrease' ? 'Decreased' : 'No change'} by
                </span>
                {stat.change}
              </p>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}