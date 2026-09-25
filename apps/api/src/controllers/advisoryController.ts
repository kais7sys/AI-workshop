import { Request, Response } from 'express';
import { db } from '../repositories/db.js';
import { weatherService } from '../integrations/weather.js';
import { generateCropAdvisory, analyzeDiseaseAndPest } from '../ai/gemini.js';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';

export async function createAdvisory(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const {
    farmId,
    fieldId,
    cropId,
    cropName,
    variety,
    growthStage,
    location,
    soilType,
    soilPh,
    irrigationType,
    sowingDate,
    previousCrop,
    farmerObjective,
    symptoms,
    question,
    imageUrl,
  } = req.body;

  // Retrieve farm context if available
  let resolvedLocation = location;
  let resolvedSoilType = soilType;
  let resolvedSoilPh = soilPh;
  let resolvedIrrigation = irrigationType;

  if (farmId) {
    const farm = await db.getFarmById(farmId);
    if (farm) {
      resolvedLocation = resolvedLocation || `${farm.village || ''}, ${farm.district || ''}, ${farm.state || ''}`.replace(/^, |, $/g, '');
      resolvedSoilType = resolvedSoilType || farm.soil_type;
      resolvedSoilPh = resolvedSoilPh ?? farm.soil_ph;
      resolvedIrrigation = resolvedIrrigation || farm.irrigation_type;
    }
  }

  // Fetch real-time weather context
  const weather = await weatherService.getCurrentAndForecast(resolvedLocation || 'General Agricultural Zone');

  logger.info('Processing crop advisory request', {
    farmerId: userId,
    cropName,
    growthStage,
    location: resolvedLocation,
  });

  // Call Server-Side AI
  const aiResult = await generateCropAdvisory({
    cropName,
    variety,
    growthStage,
    location: resolvedLocation,
    soilType: resolvedSoilType,
    soilPh: resolvedSoilPh,
    irrigationType: resolvedIrrigation,
    sowingDate,
    previousCrop,
    farmerObjective,
    symptoms,
    question,
    weatherSummary: `${weather.forecastSummary} | Agronomic notice: ${weather.agronomicImplications.join('; ')}`,
  });

  // Store in Database
  const advisory = await db.createAdvisory({
    farmer_id: userId,
    farm_id: farmId,
    field_id: fieldId,
    crop_id: cropId,
    question,
    input_data: {
      cropName,
      variety,
      growthStage,
      location: resolvedLocation,
      soilType: resolvedSoilType,
      soilPh: resolvedSoilPh,
      irrigationType: resolvedIrrigation,
      symptoms,
      weather,
    },
    ai_response: aiResult,
    risk_level: aiResult.riskLevel,
    confidence: aiResult.confidence,
    model_name: config.gemini.model,
    status: 'COMPLETED',
  });

  // Dispatch In-App Notification
  await db.createNotification({
    user_id: userId,
    title: `Advisory Ready: ${cropName}`,
    message: `Your AI advisory for ${cropName} (${growthStage}) is now available. Risk level: ${aiResult.riskLevel}.`,
    type: 'ADVISORY',
  });

  // Create Audit Log
  await db.createAuditLog({
    actor_id: userId,
    action: 'CREATE_ADVISORY',
    entity_type: 'advisory',
    entity_id: advisory.id,
    metadata: { crop: cropName, riskLevel: aiResult.riskLevel },
  });

  res.status(201).json(advisory);
}

export async function listAdvisories(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (req.user?.role === 'OFFICER' || req.user?.role === 'ADMIN') {
    const all = await db.listAllAdvisories();
    res.json(all);
    return;
  }

  const advisories = await db.listAdvisoriesByFarmer(userId);
  res.json(advisories);
}

export async function getAdvisoryById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const advisory = await db.getAdvisoryById(id);

  if (!advisory) {
    res.status(404).json({ error: 'Advisory not found' });
    return;
  }

  // RLS check
  if (req.user?.role === 'FARMER' && advisory.farmer_id !== req.user.id) {
    res.status(403).json({ error: 'Forbidden: You cannot access this advisory.' });
    return;
  }

  res.json(advisory);
}

export async function analyzeDisease(req: Request, res: Response): Promise<void> {
  const { cropName, symptoms, affectedParts, durationDays, location, imageBase64 } = req.body;

  logger.info('Analyzing disease/pest symptoms', { cropName, symptomsLength: symptoms.length });

  const result = await analyzeDiseaseAndPest({
    cropName,
    symptoms,
    affectedParts,
    durationDays,
    location,
    imageBase64,
  });

  if (req.user?.id) {
    await db.createAuditLog({
      actor_id: req.user.id,
      action: 'ANALYZE_DISEASE',
      entity_type: 'disease_analysis',
      metadata: { crop: cropName },
    });
  }

  res.json(result);
}
