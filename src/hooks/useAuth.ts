'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import { UserProfile, UserRole } from '@/types/user';

interface AuthContextType {
  user: any | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string, role: UserRole) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
      return;
    }

    if (session?.user) {
      // Create a user profile from session data
      const profile: UserProfile = {
        id: (session.user as any).id || 'unknown',
        email: session.user.email || '',
        displayName: session.user.name || '',
        photoURL: session.user.image || undefined,
        role: (session.user as any).role || 'parent',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
      };
      
      setUserProfile(profile);
    } else {
      setUserProfile(null);
    }
    
    setLoading(false);
  }, [session, status]);

  const signUpUser = async (email: string, password: string, displayName: string, role: UserRole) => {
    try {
      // For now, just use credentials sign in
      await signIn('credentials', {
        email,
        password,
        callbackUrl: '/dashboard',
      });
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const signInUser = async (email: string, password: string) => {
    try {
      await signIn('credentials', {
        email,
        password,
        callbackUrl: '/dashboard',
      });
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signInWithGoogleUser = async () => {
    try {
      await signIn('google', {
        callbackUrl: '/dashboard',
      });
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const logoutUser = async () => {
    try {
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const resetPasswordUser = async (email: string) => {
    try {
      // Mock password reset for now
      console.log('Password reset email sent to:', email);
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  };

  const value = {
    user: session?.user || null,
    userProfile,
    loading: loading || status === 'loading',
    signUp: signUpUser,
    signIn: signInUser,
    signInWithGoogle: signInWithGoogleUser,
    logout: logoutUser,
    resetPassword: resetPasswordUser,
  };

  return React.createElement(AuthContext.Provider, { value: value as AuthContextType }, children);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};