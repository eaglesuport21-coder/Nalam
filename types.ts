
export interface Profile {
  id: string;
  name: string;
  age: number;
  height: string;
  religion: string;
  caste: string;
  location: string;
  district: string;
  taluk: string;
  pincode: string;
  education: string;
  occupation: string;
  image: string;
  about: string;
  gender: 'Male' | 'Female';
  password?: string;
  email?: string;
  isVerified?: boolean;
}

export interface SearchFilters {
  gender: string;
  minAge: number;
  maxAge: number;
  religion: string;
  pincode?: string;
  district?: string;
}

export type Language = 'en' | 'ta' | 'te' | 'ml' | 'hi';

export interface CompatibilityFactor {
  category: string;
  score: number;
  explanation: string;
}

export interface CompatibilityResult {
  overallScore: number;
  summary: string;
  factors: CompatibilityFactor[];
}
