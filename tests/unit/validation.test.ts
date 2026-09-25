import { describe, it, expect } from 'vitest';
import {
  advisoryRequestSchema,
  diseasePestRequestSchema,
  caseCreateSchema,
  farmCreateSchema,
  aiCropAdvisorySchema,
  aiDiseasePestSchema,
} from '../../apps/api/src/schemas/index.js';

describe('Validation Schemas (Zod)', () => {
  describe('advisoryRequestSchema', () => {
    it('should validate a complete and valid crop advisory request', () => {
      const validPayload = {
        cropName: 'Basmati Rice',
        growthStage: 'Tillering',
        variety: 'Pusa-1121',
        soilType: 'Clay Loam',
        soilPh: 6.8,
        irrigationType: 'Flood / Standing Water',
        sowingDate: '2026-06-15',
        symptoms: 'Slight leaf tip yellowing',
        question: 'Should I apply zinc sulfate?',
      };

      const result = advisoryRequestSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it('should reject when required fields are missing', () => {
      const invalidPayload = {
        variety: 'Pusa-1121',
        // cropName and growthStage are missing
      };

      const result = advisoryRequestSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorFields = result.error.errors.map((e) => e.path[0]);
        expect(errorFields).toContain('cropName');
        expect(errorFields).toContain('growthStage');
      }
    });

    it('should reject invalid soil pH values (< 0 or > 14)', () => {
      const invalidPhPayload = {
        cropName: 'Wheat',
        growthStage: 'Crown Root Initiation',
        soilPh: 15.5, // Invalid pH > 14
      };

      const result = advisoryRequestSchema.safeParse(invalidPhPayload);
      expect(result.success).toBe(false);
    });
  });

  describe('diseasePestRequestSchema', () => {
    it('should validate a proper disease and pest diagnosis request', () => {
      const validPayload = {
        cropName: 'Tomato',
        symptoms: 'Dark concentric target rings on lower foliage and yellow halos',
        affectedParts: ['Leaves', 'Stems'],
        durationDays: 4,
        location: 'Anand, Gujarat',
      };

      const result = diseasePestRequestSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it('should reject symptoms that are too short to perform diagnosis', () => {
      const invalidPayload = {
        cropName: 'Tomato',
        symptoms: 'bad', // < 5 characters
      };

      const result = diseasePestRequestSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });
  });

  describe('caseCreateSchema', () => {
    it('should accept valid support case submissions', () => {
      const validCase = {
        category: 'Pest Infestation',
        priority: 'HIGH' as const,
        description: 'Whitefly infestation is spreading rapidly on the western edge of the cotton field.',
      };

      const result = caseCreateSchema.safeParse(validCase);
      expect(result.success).toBe(true);
    });

    it('should reject case description under 10 characters', () => {
      const invalidCase = {
        category: 'Soil Health',
        description: 'help crop',
      };

      const result = caseCreateSchema.safeParse(invalidCase);
      expect(result.success).toBe(false);
    });
  });

  describe('farmCreateSchema', () => {
    it('should accept valid farm parameters', () => {
      const validFarm = {
        name: 'Sardar Vallabhbhai Farm',
        area: 12.5,
        area_unit: 'acre' as const,
        soil_type: 'Black Cotton Soil',
        soil_ph: 7.4,
      };

      const result = farmCreateSchema.safeParse(validFarm);
      expect(result.success).toBe(true);
    });

    it('should reject negative farm area', () => {
      const invalidFarm = {
        name: 'Test Farm',
        area: -5,
      };

      const result = farmCreateSchema.safeParse(invalidFarm);
      expect(result.success).toBe(false);
    });
  });

  describe('AI Output Schemas', () => {
    it('should validate a complete 13-field AI crop advisory response', () => {
      const validAIResponse = {
        summary: 'Healthy crop development at vegetative stage.',
        assessment: 'Moisture and nutrient levels are balanced.',
        riskLevel: 'LOW' as const,
        confidence: 0.92,
        immediateActions: ['Scout lower foliage for early sucking pests'],
        shortTermRecommendations: ['Apply second nitrogen split prior to flowering'],
        irrigationGuidance: ['Maintain 3-4 cm standing water depth'],
        nutrientConsiderations: ['Ensure zinc deficiency is addressed if soil test was low'],
        pestDiseaseConsiderations: ['Watch for brown planthopper under humid cloudy skies'],
        preventiveMeasures: ['Keep bunds clean of alternate weeds'],
        followUpQuestions: ['When was the last NPK application?'],
        professionalReviewRecommended: false,
        disclaimer: 'This advisory is generated with agricultural AI assistance.',
      };

      const result = aiCropAdvisorySchema.safeParse(validAIResponse);
      expect(result.success).toBe(true);
    });

    it('should reject AI crop advisory with invalid riskLevel', () => {
      const invalidAIResponse = {
        summary: 'Test summary',
        assessment: 'Test assessment',
        riskLevel: 'VERY_DANGEROUS', // Invalid enum
        confidence: 0.9,
        immediateActions: [],
        shortTermRecommendations: [],
        irrigationGuidance: [],
        nutrientConsiderations: [],
        pestDiseaseConsiderations: [],
        preventiveMeasures: [],
        followUpQuestions: [],
        professionalReviewRecommended: false,
        disclaimer: 'Disclaimer',
      };

      const result = aiCropAdvisorySchema.safeParse(invalidAIResponse);
      expect(result.success).toBe(false);
    });

    it('should validate pest & disease diagnosis AI schema', () => {
      const validDiagnostic = {
        possibleCauses: [
          {
            name: 'Alternaria Leaf Blight',
            reasoning: 'Concentric lesions with chlorotic halos match Alternaria symptomatology.',
            confidence: 0.81,
          },
        ],
        observations: ['Symptoms localized on lower leaf tier'],
        immediateActions: ['Prune and dispose of infected leaves away from field channels'],
        preventiveMeasures: ['Avoid evening overhead sprinkling'],
        additionalInformationNeeded: ['Clear close-up photograph of leaf underside'],
        professionalInspectionRecommended: true,
        disclaimer: 'Differential diagnosis is advisory and requires field verification.',
      };

      const result = aiDiseasePestSchema.safeParse(validDiagnostic);
      expect(result.success).toBe(true);
    });
  });
});
