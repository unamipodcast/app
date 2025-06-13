export interface ChildProfile {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  photoURL?: string;
  guardians: string[]; // Array of parent/guardian user IDs
  school?: {
    id: string;
    name: string;
    grade?: string;
    class?: string;
    teacherName?: string;
  };
  medicalInfo?: {
    bloodType?: string;
    allergies?: string[];
    conditions?: string[];
    medications?: string[];
    doctorName?: string;
    doctorContact?: string;
  };
  identifiers?: {
    idNumber?: string;
    birthCertNumber?: string;
    passportNumber?: string;
  };
  physicalAttributes?: {
    height?: number; // in cm
    weight?: number; // in kg
    eyeColor?: string;
    hairColor?: string;
    distinguishingFeatures?: string[];
  };
  emergencyContacts: {
    name: string;
    relationship: string;
    phoneNumber: string;
    email?: string;
  }[];
  lastUpdated: Date | string;
  createdAt: Date | string;
  isActive: boolean;
}

export interface MissingChildAlert {
  id: string;
  childId: string;
  reporterId: string; // User ID who reported
  status: 'active' | 'resolved' | 'false';
  dateReported: Date | string;
  dateResolved?: Date | string;
  lastSeenLocation?: {
    address?: string;
    latitude?: number;
    longitude?: number;
    timestamp: Date | string;
  };
  lastSeenWearing?: string;
  additionalDetails?: string;
  resolvedBy?: string; // User ID who resolved the alert
  resolutionDetails?: string;
}