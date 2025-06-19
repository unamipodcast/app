'use client';

// Client-side Firebase configuration
// Import Firebase only on the client side to avoid server-side issues

let auth: any;
let db: any;
let storage: any;
let app: any;

// Initialize Firebase only on the client side
if (typeof window !== 'undefined') {
  const initializeFirebase = async () => {
    try {
      const { initializeApp, getApps, getApp } = await import('firebase/app');
      const { getAuth } = await import('firebase/auth');
      const { getFirestore } = await import('firebase/firestore');
      const { getStorage } = await import('firebase/storage');

      // Use the correct API key
      const firebaseConfig = {
        apiKey: "AIzaSyAOTwbhK_9hY3sq5XovbesA5mSLHZgIP_k",
        authDomain: "ncip-app.firebaseapp.com",
        projectId: "ncip-app",
        storageBucket: "ncip-app.appspot.com",
        messagingSenderId: "367751256949",
        appId: "1:367751256949:web:e8dd3aed65a55e7bc9d13c"
      };

      // Initialize Firebase
      app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
      auth = getAuth(app);
      db = getFirestore(app);
      storage = getStorage(app);
      
      console.log("Firebase client initialized successfully");
    } catch (error) {
      console.error("Error initializing Firebase client:", error);
      // Continue without Firebase - NextAuth will still work for authentication
    }
  };

  // Initialize Firebase when this module is imported on the client
  initializeFirebase();
}

export { app, auth, db, storage };