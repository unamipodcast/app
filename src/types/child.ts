export interface ChildProfile {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  parentId: string;
  schoolId?: string;
  photoURL?: string;
  identificationNumber?: string;
  address?: string;
  medicalConditions?: string[];
  emergencyContacts?: {
    name: string;
    relationship: string;
    phone: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface ChildAlert {
  id: string;
  childId: string;
  childName: string;
  childAge: number;
  childPhoto?: string;
  lastSeen: {
    date: string;
    location: string;
    description: string;
  };
  status: 'active' | 'resolved' | 'cancelled';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionDetails?: string;
}