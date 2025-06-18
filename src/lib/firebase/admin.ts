import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    // Log environment variables for debugging (without exposing sensitive data)
    console.log('Firebase Admin SDK initialization:');
    console.log('- Project ID:', process.env.FIREBASE_SERVICE_ACCOUNT_PROJECT_ID);
    console.log('- Client Email exists:', !!process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL);
    console.log('- Private Key exists:', !!process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY);
    console.log('- Storage Bucket:', `${process.env.FIREBASE_SERVICE_ACCOUNT_PROJECT_ID}.appspot.com`);

    // Fix for private key format
    const privateKey = process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY 
      ? process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n') 
      : undefined;

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_SERVICE_ACCOUNT_PROJECT_ID,
        clientEmail: process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
      storageBucket: `${process.env.FIREBASE_SERVICE_ACCOUNT_PROJECT_ID}.appspot.com`,
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Firebase admin initialization error', error);
    throw error; // Re-throw to make sure we don't silently fail
  }
}

// Export admin services
const adminAuth = admin.auth();
const adminDb = admin.firestore();
const adminStorage = admin.storage();

export { adminAuth, adminDb, adminStorage };