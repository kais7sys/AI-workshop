export type UserRole = 'FARMER' | 'OFFICER' | 'ADMIN';

export interface AuthUser {
  id: string;
  email?: string;
  role: UserRole;
  fullName: string;
}

export interface Profile {
  id: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  preferred_language?: string;
  state?: string;
  district?: string;
  taluka?: string;
  village?: string;
  farming_experience?: number;
  created_at: string;
  updated_at: string;
}

export interface Farm {
  id: string;
  owner_id: string;
  name: string;
  location_text?: string;
  state?: string;
  district?: string;
  taluka?: string;
  village?: string;
  area?: number;
  area_unit?: string;
  irrigation_type?: string;
  soil_type?: string;
  soil_ph?: number;
  created_at: string;
  updated_at: string;
  fields?: Field[];
}

export interface Field {
  id: string;
  farm_id: string;
  name: string;
  area?: number;
  soil_type?: string;
  soil_ph?: number;
  irrigation_type?: string;
  created_at: string;
  updated_at: string;
  crop_records?: CropRecord[];
}

export interface Crop {
  id: string;
  name: string;
  scientific_name?: string;
  category?: string;
  description?: string;
  growing_season?: string;
  soil_requirements?: Record<string, any>;
  water_requirements?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CropRecord {
  id: string;
  field_id: string;
  crop_id?: string;
  variety?: string;
  sowing_date?: string;
  expected_harvest_date?: string;
  growth_stage?: string;
  status: 'ACTIVE' | 'HARVESTED' | 'FAILED' | 'PLANNED';
  created_at: string;
  updated_at: string;
  crop?: Crop;
}

export interface Advisory {
  id: string;
  farmer_id: string;
  farm_id?: string;
  field_id?: string;
  crop_id?: string;
  question?: string;
  input_data: Record<string, any>;
  ai_response: CropAdvisoryResult;
  risk_level?: 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN';
  confidence?: number;
  model_name?: string;
  status: string;
  created_at: string;
}

export interface CropAdvisoryResult {
  summary: string;
  assessment: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN';
  confidence: number;
  immediateActions: string[];
  shortTermRecommendations: string[];
  irrigationGuidance: string[];
  nutrientConsiderations: string[];
  pestDiseaseConsiderations: string[];
  preventiveMeasures: string[];
  followUpQuestions: string[];
  professionalReviewRecommended: boolean;
  disclaimer: string;
}

export interface DiseasePestResult {
  possibleCauses: Array<{
    name: string;
    reasoning: string;
    confidence: number;
  }>;
  observations: string[];
  immediateActions: string[];
  preventiveMeasures: string[];
  additionalInformationNeeded: string[];
  professionalInspectionRecommended: boolean;
  disclaimer: string;
}

export interface ChatMessageResult {
  answer: string;
  keyPoints: string[];
  followUpQuestions: string[];
  professionalReviewRecommended: boolean;
}

export interface CaseSummaryResult {
  summary: string;
  issueCategory: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
  importantFacts: string[];
  missingInformation: string[];
  suggestedQuestions: string[];
}

export interface SupportCase {
  id: string;
  case_number: string;
  farmer_id: string;
  farm_id?: string;
  assigned_officer_id?: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  description: string;
  ai_summary?: string;
  officer_notes?: string;
  resolution?: string;
  status: 'OPEN' | 'ASSIGNED' | 'IN_REVIEW' | 'WAITING_FOR_FARMER' | 'RESOLVED' | 'CLOSED';
  created_at: string;
  updated_at: string;
  farmer?: Profile;
  assigned_officer?: Profile;
}

export interface Scheme {
  id: string;
  name: string;
  description: string;
  eligibility?: string;
  benefits?: string;
  required_documents?: string[];
  application_information?: string;
  department?: string;
  state?: string;
  official_source?: string;
  last_verified_at?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  state?: string;
  district?: string;
  crop_id?: string;
  starts_at?: string;
  ends_at?: string;
  is_published: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  read_at?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id?: string;
  action: string;
  entity_type?: string;
  entity_id?: string;
  metadata?: Record<string, any>;
  ip_hash?: string;
  created_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  metadata?: Record<string, any>;
  created_at: string;
}
