// Mock Firebase Admin SDK to avoid server-side issues
// In a production environment, you would use the actual Firebase Admin SDK

// Mock admin auth
const adminAuth = {
  createUser: async (userData: any) => {
    console.log('Mock: Creating user', userData);
    return { uid: `mock-uid-${Date.now()}`, ...userData };
  },
  updateUser: async (uid: string, userData: any) => {
    console.log('Mock: Updating user', uid, userData);
    return { uid, ...userData };
  },
};

// Mock admin firestore
const adminDb = {
  collection: (collectionName: string) => ({
    doc: (docId: string) => ({
      get: async () => ({
        exists: true,
        data: () => ({ id: docId, role: 'parent', displayName: 'Mock User' }),
      }),
      set: async (data: any) => {
        console.log(`Mock: Setting document in ${collectionName}/${docId}`, data);
        return true;
      },
      update: async (data: any) => {
        console.log(`Mock: Updating document in ${collectionName}/${docId}`, data);
        return true;
      },
    }),
    where: () => ({
      where: () => ({
        orderBy: () => ({
          get: async () => ({
            docs: [
              {
                id: 'mock-doc-1',
                data: () => ({ name: 'Mock Document 1' }),
              },
            ],
          }),
        }),
      }),
    }),
  }),
};

// Mock admin storage
const adminStorage = {
  bucket: () => ({
    file: (path: string) => ({
      getSignedUrl: async () => ['https://mock-signed-url.com'],
    }),
  }),
};

export { adminAuth, adminDb, adminStorage };