export interface TrailSlide {
  id: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  description: string;
  bgImage: string;
  location: string;
  elevation: string;
  distance: string;
  duration: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Extreme';
  bestSeason: string;
  highlights: string[];
}

export interface Trail {
  id: string;
  name: string;
  region: string;
  country: string;
  elevationMax: string;
  elevationGain: string;
  distance: string;
  typicalDuration: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Extreme';
  rating: number;
  reviewsCount: number;
  image: string;
  summary: string;
  permitRequired: boolean;
  waterSources: string;
  bestMonths: string;
  checkpoints: { name: string; alt: string; distance: string }[];
}

export interface GearItem {
  id: string;
  name: string;
  category: 'Packs' | 'Footwear' | 'Apparel' | 'Hardware' | 'Camp & Sleep' | 'Navigation & Safety';
  price: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  specs: string[];
  description: string;
  inStock: boolean;
}

export interface CartItem {
  gear: GearItem;
  quantity: number;
  selectedOption?: string;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  trailName: string;
  rating: number;
  date: string;
  comment: string;
  likes: number;
  verifiedHiker: boolean;
  photos?: string[];
  tips?: string;
}

export interface ExpeditionPlan {
  id?: string;
  destination: string;
  travelDates: string;
  durationDays: number;
  groupSize: number;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  guideService: 'Self-Guided (GPS Track)' | 'Certified Lead Guide' | 'Full Expedition Team (Guide + Porters)';
  gearRental: string[];
  satelliteEmergencyBeacon: boolean;
  specialRequests?: string;
  estimatedCostPerPerson: number;
}

export interface AITrekResponse {
  trailName: string;
  tagline: string;
  difficulty: string;
  elevationGain: string;
  distance: string;
  bestMonths: string;
  itinerary: {
    day: number;
    title: string;
    distance: string;
    ascent: string;
    summary: string;
  }[];
  gearChecklist: string[];
  safetyTips: string[];
}

export type ReportStage = 'Submitted' | 'Verified' | 'Assigned' | 'In Progress' | 'Resolved';

export type IssueCategory =
  | 'Road Damage'
  | 'Streetlight'
  | 'Water Leakage'
  | 'Garbage / Waste'
  | 'Electricity'
  | 'Public Facility'
  | 'Traffic / Road Sign'
  | 'Other Problem';

export type IssuePriority = 'High Priority' | 'Medium Priority' | 'Normal Priority';

export interface CivicReport {
  id: string; // e.g. SS-1048
  title: string;
  category: IssueCategory;
  customCategoryNote?: string;
  location: string;
  ward: string;
  municipality: string;
  priority: IssuePriority;
  reportedAt: string;
  currentStage: ReportStage;
  expectedResolution: string;
  assignedDepartment: string;
  assignedOfficer?: string;
  description: string;
  additionalDescription?: string;
  photoUrl?: string;
  resolvedPhotoUrl?: string;
  citizenName?: string;
  citizenPhone?: string;
  currentUpdateText?: string;
  currentUpdateTimestamp?: string;
  citizenFeedback?: 'Yes' | 'No';
  feedbackSubmittedAt?: string;
  timeline: {
    stage: ReportStage;
    title: string;
    timestamp: string;
    completed: boolean;
    note: string;
    officer?: string;
  }[];
}
