

export type ProfessionalRole = string;

export interface Review {
  id: string;
  author: string;
  date: string;
  rating: number;
  text: string;
}

export interface Professional {
  id: string;
  fullName: string;
  role: ProfessionalRole;
  businessName: string;
  profileImage: string;
  businessLogo?: string;
  phone: string;
  email: string;
  fax?: string;
  address: string;
  bio: string;
  experienceYears: number;
  certifications: string[];
  services: string[];
  languages: string[];
  availability: string;
  emergencyAvailability: boolean;
  rating: number;
  reviewCount: number;
  socialLinks?: {
    linkedin?: string;
    website?: string;
  };
  reviews?: Review[];
}

export interface FamilyMember {
  id: string;
  fullName: string;
  relationship: string; // e.g. Brother, Friend, Executor
  profileImage: string;
  phone: string;
  email: string;
  address: string;
  bio: string;
  skills: string[]; // e.g. "Driving", "Cooking", "Childcare"
  availability: string;
}

export interface LegalTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: string;
  externalLink?: string;
}

export type PersonalTaskCategory = 'Personal' | 'Household' | 'Pet' | 'Admin';

export interface PersonalTask {
  id: string;
  title: string;
  assignee: string;
  category: PersonalTaskCategory;
  completed: boolean;
  date: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
  category: 'Essential' | 'Financial' | 'Personal';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  type: 'legal' | 'personal' | 'pet' | 'admin' | 'household';
  time?: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profileImage?: string; // Base64 string or URL
}

export type ViewId = 'dashboard' | 'directory' | 'users' | 'checklist' | 'tasks' | 'calendar' | 'documents' | 'ai-chat' | 'settings' | 'help';