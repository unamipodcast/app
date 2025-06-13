'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { AuthProvider as CustomAuthProvider } from '@/hooks/useAuth';

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <CustomAuthProvider>
        {children}
      </CustomAuthProvider>
    </SessionProvider>
  );
}