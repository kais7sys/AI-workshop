import { describe, it, expect } from 'vitest';
import {
  cleanJsonText,
  generateCropAdvisory,
  analyzeDiseaseAndPest,
  generateCaseSummary,
  generateChatTurn,
} from '../../apps/api/src/ai/gemini.js';
import {
  aiCropAdvisorySchema,
  aiDiseasePestSchema,
  aiCaseSummarySchema,
  aiChatMessageSchema,
} from '../../apps/api/src/schemas/index.js';

describe('AI Parsers & Agricultural Engine', () => {
  describe('cleanJsonText Utility', () => {
    it('should keep raw valid JSON unchanged', () => {
      const raw = '{"summary": "Field check ok"}';
      expect(cleanJsonText(raw)).toBe(raw);
    });

    it('should strip ```json and ``` markdown wrappers', () => {
      const wrapped = '```json\n{"riskLevel": "LOW"}\n```';
      expect(cleanJsonText(wrapped)).toBe('{"riskLevel": "LOW"}');
    });

    it('should strip generic ``` wrappers and trim spaces', () => {
      const wrapped = '   ```\n{"confidence": 0.9}\n```   ';
      expect(cleanJsonText(wrapped)).toBe('{"confidence": 0.9}');
    });
  });

  describe('Agronomic Advisory Engine (Fallback & Structure Verification)', () => {
    it('should generate a complete 13-field validated crop advisory', async () => {
      const advisory = await generateCropAdvisory({
        cropName: 'Cotton',
        variety: 'Bt Cotton RCH-2',
        growthStage: 'Square Formation',
        location: 'Rajkot, Gujarat',
        soilType: 'Medium Black',
        soilPh: 7.8,
        irrigationType: 'Drip',
        symptoms: 'Initial yellowing on lower leaves',
        question: 'What is the optimal fertigation schedule for this stage?',
      });

      // Validate against strict Zod schema
      const parseResult = aiCropAdvisorySchema.safeParse(advisory);
      expect(parseResult.success).toBe(true);

      // Verify specific mandatory fields
      expect(advisory.summary).toBeDefined();
      expect(advisory.assessment).toBeDefined();
      expect(['LOW', 'MEDIUM', 'HIGH', 'UNKNOWN']).toContain(advisory.riskLevel);
      expect(advisory.confidence).toBeGreaterThan(0);
      expect(advisory.confidence).toBeLessThanOrEqual(1);
      expect(advisory.immediateActions.length).toBeGreaterThan(0);
      expect(advisory.shortTermRecommendations.length).toBeGreaterThan(0);
      expect(advisory.irrigationGuidance.length).toBeGreaterThan(0);
      expect(advisory.nutrientConsiderations.length).toBeGreaterThan(0);
      expect(advisory.pestDiseaseConsiderations.length).toBeGreaterThan(0);
      expect(advisory.preventiveMeasures.length).toBeGreaterThan(0);
      expect(advisory.followUpQuestions.length).toBeGreaterThan(0);
      expect(typeof advisory.professionalReviewRecommended).toBe('boolean');
      expect(advisory.disclaimer).toContain('Agriculture');
    });
  });

  describe('Pest & Disease Diagnostic Engine', () => {
    it('should generate a differential diagnosis preserving uncertainty', async () => {
      const diagnosis = await analyzeDiseaseAndPest({
        cropName: 'Tomato',
        symptoms: 'Concentric dark rings with yellow halos on lower leaves',
        affectedParts: ['Leaves'],
        durationDays: 3,
        location: 'Pune',
      });

      const parseResult = aiDiseasePestSchema.safeParse(diagnosis);
      expect(parseResult.success).toBe(true);

      expect(diagnosis.possibleCauses.length).toBeGreaterThan(0);
      diagnosis.possibleCauses.forEach((cause) => {
        expect(cause.name).toBeDefined();
        expect(cause.reasoning).toBeDefined();
        expect(cause.confidence).toBeGreaterThan(0);
      });

      expect(diagnosis.observations.length).toBeGreaterThan(0);
      expect(diagnosis.immediateActions.length).toBeGreaterThan(0);
      expect(diagnosis.preventiveMeasures.length).toBeGreaterThan(0);
      expect(diagnosis.professionalInspectionRecommended).toBe(true);
      expect(diagnosis.disclaimer).toBeDefined();
    });
  });

  describe('Officer Case Summary Engine', () => {
    it('should generate an objective case summary with urgency and questions', async () => {
      const summary = await generateCaseSummary(
        'Severe pest attack observed across 3 acres of maize; leaves are shredded with boreholes.',
        'Pest Infestation',
        '3 Acres, Flood Irrigated'
      );

      const parseResult = aiCaseSummarySchema.safeParse(summary);
      expect(parseResult.success).toBe(true);

      expect(summary.summary).toBeDefined();
      expect(summary.issueCategory).toBe('Pest Infestation');
      expect(['LOW', 'MEDIUM', 'HIGH']).toContain(summary.urgency);
      expect(summary.importantFacts.length).toBeGreaterThan(0);
      expect(summary.missingInformation.length).toBeGreaterThan(0);
      expect(summary.suggestedQuestions.length).toBeGreaterThan(0);
    });
  });

  describe('Agricultural Conversational Chat Engine', () => {
    it('should generate contextual agricultural chat response', async () => {
      const chatResponse = await generateChatTurn(
        [],
        'What are the advantages of drip irrigation for sugarcane?'
      );

      const parseResult = aiChatMessageSchema.safeParse(chatResponse);
      expect(parseResult.success).toBe(true);

      expect(chatResponse.answer).toBeDefined();
      expect(chatResponse.keyPoints.length).toBeGreaterThan(0);
      expect(chatResponse.followUpQuestions.length).toBeGreaterThan(0);
      expect(typeof chatResponse.professionalReviewRecommended).toBe('boolean');
    });
  });
});
