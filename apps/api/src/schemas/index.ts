import { z } from 'zod';

// -----------------------------------------------------------------------------
// Authentication & Profile Schemas
// -----------------------------------------------------------------------------
export const profileUpdateSchema = z.object({
  full_name: z.string().min(2).max(150).optional(),
  phone: z.string().max(20).optional(),
  preferred_language: z.string().max(10).optional(),
  state: z.string().max(100).optional(),
  district: z.string().max(100).optional(),
  taluka: z.string().max(100).optional(),
  village: z.string().max(100).optional(),
  farming_experience: z.number().int().min(0).max(100).optional(),
});

// -----------------------------------------------------------------------------
// Farm & Field Schemas
// -----------------------------------------------------------------------------
export const farmCreateSchema = z.object({
  name: z.string().min(1, 'Farm name is required').max(150),
  location_text: z.string().max(255).optional(),
  state: z.string().max(100).optional(),
  district: z.string().max(100).optional(),
  taluka: z.string().max(100).optional(),
  village: z.string().max(100).optional(),
  area: z.number().positive('Area must be a positive number').optional(),
  area_unit: z.enum(['acre', 'hectare', 'bigha', 'guntha']).default('acre'),
  irrigation_type: z.string().max(100).optional(),
  soil_type: z.string().max(100).optional(),
  soil_ph: z.number().min(0).max(14).optional(),
});

export const farmUpdateSchema = farmCreateSchema.partial();

export const fieldCreateSchema = z.object({
  name: z.string().min(1, 'Field name is required').max(150),
  area: z.number().positive().optional(),
  soil_type: z.string().max(100).optional(),
  soil_ph: z.number().min(0).max(14).optional(),
  irrigation_type: z.string().max(100).optional(),
});

export const fieldUpdateSchema = fieldCreateSchema.partial();

// -----------------------------------------------------------------------------
// Crop Schemas
// -----------------------------------------------------------------------------
export const cropCreateSchema = z.object({
  name: z.string().min(1, 'Crop name is required').max(100),
  scientific_name: z.string().max(150).optional(),
  category: z.string().max(100).optional(),
  description: z.string().max(2000).optional(),
  growing_season: z.string().max(100).optional(),
  soil_requirements: z.record(z.any()).optional(),
  water_requirements: z.record(z.any()).optional(),
});

export const cropUpdateSchema = cropCreateSchema.partial();

export const cropRecordCreateSchema = z.object({
  field_id: z.string().uuid(),
  crop_id: z.string().uuid().optional(),
  variety: z.string().max(150).optional(),
  sowing_date: z.string().optional(),
  expected_harvest_date: z.string().optional(),
  growth_stage: z.string().max(100).optional(),
  status: z.enum(['ACTIVE', 'HARVESTED', 'FAILED', 'PLANNED']).default('ACTIVE'),
});

// -----------------------------------------------------------------------------
// Advisory & Disease Request Schemas
// -----------------------------------------------------------------------------
export const advisoryRequestSchema = z.object({
  farmId: z.string().uuid().optional(),
  fieldId: z.string().uuid().optional(),
  cropId: z.string().uuid().optional(),
  cropName: z.string().min(1, 'Crop name or selection is required').max(100),
  variety: z.string().max(150).optional(),
  growthStage: z.string().min(1, 'Growth stage is required').max(100),
  location: z.string().max(200).optional(),
  soilType: z.string().max(100).optional(),
  soilPh: z.number().min(0).max(14).optional(),
  irrigationType: z.string().max(100).optional(),
  sowingDate: z.string().optional(),
  previousCrop: z.string().max(100).optional(),
  farmerObjective: z.string().max(500).optional(),
  symptoms: z.string().max(3000).optional(),
  question: z.string().max(3000).optional(),
  imageUrl: z.string().url().optional(),
  imageBase64: z.string().optional(),
});

export const diseasePestRequestSchema = z.object({
  cropName: z.string().min(1, 'Crop name is required').max(100),
  symptoms: z.string().min(5, 'Please provide detailed symptom description').max(4000),
  affectedParts: z.array(z.string()).optional(),
  durationDays: z.number().int().min(0).optional(),
  spreadPattern: z.string().max(200).optional(),
  location: z.string().max(200).optional(),
  imageUrl: z.string().url().optional(),
  imageBase64: z.string().optional(),
});

// -----------------------------------------------------------------------------
// Support Cases Schemas
// -----------------------------------------------------------------------------
export const caseCreateSchema = z.object({
  farm_id: z.string().uuid().optional(),
  category: z.string().min(1, 'Category is required').max(100),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(4000),
});

export const caseUpdateSchema = z.object({
  assigned_officer_id: z.string().uuid().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  officer_notes: z.string().max(4000).optional(),
  resolution: z.string().max(4000).optional(),
  status: z.enum(['OPEN', 'ASSIGNED', 'IN_REVIEW', 'WAITING_FOR_FARMER', 'RESOLVED', 'CLOSED']).optional(),
});

// -----------------------------------------------------------------------------
// Government Scheme Schemas
// -----------------------------------------------------------------------------
export const schemeCreateSchema = z.object({
  name: z.string().min(3, 'Scheme name is required').max(200),
  description: z.string().min(10, 'Description is required').max(4000),
  eligibility: z.string().max(2000).optional(),
  benefits: z.string().max(2000).optional(),
  required_documents: z.array(z.string()).default([]),
  application_information: z.string().max(2000).optional(),
  department: z.string().max(200).optional(),
  state: z.string().max(100).optional(),
  official_source: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  is_active: z.boolean().default(true),
});

export const schemeUpdateSchema = schemeCreateSchema.partial();

// -----------------------------------------------------------------------------
// Agricultural Alert Schemas
// -----------------------------------------------------------------------------
export const alertCreateSchema = z.object({
  title: z.string().min(3, 'Alert title is required').max(200),
  description: z.string().min(10, 'Alert description is required').max(4000),
  category: z.string().max(100),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  state: z.string().max(100).optional(),
  district: z.string().max(100).optional(),
  crop_id: z.string().uuid().optional(),
  starts_at: z.string().optional(),
  ends_at: z.string().optional(),
  is_published: z.boolean().default(false),
});

export const alertUpdateSchema = alertCreateSchema.partial();

// -----------------------------------------------------------------------------
// Chat Schemas
// -----------------------------------------------------------------------------
export const chatSessionCreateSchema = z.object({
  title: z.string().max(200).optional(),
});

export const chatMessageCreateSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').max(3000),
  farmId: z.string().uuid().optional(),
  cropName: z.string().max(100).optional(),
});

// -----------------------------------------------------------------------------
// AI OUTPUT SCHEMAS (Validated server-side on every LLM generation)
// -----------------------------------------------------------------------------
export const aiCropAdvisorySchema = z.object({
  summary: z.string(),
  assessment: z.string(),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'UNKNOWN']),
  confidence: z.number().min(0).max(1),
  immediateActions: z.array(z.string()),
  shortTermRecommendations: z.array(z.string()),
  irrigationGuidance: z.array(z.string()),
  nutrientConsiderations: z.array(z.string()),
  pestDiseaseConsiderations: z.array(z.string()),
  preventiveMeasures: z.array(z.string()),
  followUpQuestions: z.array(z.string()),
  professionalReviewRecommended: z.boolean(),
  disclaimer: z.string(),
});

export const aiDiseasePestSchema = z.object({
  possibleCauses: z.array(
    z.object({
      name: z.string(),
      reasoning: z.string(),
      confidence: z.number().min(0).max(1),
    })
  ),
  observations: z.array(z.string()),
  immediateActions: z.array(z.string()),
  preventiveMeasures: z.array(z.string()),
  additionalInformationNeeded: z.array(z.string()),
  professionalInspectionRecommended: z.boolean(),
  disclaimer: z.string(),
});

export const aiChatMessageSchema = z.object({
  answer: z.string(),
  keyPoints: z.array(z.string()),
  followUpQuestions: z.array(z.string()),
  professionalReviewRecommended: z.boolean(),
});

export const aiCaseSummarySchema = z.object({
  summary: z.string(),
  issueCategory: z.string(),
  urgency: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  importantFacts: z.array(z.string()),
  missingInformation: z.array(z.string()),
  suggestedQuestions: z.array(z.string()),
});
