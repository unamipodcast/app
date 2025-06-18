import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { UserRole } from '@/types/user';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

// Admin user credentials
const ADMIN_EMAIL = 'info@unamifoundation.org';

const handler = NextAuth({
  providers: [
    // Only include Google provider if credentials are properly configured
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? 
      [GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        profile(profile) {
          // Check if Google login is the admin email
          const isAdmin = profile.email === ADMIN_EMAIL;
          
          return {
            id: profile.sub,
            name: profile.name,
            email: profile.email,
            image: profile.picture,
            role: isAdmin ? 'admin' : 'parent',
          };
        }
      })] : []),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' }, // Allow role to be passed from client
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Check if this is the admin user
          if (credentials.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
            try {
              // Get admin user from Firebase
              const adminUser = await adminAuth.getUserByEmail(credentials.email);
              
              // Get user claims to check roles
              const userRecord = await adminAuth.getUser(adminUser.uid);
              const customClaims = userRecord.customClaims || {};
              
              // Determine role based on passed role or default to admin
              let role = credentials.role || 'admin';
              
              // Verify the admin has this role
              const roles = customClaims.roles || ['admin'];
              if (!roles.includes(role)) {
                role = 'admin'; // Default to admin if requested role not found
              }
              
              return {
                id: adminUser.uid,
                email: adminUser.email,
                name: adminUser.displayName || 'Admin User',
                role: role as UserRole,
                roles: roles,
              };
            } catch (error) {
              console.error('Admin authentication error:', error);
              return null;
            }
          }
          
          // For non-admin users (not used in this case)
          return null;
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Handle role updates from session
      if (trigger === 'update' && session?.role) {
        token.role = session.role;
      }
      
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'admin';
        token.roles = (user as any).roles || [token.role];
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).roles = token.roles;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // If it's a dashboard URL without a specific role path
      if (url === `${baseUrl}/dashboard`) {
        // The middleware will handle the specific role redirect
        return url;
      }
      return url;
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };