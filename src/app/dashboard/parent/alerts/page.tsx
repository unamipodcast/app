'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAlerts } from '@/hooks/useAlerts';
import { useChildProfiles } from '@/hooks/useChildProfiles';
import { ChildAlert, ChildProfile } from '@/types/child';

export default function ParentAlertsPage() {
  const { alerts, loading, error, resolveAlert, cancelAlert } = useAlerts();
  const { children } = useChildProfiles();
  const [activeAlerts, setActiveAlerts] = useState<ChildAlert[]>([]);
  const [resolvedAlerts, setResolvedAlerts] = useState<ChildAlert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<ChildAlert | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'resolve' | 'cancel' | null>(null);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Group alerts by status
  useEffect(() => {
    if (alerts) {
      setActiveAlerts(alerts.filter(alert => alert.status === 'active'));
      setResolvedAlerts(alerts.filter(alert => alert.status === 'resolved' || alert.status === 'cancelled'));
    }
  }, [alerts]);

  // Find child details for an alert
  const getChildDetails = (childId: string): ChildProfile | undefined => {
    return children.find(child => child.id === childId);
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  // Open modal for resolving or cancelling an alert
  const openModal = (alert: ChildAlert, type: 'resolve' | 'cancel') => {
    setSelectedAlert(alert);
    setActionType(type);
    setReason('');
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAlert(null);
    setActionType(null);
    setReason('');
  };

  // Handle alert action (resolve or cancel)
  const handleAlertAction = async () => {
    if (!selectedAlert || !actionType) return;
    
    setIsSubmitting(true);
    
    try {
      if (actionType === 'resolve') {
        await resolveAlert(selectedAlert.id, reason);
      } else {
        await cancelAlert(selectedAlert.id, reason);
      }
      closeModal();
    } catch (error) {
      console.error(`Error ${actionType === 'resolve' ? 'resolving' : 'cancelling'} alert:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get status badge class
  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case 'active':
        return 'bg-red-100 text-red-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Alerts</h1>
          <p className="mt-2 text-sm text-gray-700">
            View and manage alerts for your children.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/dashboard/parent/report"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-brand-blue px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-darkBlue focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 sm:w-auto"
          >
            Report Missing Child
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-blue border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-gray-500">Loading alerts...</p>
        </div>
      ) : error ? (
        <div className="mt-8 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading alerts</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>There was an error loading your alerts. Please try again later.</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Active Alerts */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900">Active Alerts</h2>
            {activeAlerts.length === 0 ? (
              <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md p-6 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No active alerts</h3>
                <p className="mt-1 text-sm text-gray-500">You don't have any active alerts at the moment.</p>
              </div>
            ) : (
              <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {activeAlerts.map((alert) => {
                    const child = getChildDetails(alert.childId);
                    return (
                      <li key={alert.id}>
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                {child?.photoURL ? (
                                  <img
                                    className="h-12 w-12 rounded-full object-cover"
                                    src={child.photoURL}
                                    alt={`${child.firstName} ${child.lastName}`}
                                  />
                                ) : (
                                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <h4 className="text-lg font-medium text-gray-900">
                                  {child ? `${child.firstName} ${child.lastName}` : 'Unknown Child'}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {alert.type === 'missing' ? 'Missing Child' : 
                                   alert.type === 'medical' ? 'Medical Emergency' : 'Other Emergency'}
                                </p>
                              </div>
                            </div>
                            <div className="ml-2 flex-shrink-0 flex">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(alert.status)}`}>
                                {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                              </span>
                            </div>
                          </div>
                          <div className="mt-4">
                            <p className="text-sm text-gray-600 line-clamp-2">{alert.description}</p>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {alert.lastSeenLocation?.address || 'Location not specified'}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p>
                                Created: {formatDate(alert.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 flex space-x-3">
                            <button
                              type="button"
                              onClick={() => openModal(alert, 'resolve')}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              Resolve Alert
                            </button>
                            <button
                              type="button"
                              onClick={() => openModal(alert, 'cancel')}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
                            >
                              Cancel Alert
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          {/* Resolved/Cancelled Alerts */}
          {resolvedAlerts.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900">Past Alerts</h2>
              <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {resolvedAlerts.map((alert) => {
                    const child = getChildDetails(alert.childId);
                    return (
                      <li key={alert.id}>
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                {child?.photoURL ? (
                                  <img
                                    className="h-12 w-12 rounded-full object-cover"
                                    src={child.photoURL}
                                    alt={`${child.firstName} ${child.lastName}`}
                                  />
                                ) : (
                                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <h4 className="text-lg font-medium text-gray-900">
                                  {child ? `${child.firstName} ${child.lastName}` : 'Unknown Child'}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {alert.type === 'missing' ? 'Missing Child' : 
                                   alert.type === 'medical' ? 'Medical Emergency' : 'Other Emergency'}
                                </p>
                              </div>
                            </div>
                            <div className="ml-2 flex-shrink-0 flex">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(alert.status)}`}>
                                {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>Created: {formatDate(alert.createdAt)}</span>
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p>
                                {alert.resolvedAt ? `Resolved: ${formatDate(alert.resolvedAt)}` : `Updated: ${formatDate(alert.updatedAt)}`}
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal for resolving or cancelling alerts */}
      {isModalOpen && selectedAlert && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                  {actionType === 'resolve' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {actionType === 'resolve' ? 'Resolve Alert' : 'Cancel Alert'}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {actionType === 'resolve'
                        ? 'Are you sure you want to resolve this alert? This will mark the alert as resolved and notify authorities.'
                        : 'Are you sure you want to cancel this alert? This will mark the alert as cancelled and notify authorities.'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-5">
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                  {actionType === 'resolve' ? 'Resolution details (optional)' : 'Cancellation reason (optional)'}
                </label>
                <div className="mt-1">
                  <textarea
                    id="reason"
                    name="reason"
                    rows={3}
                    className="shadow-sm focus:ring-brand-blue focus:border-brand-blue block w-full sm:text-sm border border-gray-300 rounded-md"
                    placeholder={actionType === 'resolve' ? 'Provide details about how the situation was resolved' : 'Provide reason for cancellation'}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:col-start-2 sm:text-sm ${
                    actionType === 'resolve'
                      ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                      : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                  }`}
                  onClick={handleAlertAction}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : actionType === 'resolve' ? 'Resolve' : 'Cancel'}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={closeModal}
                  disabled={isSubmitting}
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}