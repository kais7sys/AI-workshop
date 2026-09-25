-- =============================================================================
-- Seed Data: Real Agricultural Department Platform Initial Dataset
-- =============================================================================

-- 1. Master Crops Catalog
INSERT INTO public.crops (id, name, scientific_name, category, description, growing_season, soil_requirements, water_requirements)
VALUES 
(
    '11111111-1111-1111-1111-111111110001',
    'Wheat',
    'Triticum aestivum',
    'Cereal',
    'Staple rabi cereal crop requiring cool winter climate and moderate irrigation.',
    'Rabi (Oct - Apr)',
    '{"optimal_ph": "6.0 - 7.5", "type": "Loam to Clay Loam", "drainage": "Well drained"}'::jsonb,
    '{"annual_water_mm": "450 - 650", "critical_stages": ["CRI stage", "Tillering", "Flowering", "Milking"]}'::jsonb
),
(
    '11111111-1111-1111-1111-111111110002',
    'Basmati Rice',
    'Oryza sativa',
    'Cereal',
    'Aromatic long-grain kharif paddy requiring standing water during vegetative phases.',
    'Kharif (Jun - Nov)',
    '{"optimal_ph": "5.5 - 7.0", "type": "Clayey Loam / Silt Loam", "drainage": "Water retentive"}'::jsonb,
    '{"annual_water_mm": "1100 - 1500", "critical_stages": ["Transplanting", "Tillering", "Panicle Initiation"]}'::jsonb
),
(
    '11111111-1111-1111-1111-111111110003',
    'Cotton',
    'Gossypium hirsutum',
    'Fiber / Cash Crop',
    'High-value cash crop sensitive to waterlogging and bollworm infestations.',
    'Kharif (May - Nov)',
    '{"optimal_ph": "6.0 - 8.0", "type": "Deep Black Soils (Regur)", "drainage": "High moisture retention with good drainage"}'::jsonb,
    '{"annual_water_mm": "700 - 1000", "critical_stages": ["Square formation", "Flowering", "Boll development"]}'::jsonb
),
(
    '11111111-1111-1111-1111-111111110004',
    'Tomato',
    'Solanum lycopersicum',
    'Vegetable / Horticulture',
    'Fast-growing warm-season horticultural crop susceptible to fungal leaf spots and blight.',
    'Year-round (Kharif / Rabi)',
    '{"optimal_ph": "6.0 - 6.8", "type": "Sandy Loam with high organic matter", "drainage": "Excellent drainage required"}'::jsonb,
    '{"annual_water_mm": "400 - 600", "critical_stages": ["Vegetative", "Fruit set", "Fruit enlargement"]}'::jsonb
),
(
    '11111111-1111-1111-1111-111111110005',
    'Mustard',
    'Brassica juncea',
    'Oilseed',
    'Major rabi oilseed requiring low to moderate moisture and responsive to sulfur fertilization.',
    'Rabi (Oct - Mar)',
    '{"optimal_ph": "6.5 - 7.5", "type": "Sandy Loam to Loam", "drainage": "Well drained"}'::jsonb,
    '{"annual_water_mm": "250 - 400", "critical_stages": ["Pre-flowering", "Pod filling"]}'::jsonb
),
(
    '11111111-1111-1111-1111-111111110006',
    'Maize',
    'Zea mays',
    'Cereal / Feed',
    'Versatile grain crop sensitive to both drought and standing waterlogging.',
    'Kharif / Spring',
    '{"optimal_ph": "6.0 - 7.5", "type": "Well-aerated fertile loamy soil", "drainage": "High drainage essential"}'::jsonb,
    '{"annual_water_mm": "500 - 800", "critical_stages": ["Tasseling", "Silking", "Grain filling"]}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 2. Master Government Schemes Directory
INSERT INTO public.schemes (id, name, description, eligibility, benefits, required_documents, application_information, department, state, official_source, last_verified_at, is_active)
VALUES
(
    '22222222-2222-2222-2222-222222220001',
    'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    'Income support initiative by the Government of India providing financial assistance to all landholding farmer families across the country.',
    'All landholder farmer families with cultivable land in their names, subject to standard official exclusion criteria.',
    'Direct benefit transfer of Rs. 6,000 per year paid in three equal 4-monthly installments of Rs. 2,000 directly into authenticated bank accounts.',
    '["Aadhaar Card", "Land ownership records (Khasra/Khatauni)", "Bank Account Passbook with IFSC", "Valid Mobile Number"]'::jsonb,
    'Farmers can register through the PM-KISAN online portal (pmkisan.gov.in), Common Service Centres (CSCs), or via the local District Agriculture Office.',
    'Ministry of Agriculture & Farmers Welfare',
    'All India',
    'https://pmkisan.gov.in',
    NOW(),
    true
),
(
    '22222222-2222-2222-2222-222222220002',
    'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
    'Comprehensive risk insurance scheme providing financial support and claim compensation to farmers suffering crop loss or damage arising out of unforeseen weather events.',
    'All farmers growing notified crops in notified areas including sharecroppers and tenant farmers.',
    'Very low premium payable by farmer: 2% for Kharif crops, 1.5% for Rabi food and oilseeds, 5% for annual commercial/horticultural crops. Balance subsidized by Central and State Governments.',
    '["Land possession certificate", "Sowing certificate issued by Patwari/Revenue officer", "Bank Passbook", "Aadhaar Card"]'::jsonb,
    'Enrollment via national crop insurance portal (pmfby.gov.in), authorized banks, or registered cooperative societies within cut-off deadlines.',
    'Department of Agriculture and Cooperation',
    'All India',
    'https://pmfby.gov.in',
    NOW(),
    true
),
(
    '22222222-2222-2222-2222-222222220003',
    'Soil Health Card Scheme',
    'Government program promoting balanced crop nutrient management and customized fertilizer recommendations based on scientific soil testing.',
    'All farmers owning or managing agricultural land.',
    'Free-of-cost periodic soil testing assessing 12 major parameters (N, P, K, S, Zn, Fe, Cu, Mn, Bo, pH, EC, OC) with tailored crop advisory.',
    '["Farmer identification proof", "Land plot survey number"]'::jsonb,
    'Soil samples are collected by the Agriculture Department field staff or farmers can deposit samples at local Soil Testing Laboratories (STLs).',
    'Department of Agriculture & Farmers Welfare',
    'All India',
    'https://soilhealth.dac.gov.in',
    NOW(),
    true
),
(
    '22222222-2222-2222-2222-222222220004',
    'PMKSY - Per Drop More Crop (Micro Irrigation)',
    'Scheme dedicated to enhancing water use efficiency at farm level through micro-irrigation systems such as drip and sprinkler irrigation.',
    'Small and marginal farmers, individual landowners, members of farmer producer organizations (FPOs).',
    'Subsidies up to 55% for small & marginal farmers and up to 45% for other farmers on capital cost of installing drip and sprinkler systems.',
    '["Land ownership records", "Water source verification certificate", "Aadhaar Card", "Bank Account Details", "Electricity connection/pump proof"]'::jsonb,
    'Submit application via the State Horticulture/Agriculture portal or directly at the District Horticulture Officer (DHO) office.',
    'Department of Agriculture & Farmers Welfare',
    'All India',
    'https://pmksy.gov.in',
    NOW(),
    true
)
ON CONFLICT (id) DO NOTHING;

-- 3. Realistic Agricultural Alerts
INSERT INTO public.alerts (id, title, description, category, severity, state, district, crop_id, starts_at, ends_at, is_published)
VALUES
(
    '33333333-3333-3333-3333-333333330001',
    'Heatwave & Evapotranspiration Surge Alert',
    'Daytime temperatures expected to exceed 42°C over the next 4 days. Farmers are advised to provide light and frequent evening irrigation to standing crops to prevent heat stress and premature drying.',
    'WEATHER',
    'HIGH',
    'Punjab',
    'Ludhiana',
    '11111111-1111-1111-1111-111111110001',
    NOW() - INTERVAL '1 day',
    NOW() + INTERVAL '5 days',
    true
),
(
    '33333333-3333-3333-3333-333333330002',
    'Yellow Rust Surveillance Advisory in Wheat',
    'Isolated incidents of stripe (yellow) rust observed in sub-mountainous blocks. Inspect wheat leaves for yellow powdery stripes along leaf veins. Report suspected outbreaks immediately to your Agriculture Officer.',
    'PEST_DISEASE',
    'MEDIUM',
    'Punjab',
    'All Districts',
    '11111111-1111-1111-1111-111111110001',
    NOW() - INTERVAL '2 days',
    NOW() + INTERVAL '10 days',
    true
),
(
    '33333333-3333-3333-3333-333333330003',
    'Tomato Early Blight Preventive Spray Alert',
    'Continuous cloudy conditions and high morning relative humidity (>85%) are conducive to fungal leaf spot and early blight in tomato fields. Avoid overhead sprinkler irrigation during morning hours.',
    'PEST_DISEASE',
    'MEDIUM',
    'All States',
    NULL,
    '11111111-1111-1111-1111-111111110004',
    NOW(),
    NOW() + INTERVAL '7 days',
    true
)
ON CONFLICT (id) DO NOTHING;
