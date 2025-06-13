import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp, 
  DocumentData, 
  QueryConstraint 
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export const useFirestore = () => {
  // Create a document with a specific ID
  const createDocument = async <T extends DocumentData>(
    collectionName: string, 
    id: string, 
    data: T
  ) => {
    try {
      const docRef = doc(db, collectionName, id);
      await setDoc(docRef, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { id, ...data };
    } catch (error) {
      console.error(`Error creating document in ${collectionName}:`, error);
      throw error;
    }
  };

  // Get a document by ID
  const getDocument = async <T extends DocumentData>(
    collectionName: string, 
    id: string
  ): Promise<T & { id: string }> => {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T & { id: string };
      } else {
        throw new Error(`Document ${id} not found in ${collectionName}`);
      }
    } catch (error) {
      console.error(`Error getting document from ${collectionName}:`, error);
      throw error;
    }
  };

  // Update a document
  const updateDocument = async <T extends DocumentData>(
    collectionName: string, 
    id: string, 
    data: Partial<T>
  ) => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
      return { id, ...data };
    } catch (error) {
      console.error(`Error updating document in ${collectionName}:`, error);
      throw error;
    }
  };

  // Delete a document
  const deleteDocument = async (collectionName: string, id: string) => {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error(`Error deleting document from ${collectionName}:`, error);
      throw error;
    }
  };

  // Query documents
  const queryDocuments = async <T extends DocumentData>(
    collectionName: string,
    constraints: QueryConstraint[] = []
  ): Promise<(T & { id: string })[]> => {
    try {
      const collectionRef = collection(db, collectionName);
      const q = query(collectionRef, ...constraints);
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as (T & { id: string })[];
    } catch (error) {
      console.error(`Error querying documents from ${collectionName}:`, error);
      throw error;
    }
  };

  return {
    createDocument,
    getDocument,
    updateDocument,
    deleteDocument,
    queryDocuments,
    // Helper functions for query constraints
    where,
    orderBy,
    limit,
  };
};