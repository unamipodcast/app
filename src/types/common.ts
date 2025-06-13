export interface BaseEntity {
  id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  isActive: boolean;
}

export interface Address {
  street?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  timestamp: Date | string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phoneNumber: string;
  email?: string;
  address?: Address;
}

export interface PhysicalAttributes {
  height?: number; // in cm
  weight?: number; // in kg
  eyeColor?: string;
  hairColor?: string;
  distinguishingFeatures?: string[];
}

export interface MedicalInformation {
  bloodType?: string;
  allergies?: string[];
  conditions?: string[];
  medications?: string[];
  doctorName?: string;
  doctorContact?: string;
  medicalAidName?: string;
  medicalAidNumber?: string;
}

export interface SchoolInformation {
  id?: string;
  name: string;
  grade?: string;
  class?: string;
  teacherName?: string;
  contactNumber?: string;
  address?: Address;
}

export interface Identifiers {
  idNumber?: string;
  birthCertNumber?: string;
  passportNumber?: string;
  otherIds?: {
    type: string;
    value: string;
  }[];
}

export type AlertStatus = 'active' | 'resolved' | 'false';
export type AlertPriority = 'high' | 'medium' | 'low';
export type AlertType = 'missing' | 'medical' | 'safety' | 'other';