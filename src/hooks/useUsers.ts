'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useFirestore } from './useFirestore';
import { toast } from 'react-hot-toast';
import { UserProfile, UserRole } from '@/types/user';

export interface CreateUserData {
  email: string;
  displayName: string;
  role: UserRole;
  phoneNumber?: string;
  address?: string;
  organization?: {
    id: string;
    name: string;
    type: 'school' | 'authority' | 'community';
  };
}

export const useUsers = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { userProfile } = useAuth();
  const { 
    addDocument, 
    updateDocument, 
    deleteDocument, 
    getDocument, 
    queryDocuments, 
    whereEqual,
    subscribeToCollection
  } = useFirestore();

  // Fetch users based on role
  const fetchUsers = useCallback(async () => {
    if (!userProfile || userProfile.role !== 'admin') {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Admin can see all users
      const fetchedUsers = await queryDocuments<UserProfile>('users', []);
      setUsers(fetchedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err as Error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [userProfile, queryDocuments]);

  // Set up real-time subscription
  useEffect(() => {
    if (!userProfile || userProfile.role !== 'admin') return;
    
    let unsubscribe: () => void;
    
    const setupSubscription = async () => {
      try {
        unsubscribe = subscribeToCollection<UserProfile>(
          'users',
          [],
          (updatedUsers) => {
            setUsers(updatedUsers);
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
  }, [userProfile, subscribeToCollection]);

  // Create a new user
  const createUser = async (userData: CreateUserData): Promise<UserProfile> => {
    try {
      if (!userProfile) {
        throw new Error('User not authenticated');
      }
      
      // Ensure all fields have values (no undefined or null)
      const cleanedUserData = {
        email: userData.email,
        displayName: userData.displayName,
        role: userData.role,
        roles: [userData.role],
        phoneNumber: userData.phoneNumber || '',
        address: userData.address || '',
        organization: userData.organization ? {
          id: userData.organization.id || `org-${Date.now()}`,
          name: userData.organization.name || '',
          type: userData.organization.type || 'school'
        } : null,
      };
      
      // Add timestamp fields and active status
      const timestamp = new Date().toISOString();
      const userWithTimestamps = {
        ...cleanedUserData,
        createdAt: timestamp,
        updatedAt: timestamp,
        createdBy: userProfile.id,
        isActive: true
      };
      
      console.log('Creating user with data:', JSON.stringify(userWithTimestamps));
      
      // Add the document to Firestore
      const newUser = await addDocument<UserProfile>('users', userWithTimestamps);
      
      toast.success('User created successfully');
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create user');
      throw error;
    }
  };

  // Update an existing user
  const updateUser = async (id: string, userData: Partial<UserProfile>): Promise<UserProfile> => {
    try {
      if (!userProfile || userProfile.role !== 'admin') {
        throw new Error('Unauthorized: Only admins can update users');
      }
      
      // Add updated timestamp
      const dataWithTimestamp = {
        ...userData,
        updatedAt: new Date().toISOString()
      };
      
      const updatedUser = await updateDocument<UserProfile>('users', id, dataWithTimestamp);
      toast.success('User updated successfully');
      return updatedUser as UserProfile;
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
      throw error;
    }
  };

  // Delete a user
  const deleteUser = async (id: string): Promise<boolean> => {
    try {
      if (!userProfile || userProfile.role !== 'admin') {
        throw new Error('Unauthorized: Only admins can delete users');
      }
      
      await deleteDocument('users', id);
      toast.success('User deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
      throw error;
    }
  };

  // Get a specific user
  const getUser = async (id: string): Promise<UserProfile> => {
    try {
      return await getDocument<UserProfile>('users', id);
    } catch (error) {
      console.error('Error getting user:', error);
      toast.error('Failed to load user');
      throw error;
    }
  };

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    getUser
  };
};