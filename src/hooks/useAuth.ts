'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signOut, useSession, update } from 'next-auth/react';
import { UserProfile, UserRole } from '@/types/user';
import { auth } from '@/lib/firebase/config';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';

interface AuthContextType {
  user: any | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string, role: UserRole) => Promise<void>;
  signIn: (email: string, password: string, role?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  switchRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status, update: updateSession } = useSession();
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
  }, [session, status, router]);

  const signUpUser = async (email: string, password: string, displayName: string, role: UserRole) => {
    try {
      // First create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user profile with display name
      await updateProfile(userCredential.user, {
        displayName: displayName
      });
      
      // Then sign in with NextAuth
      await signIn('credentials', {
        email,
        password,
        role,
        callbackUrl: '/dashboard',
        redirect: true,
      });
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  };

  const signInUser = async (email: string, password: string, role?: string) => {
    try {
      await signIn('credentials', {
        email,
        password,
        role,
        redirect: true,
        callbackUrl: role ? `/dashboard/${role}` : '/dashboard',
      });
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signInWithGoogleUser = async () => {
    try {
      // First sign in with Firebase Auth
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Then sign in with NextAuth
      await signIn('google', {
        callbackUrl: '/dashboard',
        redirect: true,
      });
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const logoutUser = async () => {
    try {
      // Sign out from Firebase Auth
      await auth.signOut();
      
      // Sign out from NextAuth
      await signOut({ 
        callbackUrl: '/auth/login',
        redirect: true
      });
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const resetPasswordUser = async (email: string) => {
    try {
      // Send password reset email via Firebase Auth
      await sendPasswordResetEmail(auth, email);
      return Promise.resolve();
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  };

  const switchRole = async (role: UserRole) => {
    try {
      if (!session) throw new Error('No active session');
      
      // Update session with new role
      await updateSession({
        ...session,
        user: {
          ...session.user,
          role
        }
      });
      
      // Redirect to the appropriate dashboard
      router.push(`/dashboard/${role}`);
    } catch (error) {
      console.error('Error switching role:', error);
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
    switchRole,
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