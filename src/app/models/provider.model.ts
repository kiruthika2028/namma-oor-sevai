export type SkillType = 
  | 'Electrician' 
  | 'Plumber' 
  | 'Tailor' 
  | 'Tutor' 
  | 'Carpenter' 
  | 'Auto Driver' 
  | 'Mason' 
  | 'Painter' 
  | 'Appliance Repair' 
  | 'Other';

export type AvailabilityType = 'now' | 'today' | 'this_week';

export type ProviderStatus = 'pending' | 'approved' | 'rejected';

export interface Provider {
  id: string;
  name: string;
  photoUrl: string;
  phone: string;
  skill: SkillType;
  customSkill?: string;
  location: string;
  availability: AvailabilityType;
  isVisible?: boolean; // Firestore visibility flag: when false, hidden from public directory
  isAvailableRightNow?: boolean; // Backward compatibility
  experienceYears?: number;
  bio?: string;
  status: ProviderStatus;
  createdAt: string;
  approvedAt?: string;
  contactCount: number;
}

export interface Review {
  id: string;
  providerId: string;
  reviewerName: string;
  reviewerLocation?: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}

export interface OtpSession {
  id: string;
  phone: string;
  otp: string;
  createdAt: string;
  expiresAt: string;
}

export interface ProviderWithRating extends Provider {
  averageRating: number;
  totalReviews: number;
  latestReviews?: Review[];
}

export type AppLanguage = 'en' | 'ta';
