import { useState } from 'react';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject,
  UploadTask
} from 'firebase/storage';
import { storage } from '@/lib/firebase/config';

interface UploadProgress {
  progress: number;
  url: string | null;
  error: Error | null;
  isComplete: boolean;
}

export const useStorage = () => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    progress: 0,
    url: null,
    error: null,
    isComplete: false
  });
  
  const [uploadTask, setUploadTask] = useState<UploadTask | null>(null);

  // Upload a file to Firebase Storage
  const uploadFile = (file: File, path: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Create a storage reference
      const storageRef = ref(storage, path);
      
      // Upload the file
      const task = uploadBytesResumable(storageRef, file);
      setUploadTask(task);
      
      // Monitor upload progress
      task.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(prev => ({ ...prev, progress }));
        },
        (error) => {
          setUploadProgress(prev => ({ ...prev, error }));
          reject(error);
        },
        async () => {
          // Upload completed successfully
          const downloadURL = await getDownloadURL(task.snapshot.ref);
          setUploadProgress({
            progress: 100,
            url: downloadURL,
            error: null,
            isComplete: true
          });
          resolve(downloadURL);
        }
      );
    });
  };

  // Delete a file from Firebase Storage
  const deleteFile = async (path: string): Promise<boolean> => {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  };

  // Cancel the current upload
  const cancelUpload = () => {
    if (uploadTask) {
      uploadTask.cancel();
      setUploadProgress({
        progress: 0,
        url: null,
        error: null,
        isComplete: false
      });
      return true;
    }
    return false;
  };

  return {
    uploadFile,
    deleteFile,
    cancelUpload,
    uploadProgress
  };
};