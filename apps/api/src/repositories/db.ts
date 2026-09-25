import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';
import {
  Profile,
  Farm,
  Field,
  Crop,
  CropRecord,
  Advisory,
  SupportCase,
  Scheme,
  Alert,
  Notification,
  AuditLog,
  ChatSession,
  ChatMessage,
} from '../types/index.js';

// Pre-seeded Initial In-Memory State
const defaultProfiles: Profile[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    full_name: 'Ramesh Kumar',
    phone: '+91 98765 43210',
    role: 'FARMER',
    preferred_language: 'en',
    state: 'Punjab',
    district: 'Ludhiana',
    taluka: 'Jagraon',
    village: 'Sidwan Bet',
    farming_experience: 15,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    full_name: 'Dr. Ananya Sharma',
    phone: '+91 98765 88990',
    role: 'OFFICER',
    preferred_language: 'en',
    state: 'Punjab',
    district: 'Ludhiana',
    taluka: 'Ludhiana East',
    village: 'District Center',
    farming_experience: 12,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    full_name: 'Vikram Patel',
    phone: '+91 98765 11223',
    role: 'ADMIN',
    preferred_language: 'en',
    state: 'Central Headquarters',
    district: 'New Delhi',
    taluka: 'HQ',
    village: 'HQ',
    farming_experience: 20,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const defaultCrops: Crop[] = [
  {
    id: '11111111-1111-1111-1111-111111110001',
    name: 'Wheat',
    scientific_name: 'Triticum aestivum',
    category: 'Cereal',
    description: 'Staple rabi cereal crop requiring cool winter climate and moderate irrigation.',
    growing_season: 'Rabi (Oct - Apr)',
    soil_requirements: { optimal_ph: '6.0 - 7.5', type: 'Loam to Clay Loam', drainage: 'Well drained' },
    water_requirements: { annual_water_mm: '450 - 650', critical_stages: ['CRI stage', 'Tillering', 'Flowering', 'Milking'] },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '11111111-1111-1111-1111-111111110002',
    name: 'Basmati Rice',
    scientific_name: 'Oryza sativa',
    category: 'Cereal',
    description: 'Aromatic long-grain kharif paddy requiring standing water during vegetative phases.',
    growing_season: 'Kharif (Jun - Nov)',
    soil_requirements: { optimal_ph: '5.5 - 7.0', type: 'Clayey Loam / Silt Loam', drainage: 'Water retentive' },
    water_requirements: { annual_water_mm: '1100 - 1500', critical_stages: ['Transplanting', 'Tillering', 'Panicle Initiation'] },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '11111111-1111-1111-1111-111111110003',
    name: 'Cotton',
    scientific_name: 'Gossypium hirsutum',
    category: 'Fiber / Cash Crop',
    description: 'High-value cash crop sensitive to waterlogging and bollworm infestations.',
    growing_season: 'Kharif (May - Nov)',
    soil_requirements: { optimal_ph: '6.0 - 8.0', type: 'Deep Black Soils (Regur)', drainage: 'High moisture retention' },
    water_requirements: { annual_water_mm: '700 - 1000', critical_stages: ['Square formation', 'Flowering', 'Boll development'] },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '11111111-1111-1111-1111-111111110004',
    name: 'Tomato',
    scientific_name: 'Solanum lycopersicum',
    category: 'Vegetable / Horticulture',
    description: 'Fast-growing warm-season horticultural crop susceptible to fungal leaf spots and blight.',
    growing_season: 'Year-round (Kharif / Rabi)',
    soil_requirements: { optimal_ph: '6.0 - 6.8', type: 'Sandy Loam with organic matter', drainage: 'Excellent drainage' },
    water_requirements: { annual_water_mm: '400 - 600', critical_stages: ['Vegetative', 'Fruit set', 'Fruit enlargement'] },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '11111111-1111-1111-1111-111111110005',
    name: 'Mustard',
    scientific_name: 'Brassica juncea',
    category: 'Oilseed',
    description: 'Major rabi oilseed requiring low to moderate moisture and responsive to sulfur fertilization.',
    growing_season: 'Rabi (Oct - Mar)',
    soil_requirements: { optimal_ph: '6.5 - 7.5', type: 'Sandy Loam to Loam', drainage: 'Well drained' },
    water_requirements: { annual_water_mm: '250 - 400', critical_stages: ['Pre-flowering', 'Pod filling'] },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '11111111-1111-1111-1111-111111110006',
    name: 'Maize',
    scientific_name: 'Zea mays',
    category: 'Cereal / Feed',
    description: 'Versatile grain crop sensitive to both drought and standing waterlogging.',
    growing_season: 'Kharif / Spring',
    soil_requirements: { optimal_ph: '6.0 - 7.5', type: 'Well-aerated fertile loamy soil', drainage: 'High drainage' },
    water_requirements: { annual_water_mm: '500 - 800', critical_stages: ['Tasseling', 'Silking', 'Grain filling'] },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const defaultFarms: Farm[] = [
  {
    id: '44444444-4444-4444-4444-444444440001',
    owner_id: '00000000-0000-0000-0000-000000000001',
    name: 'Green Valley Organic Farm',
    location_text: 'Plot 42, Canal Road, Sidwan Bet',
    state: 'Punjab',
    district: 'Ludhiana',
    taluka: 'Jagraon',
    village: 'Sidwan Bet',
    area: 12.5,
    area_unit: 'acre',
    irrigation_type: 'Tube well & Drip System',
    soil_type: 'Alluvial Loam',
    soil_ph: 6.8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const defaultFields: Field[] = [
  {
    id: '55555555-5555-5555-5555-555555550001',
    farm_id: '44444444-4444-4444-4444-444444440001',
    name: 'North Wheat Field',
    area: 7.0,
    soil_type: 'Alluvial Loam',
    soil_ph: 6.8,
    irrigation_type: 'Tube well',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '55555555-5555-5555-5555-555555550002',
    farm_id: '44444444-4444-4444-4444-444444440001',
    name: 'South Vegetable & Tomato Plot',
    area: 5.5,
    soil_type: 'Sandy Loam',
    soil_ph: 6.5,
    irrigation_type: 'Drip System',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const defaultCropRecords: CropRecord[] = [
  {
    id: '66666666-6666-6666-6666-666666660001',
    field_id: '55555555-5555-5555-5555-555555550001',
    crop_id: '11111111-1111-1111-1111-111111110001',
    variety: 'HD-3086 (Pusa Gautami)',
    sowing_date: '2026-11-10',
    expected_harvest_date: '2027-04-15',
    growth_stage: 'Flowering & Milking',
    status: 'ACTIVE',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const defaultSchemes: Scheme[] = [
  {
    id: '22222222-2222-2222-2222-222222220001',
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    description: 'Income support initiative by the Government of India providing financial assistance to all landholding farmer families across the country.',
    eligibility: 'All landholder farmer families with cultivable land in their names, subject to standard official exclusion criteria.',
    benefits: 'Direct benefit transfer of Rs. 6,000 per year paid in three equal 4-monthly installments of Rs. 2,000 directly into authenticated bank accounts.',
    required_documents: ['Aadhaar Card', 'Land ownership records (Khasra/Khatauni)', 'Bank Account Passbook with IFSC', 'Valid Mobile Number'],
    application_information: 'Farmers can register through the PM-KISAN online portal (pmkisan.gov.in), Common Service Centres (CSCs), or via the local District Agriculture Office.',
    department: 'Ministry of Agriculture & Farmers Welfare',
    state: 'All India',
    official_source: 'https://pmkisan.gov.in',
    last_verified_at: new Date().toISOString(),
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222220002',
    name: 'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
    description: 'Comprehensive risk insurance scheme providing financial support and claim compensation to farmers suffering crop loss or damage arising out of unforeseen weather events.',
    eligibility: 'All farmers growing notified crops in notified areas including sharecroppers and tenant farmers.',
    benefits: 'Very low premium payable by farmer: 2% for Kharif crops, 1.5% for Rabi food and oilseeds, 5% for annual commercial/horticultural crops. Balance subsidized by Central and State Governments.',
    required_documents: ['Land possession certificate', 'Sowing certificate issued by Patwari/Revenue officer', 'Bank Passbook', 'Aadhaar Card'],
    application_information: 'Enrollment via national crop insurance portal (pmfby.gov.in), authorized banks, or registered cooperative societies within cut-off deadlines.',
    department: 'Department of Agriculture and Cooperation',
    state: 'All India',
    official_source: 'https://pmfby.gov.in',
    last_verified_at: new Date().toISOString(),
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222220003',
    name: 'Soil Health Card Scheme',
    description: 'Government program promoting balanced crop nutrient management and customized fertilizer recommendations based on scientific soil testing.',
    eligibility: 'All farmers owning or managing agricultural land.',
    benefits: 'Free-of-cost periodic soil testing assessing 12 major parameters (N, P, K, S, Zn, Fe, Cu, Mn, Bo, pH, EC, OC) with tailored crop advisory.',
    required_documents: ['Farmer identification proof', 'Land plot survey number'],
    application_information: 'Soil samples are collected by Agriculture Department field staff or farmers can deposit samples at local Soil Testing Laboratories (STLs).',
    department: 'Department of Agriculture & Farmers Welfare',
    state: 'All India',
    official_source: 'https://soilhealth.dac.gov.in',
    last_verified_at: new Date().toISOString(),
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222220004',
    name: 'PMKSY - Per Drop More Crop (Micro Irrigation)',
    description: 'Scheme dedicated to enhancing water use efficiency at farm level through micro-irrigation systems such as drip and sprinkler irrigation.',
    eligibility: 'Small and marginal farmers, individual landowners, members of farmer producer organizations (FPOs).',
    benefits: 'Subsidies up to 55% for small & marginal farmers and up to 45% for other farmers on capital cost of installing drip and sprinkler systems.',
    required_documents: ['Land ownership records', 'Water source verification certificate', 'Aadhaar Card', 'Bank Account Details', 'Electricity connection proof'],
    application_information: 'Submit application via the State Horticulture/Agriculture portal or directly at the District Horticulture Officer (DHO) office.',
    department: 'Department of Agriculture & Farmers Welfare',
    state: 'All India',
    official_source: 'https://pmksy.gov.in',
    last_verified_at: new Date().toISOString(),
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const defaultAlerts: Alert[] = [
  {
    id: '33333333-3333-3333-3333-333333330001',
    title: 'Heatwave & Evapotranspiration Surge Alert',
    description: 'Daytime temperatures expected to exceed 42°C over the next 4 days. Farmers are advised to provide light and frequent evening irrigation to standing crops to prevent heat stress and premature drying.',
    category: 'WEATHER',
    severity: 'HIGH',
    state: 'Punjab',
    district: 'Ludhiana',
    crop_id: '11111111-1111-1111-1111-111111110001',
    starts_at: new Date(Date.now() - 86400000).toISOString(),
    ends_at: new Date(Date.now() + 432000000).toISOString(),
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '33333333-3333-3333-3333-333333330002',
    title: 'Yellow Rust Surveillance Advisory in Wheat',
    description: 'Isolated incidents of stripe (yellow) rust observed in sub-mountainous blocks. Inspect wheat leaves for yellow powdery stripes along leaf veins. Report suspected outbreaks immediately to your Agriculture Officer.',
    category: 'PEST_DISEASE',
    severity: 'MEDIUM',
    state: 'Punjab',
    district: 'All Districts',
    crop_id: '11111111-1111-1111-1111-111111110001',
    starts_at: new Date(Date.now() - 172800000).toISOString(),
    ends_at: new Date(Date.now() + 864000000).toISOString(),
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '33333333-3333-3333-3333-333333330003',
    title: 'Tomato Early Blight Preventive Spray Alert',
    description: 'Continuous cloudy conditions and high morning relative humidity (>85%) are conducive to fungal leaf spot and early blight in tomato fields. Avoid overhead sprinkler irrigation during morning hours.',
    category: 'PEST_DISEASE',
    severity: 'MEDIUM',
    state: 'All States',
    crop_id: '11111111-1111-1111-1111-111111110004',
    starts_at: new Date().toISOString(),
    ends_at: new Date(Date.now() + 604800000).toISOString(),
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const defaultCases: SupportCase[] = [
  {
    id: '77777777-7777-7777-7777-777777770001',
    case_number: 'CASE-2026-001',
    farmer_id: '00000000-0000-0000-0000-000000000001',
    farm_id: '44444444-4444-4444-4444-444444440001',
    assigned_officer_id: '00000000-0000-0000-0000-000000000002',
    category: 'Crop Pathology',
    priority: 'HIGH',
    description: 'Suspected fungal infection on lower leaves of tomato plants. Dark concentric rings appearing rapidly.',
    ai_summary: 'Farmer reports dark concentric rings on tomato foliage, characteristic of Alternaria solani (Early Blight). Spread rate is high. Recommended field inspection and immediate removal of infected lower leaves.',
    officer_notes: 'Inspected photos. Matches Early Blight pattern. Advised copper-based bio-fungicide and strict avoidance of overhead irrigation.',
    resolution: 'Verified by Dr. Sharma. Organic foliar spray protocol prescribed.',
    status: 'IN_REVIEW',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const defaultAdvisories: Advisory[] = [
  {
    id: '88888888-8888-8888-8888-888888880001',
    farmer_id: '00000000-0000-0000-0000-000000000001',
    farm_id: '44444444-4444-4444-4444-444444440001',
    field_id: '55555555-5555-5555-5555-555555550001',
    crop_id: '11111111-1111-1111-1111-111111110001',
    question: 'How to optimize grain filling during sudden temperature spike?',
    input_data: {
      crop: 'Wheat',
      growthStage: 'Milking / Grain filling',
      soilPh: 6.8,
      weather: 'Heatwave warning 41°C',
    },
    ai_response: {
      summary: 'Grain filling stage wheat requires protection from terminal heat stress.',
      assessment: 'High ambient temperature (>38°C) accelerates senescence and reduces grain weight if water stress occurs.',
      riskLevel: 'MEDIUM',
      confidence: 0.92,
      immediateActions: [
        'Apply light irrigation during late afternoon or evening hours.',
        'Avoid irrigating during windy conditions to prevent lodging.',
      ],
      shortTermRecommendations: [
        'Foliar spray of 0.5% Potassium Chloride (KCl) can help plants cope with terminal heat.',
        'Monitor canopy temperature and soil moisture levels daily.',
      ],
      irrigationGuidance: [
        'Keep root zone moist but avoid standing water.',
        'Prefer sprinkler or micro-drip if available.',
      ],
      nutrientConsiderations: [
        'Avoid excess nitrogen application at this late stage.',
        'Potassium spray enhances cellular osmotic regulation.',
      ],
      pestDiseaseConsiderations: [
        'Inspect for late aphid colonies on wheat ears.',
      ],
      preventiveMeasures: [
        'For future seasons, consider planting early-maturing or heat-tolerant certified seed varieties.',
      ],
      followUpQuestions: [
        'What is your current soil moisture reading?',
        'Have you noticed any premature leaf yellowing?',
      ],
      professionalReviewRecommended: false,
      disclaimer: 'Advisory generated with AI assistance. Always cross-verify chemical spray rates with local agriculture department guidelines.',
    },
    risk_level: 'MEDIUM',
    confidence: 0.92,
    model_name: 'gemini-3.8-flash',
    status: 'COMPLETED',
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
];

const defaultNotifications: Notification[] = [
  {
    id: '99999999-9999-9999-9999-999999990001',
    user_id: '00000000-0000-0000-0000-000000000001',
    title: 'Advisory Completed',
    message: 'Your AI Crop Advisory for Wheat (Grain Filling Stage) is ready for review.',
    type: 'ADVISORY',
    read_at: new Date().toISOString(),
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '99999999-9999-9999-9999-999999990002',
    user_id: '00000000-0000-0000-0000-000000000001',
    title: 'Weather Warning',
    message: 'Heatwave alert in Ludhiana district. Review preventive irrigation recommendations.',
    type: 'ALERT',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

// Unified Repository Database Abstraction
class DatabaseRepository {
  private supabase: SupabaseClient | null = null;

  // In-Memory Storage Tables
  public profiles: Profile[] = [...defaultProfiles];
  public farms: Farm[] = [...defaultFarms];
  public fields: Field[] = [...defaultFields];
  public crops: Crop[] = [...defaultCrops];
  public cropRecords: CropRecord[] = [...defaultCropRecords];
  public advisories: Advisory[] = [...defaultAdvisories];
  public cases: SupportCase[] = [...defaultCases];
  public schemes: Scheme[] = [...defaultSchemes];
  public alerts: Alert[] = [...defaultAlerts];
  public notifications: Notification[] = [...defaultNotifications];
  public auditLogs: AuditLog[] = [];
  public chatSessions: ChatSession[] = [];
  public chatMessages: ChatMessage[] = [];

  constructor() {
    if (config.supabase.url && config.supabase.serviceRoleKey) {
      try {
        this.supabase = createClient(config.supabase.url, config.supabase.serviceRoleKey);
        logger.info('Supabase client initialized with Service Role Key');
      } catch (err) {
        logger.warn('Could not initialize Supabase client, defaulting to local in-memory store', { error: err });
      }
    } else {
      logger.info('Running in standalone mode with pre-seeded in-memory database store');
    }
  }

  public isSupabaseConnected(): boolean {
    return this.supabase !== null;
  }

  // ---------------------------------------------------------------------------
  // Profiles
  // ---------------------------------------------------------------------------
  public async getProfileById(id: string): Promise<Profile | null> {
    const found = this.profiles.find((p) => p.id === id);
    return found || null;
  }

  public async updateProfile(id: string, updates: Partial<Profile>): Promise<Profile> {
    const index = this.profiles.findIndex((p) => p.id === id);
    if (index === -1) {
      const newProfile: Profile = {
        id,
        full_name: updates.full_name || 'Farmer User',
        role: updates.role || 'FARMER',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...updates,
      };
      this.profiles.push(newProfile);
      return newProfile;
    }
    this.profiles[index] = {
      ...this.profiles[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return this.profiles[index];
  }

  public async listProfiles(role?: string): Promise<Profile[]> {
    if (role) {
      return this.profiles.filter((p) => p.role === role);
    }
    return this.profiles;
  }

  // ---------------------------------------------------------------------------
  // Farms & Fields
  // ---------------------------------------------------------------------------
  public async listFarmsByOwner(ownerId: string): Promise<Farm[]> {
    const ownerFarms = this.farms.filter((f) => f.owner_id === ownerId);
    return ownerFarms.map((f) => ({
      ...f,
      fields: this.fields.filter((field) => field.farm_id === f.id),
    }));
  }

  public async getFarmById(id: string): Promise<Farm | null> {
    const farm = this.farms.find((f) => f.id === id);
    if (!farm) return null;
    return {
      ...farm,
      fields: this.fields.filter((field) => field.farm_id === farm.id),
    };
  }

  public async createFarm(data: Omit<Farm, 'id' | 'created_at' | 'updated_at'>): Promise<Farm> {
    const newFarm: Farm = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.farms.push(newFarm);
    return newFarm;
  }

  public async updateFarm(id: string, updates: Partial<Farm>): Promise<Farm | null> {
    const index = this.farms.findIndex((f) => f.id === id);
    if (index === -1) return null;
    this.farms[index] = {
      ...this.farms[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return this.farms[index];
  }

  public async deleteFarm(id: string): Promise<boolean> {
    const beforeCount = this.farms.length;
    this.farms = this.farms.filter((f) => f.id !== id);
    this.fields = this.fields.filter((field) => field.farm_id !== id);
    return this.farms.length < beforeCount;
  }

  public async listFieldsByFarm(farmId: string): Promise<Field[]> {
    return this.fields.filter((f) => f.farm_id === farmId);
  }

  public async createField(data: Omit<Field, 'id' | 'created_at' | 'updated_at'>): Promise<Field> {
    const newField: Field = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.fields.push(newField);
    return newField;
  }

  public async updateField(id: string, updates: Partial<Field>): Promise<Field | null> {
    const index = this.fields.findIndex((f) => f.id === id);
    if (index === -1) return null;
    this.fields[index] = {
      ...this.fields[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return this.fields[index];
  }

  public async deleteField(id: string): Promise<boolean> {
    const before = this.fields.length;
    this.fields = this.fields.filter((f) => f.id !== id);
    return this.fields.length < before;
  }

  // ---------------------------------------------------------------------------
  // Crops Catalog
  // ---------------------------------------------------------------------------
  public async listCrops(): Promise<Crop[]> {
    return this.crops;
  }

  public async getCropById(id: string): Promise<Crop | null> {
    return this.crops.find((c) => c.id === id) || null;
  }

  public async createCrop(data: Omit<Crop, 'id' | 'created_at' | 'updated_at'>): Promise<Crop> {
    const newCrop: Crop = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.crops.push(newCrop);
    return newCrop;
  }

  public async updateCrop(id: string, updates: Partial<Crop>): Promise<Crop | null> {
    const index = this.crops.findIndex((c) => c.id === id);
    if (index === -1) return null;
    this.crops[index] = {
      ...this.crops[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return this.crops[index];
  }

  public async deleteCrop(id: string): Promise<boolean> {
    const before = this.crops.length;
    this.crops = this.crops.filter((c) => c.id !== id);
    return this.crops.length < before;
  }

  // ---------------------------------------------------------------------------
  // Advisories
  // ---------------------------------------------------------------------------
  public async createAdvisory(data: Omit<Advisory, 'id' | 'created_at'>): Promise<Advisory> {
    const newAdv: Advisory = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };
    this.advisories.unshift(newAdv);
    return newAdv;
  }

  public async listAdvisoriesByFarmer(farmerId: string): Promise<Advisory[]> {
    return this.advisories.filter((a) => a.farmer_id === farmerId);
  }

  public async listAllAdvisories(): Promise<Advisory[]> {
    return this.advisories;
  }

  public async getAdvisoryById(id: string): Promise<Advisory | null> {
    return this.advisories.find((a) => a.id === id) || null;
  }

  // ---------------------------------------------------------------------------
  // Support Cases
  // ---------------------------------------------------------------------------
  public async listCases(filter?: { farmerId?: string; officerId?: string; status?: string }): Promise<SupportCase[]> {
    let result = [...this.cases];
    if (filter?.farmerId) {
      result = result.filter((c) => c.farmer_id === filter.farmerId);
    }
    if (filter?.officerId) {
      result = result.filter((c) => c.assigned_officer_id === filter.officerId);
    }
    if (filter?.status) {
      result = result.filter((c) => c.status === filter.status);
    }
    return result.map((c) => ({
      ...c,
      farmer: this.profiles.find((p) => p.id === c.farmer_id),
      assigned_officer: this.profiles.find((p) => p.id === c.assigned_officer_id),
    }));
  }

  public async getCaseById(id: string): Promise<SupportCase | null> {
    const c = this.cases.find((item) => item.id === id);
    if (!c) return null;
    return {
      ...c,
      farmer: this.profiles.find((p) => p.id === c.farmer_id),
      assigned_officer: this.profiles.find((p) => p.id === c.assigned_officer_id),
    };
  }

  public async createCase(data: Omit<SupportCase, 'id' | 'created_at' | 'updated_at'>): Promise<SupportCase> {
    const newCase: SupportCase = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.cases.unshift(newCase);
    return newCase;
  }

  public async updateCase(id: string, updates: Partial<SupportCase>): Promise<SupportCase | null> {
    const index = this.cases.findIndex((c) => c.id === id);
    if (index === -1) return null;
    this.cases[index] = {
      ...this.cases[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return this.cases[index];
  }

  // ---------------------------------------------------------------------------
  // Government Schemes
  // ---------------------------------------------------------------------------
  public async listSchemes(query?: string): Promise<Scheme[]> {
    if (!query) return this.schemes.filter((s) => s.is_active);
    const q = query.toLowerCase();
    return this.schemes.filter(
      (s) =>
        s.is_active &&
        (s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          (s.department && s.department.toLowerCase().includes(q)))
    );
  }

  public async listAllSchemesAdmin(): Promise<Scheme[]> {
    return this.schemes;
  }

  public async getSchemeById(id: string): Promise<Scheme | null> {
    return this.schemes.find((s) => s.id === id) || null;
  }

  public async createScheme(data: Omit<Scheme, 'id' | 'created_at' | 'updated_at'>): Promise<Scheme> {
    const newScheme: Scheme = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.schemes.unshift(newScheme);
    return newScheme;
  }

  public async updateScheme(id: string, updates: Partial<Scheme>): Promise<Scheme | null> {
    const index = this.schemes.findIndex((s) => s.id === id);
    if (index === -1) return null;
    this.schemes[index] = {
      ...this.schemes[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return this.schemes[index];
  }

  public async deleteScheme(id: string): Promise<boolean> {
    const before = this.schemes.length;
    this.schemes = this.schemes.filter((s) => s.id !== id);
    return this.schemes.length < before;
  }

  // ---------------------------------------------------------------------------
  // Agricultural Alerts
  // ---------------------------------------------------------------------------
  public async listPublishedAlerts(): Promise<Alert[]> {
    return this.alerts.filter((a) => a.is_published);
  }

  public async listAllAlerts(): Promise<Alert[]> {
    return this.alerts;
  }

  public async createAlert(data: Omit<Alert, 'id' | 'created_at' | 'updated_at'>): Promise<Alert> {
    const newAlert: Alert = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.alerts.unshift(newAlert);
    return newAlert;
  }

  public async updateAlert(id: string, updates: Partial<Alert>): Promise<Alert | null> {
    const index = this.alerts.findIndex((a) => a.id === id);
    if (index === -1) return null;
    this.alerts[index] = {
      ...this.alerts[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return this.alerts[index];
  }

  public async deleteAlert(id: string): Promise<boolean> {
    const before = this.alerts.length;
    this.alerts = this.alerts.filter((a) => a.id !== id);
    return this.alerts.length < before;
  }

  // ---------------------------------------------------------------------------
  // Notifications
  // ---------------------------------------------------------------------------
  public async listNotificationsByUser(userId: string): Promise<Notification[]> {
    return this.notifications.filter((n) => n.user_id === userId);
  }

  public async markNotificationRead(id: string, userId: string): Promise<boolean> {
    const notif = this.notifications.find((n) => n.id === id && n.user_id === userId);
    if (notif) {
      notif.read_at = new Date().toISOString();
      return true;
    }
    return false;
  }

  public async markAllNotificationsRead(userId: string): Promise<void> {
    const now = new Date().toISOString();
    this.notifications.forEach((n) => {
      if (n.user_id === userId && !n.read_at) {
        n.read_at = now;
      }
    });
  }

  public async createNotification(data: Omit<Notification, 'id' | 'created_at'>): Promise<Notification> {
    const notif: Notification = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };
    this.notifications.unshift(notif);
    return notif;
  }

  // ---------------------------------------------------------------------------
  // Audit Logs
  // ---------------------------------------------------------------------------
  public async createAuditLog(data: Omit<AuditLog, 'id' | 'created_at'>): Promise<AuditLog> {
    const log: AuditLog = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);
    return log;
  }

  public async listAuditLogs(limit = 100): Promise<AuditLog[]> {
    return this.auditLogs.slice(0, limit);
  }

  // ---------------------------------------------------------------------------
  // Chat Sessions & Messages
  // ---------------------------------------------------------------------------
  public async listChatSessionsByUser(userId: string): Promise<ChatSession[]> {
    return this.chatSessions.filter((cs) => cs.user_id === userId);
  }

  public async getChatSessionById(id: string, userId: string): Promise<ChatSession | null> {
    return this.chatSessions.find((cs) => cs.id === id && cs.user_id === userId) || null;
  }

  public async createChatSession(userId: string, title?: string): Promise<ChatSession> {
    const session: ChatSession = {
      id: crypto.randomUUID(),
      user_id: userId,
      title: title || 'New Agricultural Consultation',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.chatSessions.unshift(session);
    return session;
  }

  public async deleteChatSession(id: string, userId: string): Promise<boolean> {
    const before = this.chatSessions.length;
    this.chatSessions = this.chatSessions.filter((cs) => cs.id !== id || cs.user_id !== userId);
    this.chatMessages = this.chatMessages.filter((cm) => cm.session_id !== id);
    return this.chatSessions.length < before;
  }

  public async listChatMessagesBySession(sessionId: string): Promise<ChatMessage[]> {
    return this.chatMessages.filter((cm) => cm.session_id === sessionId);
  }

  public async createChatMessage(data: Omit<ChatMessage, 'id' | 'created_at'>): Promise<ChatMessage> {
    const msg: ChatMessage = {
      ...data,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
    };
    this.chatMessages.push(msg);
    return msg;
  }
}

export const db = new DatabaseRepository();
