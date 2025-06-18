'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useFirestore } from './useFirestore';
import { toast } from 'react-hot-toast';

export type AlertStatus = 'active' | 'resolved' | 'cancelled';
export type AlertType = 'missing' | 'medical' | 'danger' | 'other';

export interface ChildAlert {
  id: string;
  childId: string;
  status: AlertStatus;
  alertType: AlertType;
  description: string;
  lastSeenLocation?: string;
  lastSeenTime?: string;
  lastSeenWearing?: string;
  attachments?: string[];
  contactInfo?: {
    name: string;
    phone: string;
    email?: string;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNotes?: string;
}

export interface CreateAlertData {
  childId: string;
  alertType: AlertType;
  description: string;
  lastSeenLocation?: string;
  lastSeenTime?: string;
  lastSeenWearing?: string;
  attachments?: string[];
  contactInfo?: {
    name: string;
    phone: string;
    email?: string;
  };
}

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<ChildAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { userProfile } = useAuth();
  const { 
    addDocument, 
    updateDocument, 
    getDocument, 
    queryDocuments, 
    whereEqual,
    whereIn,
    orderByDesc,
    subscribeToCollection
  } = useFirestore();

  // Fetch alerts based on role
  const fetchAlerts = useCallback(async () => {
    if (!userProfile) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let fetchedAlerts: ChildAlert[] = [];
      
      if (userProfile.role === 'parent') {
        // For parents, fetch alerts for their children
        // First, get their children
        const children = await queryDocuments<{ id: string }>('children', [
          whereEqual('guardians', userProfile.id)
        ]);
        
        const childIds = children.map(child => child.id);
        
        if (childIds.length > 0) {
          // Then get alerts for those children
          fetchedAlerts = await queryDocuments<ChildAlert>('alerts', [
            whereIn('childId', childIds)
          ]);
        }
      } else if (['admin', 'authority', 'school'].includes(userProfile.role)) {
        // Admins, authorities, and schools can see all alerts
        fetchedAlerts = await queryDocuments<ChildAlert>('alerts', [
          orderByDesc('createdAt')
        ]);
      }
      
      setAlerts(fetchedAlerts);
    } catch (err) {
      console.error('Error fetching alerts:', err);
      setError(err as Error);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  }, [userProfile, queryDocuments, whereEqual, whereIn, orderByDesc]);

  // Set up real-time subscription
  useEffect(() => {
    if (!userProfile) return;
    
    let unsubscribe: () => void;
    
    const setupSubscription = async () => {
      try {
        let constraints = [];
        
        if (userProfile.role === 'parent') {
          // For parents, we need to first get their children
          const children = await queryDocuments<{ id: string }>('children', [
            whereEqual('guardians', userProfile.id)
          ]);
          
          const childIds = children.map(child => child.id);
          
          if (childIds.length > 0) {
            constraints = [whereIn('childId', childIds)];
          } else {
            // No children, so no alerts
            setAlerts([]);
            setLoading(false);
            return;
          }
        }
        
        // Add sorting by creation date
        constraints.push(orderByDesc('createdAt'));
        
        unsubscribe = subscribeToCollection<ChildAlert>(
          'alerts',
          constraints,
          (updatedAlerts) => {
            setAlerts(updatedAlerts);
            setLoading(false);
          },
          (err) => {
            console.error('Subscription error:', err);
            setError(err);
            setLoading(false);
          }
        );
      } catch (err) {
        console.error('Error setting up subscription:', err);
        setError(err as Error);
        setLoading(false);
      }
    };
    
    setupSubscription();
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [userProfile, subscribeToCollection, queryDocuments, whereEqual, whereIn, orderByDesc]);

  // Create a new alert
  const createAlert = async (alertData: CreateAlertData): Promise<ChildAlert> => {
    try {
      if (!userProfile) {
        throw new Error('User not authenticated');
      }
      
      // Add timestamp fields and status
      const timestamp = new Date().toISOString();
      const alertWithTimestamps = {
        ...alertData,
        status: 'active' as AlertStatus,
        createdAt: timestamp,
        updatedAt: timestamp,
        createdBy: userProfile.id
      };
      
      // Add the document to Firestore
      const newAlert = await addDocument<ChildAlert>('alerts', alertWithTimestamps);
      
      toast.success('Alert created successfully');
      return newAlert;
    } catch (error) {
      console.error('Error creating alert:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create alert');
      throw error;
    }
  };

  // Update an existing alert
  const updateAlert = async (id: string, alertData: Partial<ChildAlert>): Promise<ChildAlert> => {
    try {
      // Add updated timestamp
      const dataWithTimestamp = {
        ...alertData,
        updatedAt: new Date().toISOString()
      };
      
      // If resolving the alert, add resolution timestamp
      if (alertData.status === 'resolved' && !alertData.resolvedAt) {
        dataWithTimestamp.resolvedAt = new Date().toISOString();
        dataWithTimestamp.resolvedBy = userProfile?.id;
      }
      
      const updatedAlert = await updateDocument<ChildAlert>('alerts', id, dataWithTimestamp);
      toast.success('Alert updated successfully');
      return updatedAlert as ChildAlert;
    } catch (error) {
      console.error('Error updating alert:', error);
      toast.error('Failed to update alert');
      throw error;
    }
  };

  // Get a specific alert
  const getAlert = async (id: string): Promise<ChildAlert> => {
    try {
      return await getDocument<ChildAlert>('alerts', id);
    } catch (error) {
      console.error('Error getting alert:', error);
      toast.error('Failed to load alert');
      throw error;
    }
  };

  // Resolve an alert
  const resolveAlert = async (id: string, resolutionNotes?: string): Promise<ChildAlert> => {
    try {
      const timestamp = new Date().toISOString();
      const resolution = {
        status: 'resolved' as AlertStatus,
        resolvedAt: timestamp,
        resolvedBy: userProfile?.id,
        resolutionNotes,
        updatedAt: timestamp
      };
      
      const updatedAlert = await updateDocument<ChildAlert>('alerts', id, resolution);
      toast.success('Alert resolved successfully');
      return updatedAlert as ChildAlert;
    } catch (error) {
      console.error('Error resolving alert:', error);
      toast.error('Failed to resolve alert');
      throw error;
    }
  };

  return {
    alerts,
    loading,
    error,
    fetchAlerts,
    createAlert,
    updateAlert,
    getAlert,
    resolveAlert
  };
};