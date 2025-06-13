export type UserRole = 'parent' | 'school' | 'authority' | 'community' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phoneNumber?: string;
  role: UserRole;
  createdAt: Date | string;
  updatedAt: Date | string;
  isActive: boolean;
  address?: {
    street?: string;
    city?: string;
    province?: string;
    postalCode?: string;
  };
  organization?: {
    name?: string;
    position?: string;
    id?: string;
  };
}

export interface ParentProfile extends UserProfile {
  role: 'parent';
  children: string[]; // Array of child IDs
}

export interface SchoolProfile extends UserProfile {
  role: 'school';
  schoolName: string;
  schoolType: 'primary' | 'secondary' | 'combined' | 'special';
  registrationNumber?: string;
  students?: string[]; // Array of child IDs
}

export interface AuthorityProfile extends UserProfile {
  role: 'authority';
  authorityType: 'police' | 'social' | 'health' | 'ngo';
  badgeNumber?: string;
  jurisdiction?: string;
}

export interface CommunityProfile extends UserProfile {
  role: 'community';
  communityName: string;
  position: string;
  area: string;
}

export interface AdminProfile extends UserProfile {
  role: 'admin';
  adminLevel: 'super' | 'regional' | 'support';
}

export type AnyUserProfile = 
  | ParentProfile 
  | SchoolProfile 
  | AuthorityProfile 
  | CommunityProfile 
  | AdminProfile;