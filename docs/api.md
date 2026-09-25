# KrishiSeva REST API Specification

## 1. Overview & Conventions

The KrishiSeva Backend API is an Express.js TypeScript microservice providing secure endpoints for farmers, agriculture officers, and system administrators.

- **Base URL:** `http://localhost:5000/api`
- **Health Checks:** `http://localhost:5000/health`, `http://localhost:5000/ready`
- **Content Type:** `application/json`
- **Authentication:** `Bearer <JWT_TOKEN>` in the `Authorization` header

---

## 2. Global Error Response Standard

All non-2xx responses return a consistent JSON payload:

```json
{
  "error": "Error title or category",
  "message": "Human-readable explanation",
  "details": [
    {
      "field": "growthStage",
      "message": "Growth stage is required"
    }
  ]
}
```

---

## 3. Endpoints by Domain

### 3.1 Health & Readiness Probes

#### `GET /health`
Liveness check for container orchestration and load balancers.
- **Response (200 OK):**
```json
{
  "status": "ok",
  "service": "krishiseva-api",
  "uptime": 142.3,
  "timestamp": "2026-09-25T14:30:00.000Z"
}
```

#### `GET /ready`
Readiness probe verifying database connectivity, AI subsystem initialization, and environment configuration.
- **Response (200 OK):**
```json
{
  "status": "ready",
  "checks": {
    "database": "connected",
    "ai": "gemini-3.8-flash initialized",
    "environment": "production"
  },
  "timestamp": "2026-09-25T14:30:00.000Z"
}
```

---

### 3.2 Authentication (`/api/auth`)

#### `GET /api/auth/me`
Retrieves currently authenticated session user profile and permissions.
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
```json
{
  "user": {
    "id": "e4b5f921-236b-4e1d-91b4-879e60249211",
    "email": "farmer@krishiseva.gov.in",
    "role": "FARMER"
  },
  "profile": {
    "id": "e4b5f921-236b-4e1d-91b4-879e60249211",
    "full_name": "Ramesh Patel",
    "phone": "+91 98765 43210",
    "role": "FARMER",
    "state": "Gujarat",
    "district": "Anand"
  }
}
```

---

### 3.3 Farmer Profiles (`/api/profile`)

#### `GET /api/profile`
Fetches the current user's profile.

#### `PATCH /api/profile`
Updates profile demographics and farming experience.
- **Request Body:**
```json
{
  "full_name": "Ramesh Patel",
  "phone": "+91 98765 43210",
  "preferred_language": "gu",
  "state": "Gujarat",
  "district": "Anand",
  "taluka": "Petlad",
  "village": "Nar",
  "farming_experience": 18
}
```

---

### 3.4 Farms & Fields (`/api/farms`)

#### `GET /api/farms`
Lists all farms owned by the authenticated farmer.

#### `POST /api/farms`
Creates a new farm registration.
- **Request Body:**
```json
{
  "name": "Green Valley Farm",
  "location_text": "Plot 42, Near Canal Road",
  "state": "Gujarat",
  "district": "Anand",
  "taluka": "Petlad",
  "village": "Nar",
  "area": 4.5,
  "area_unit": "acre",
  "irrigation_type": "Drip Irrigation",
  "soil_type": "Alluvial Loam",
  "soil_ph": 7.2
}
```

#### `GET /api/farms/:id`
Retrieves farm details including nested fields and active crop records.

#### `PATCH /api/farms/:id`
Updates farm details.

#### `DELETE /api/farms/:id`
Deletes a farm and associated fields.

#### `GET /api/farms/:farmId/fields`
Lists fields registered under a specific farm.

#### `POST /api/farms/:farmId/fields`
Registers a new field under a farm.
- **Request Body:**
```json
{
  "name": "North Field - Plot A",
  "area": 2.0,
  "soil_type": "Sandy Loam",
  "soil_ph": 6.8,
  "irrigation_type": "Sprinkler"
}
```

---

### 3.5 AI Crop Advisory (`/api/advisories`)

#### `POST /api/advisories`
Submits an agricultural advisory request to the server-side Gemini AI engine.
- **Request Body:**
```json
{
  "farmId": "38a8e1b9-3891-4509-9132-351187424601",
  "fieldId": "9123847a-8742-4912-b912-482194812340",
  "cropId": "550e8400-e29b-41d4-a716-446655440001",
  "cropName": "Wheat",
  "variety": "HD-2967",
  "growthStage": "Tillering",
  "location": "Anand, Gujarat",
  "soilType": "Alluvial Loam",
  "soilPh": 7.2,
  "irrigationType": "Canal / Flood",
  "sowingDate": "2026-11-15",
  "symptoms": "Slight yellowing on lower leaf tips",
  "question": "Should I apply second dose of urea right now or wait?"
}
```

- **Response (201 Created):**
```json
{
  "id": "ad89124a-2931-4192-b412-481924182931",
  "farmer_id": "e4b5f921-236b-4e1d-91b4-879e60249211",
  "crop_name": "Wheat",
  "ai_response": {
    "summary": "Crop advisory for Wheat at Tillering stage under Anand, Gujarat conditions.",
    "assessment": "At tillering stage, wheat requires optimal nitrogen and crown root moisture...",
    "riskLevel": "LOW",
    "confidence": 0.88,
    "immediateActions": [
      "Inspect lower leaf surfaces for aphid colonies or yellow rust pustules."
    ],
    "shortTermRecommendations": [
      "Schedule first top-dress nitrogen split (approx 30-35 kg N/acre) immediately prior to irrigation."
    ],
    "irrigationGuidance": [
      "Crown root initiation (CRI) and tillering are critical moisture sensitive stages. Do not allow water stress."
    ],
    "nutrientConsiderations": [
      "Yellowing on older leaves indicates mild nitrogen translocation. Avoid over-applying before irrigation."
    ],
    "pestDiseaseConsiderations": [
      "Monitor for powdery mildew if nighttime humidity exceeds 85%."
    ],
    "preventiveMeasures": [
      "Keep field borders clear of wild grasses."
    ],
    "followUpQuestions": [
      "Was basal DAP or NPK applied at the time of sowing?"
    ],
    "professionalReviewRecommended": false,
    "disclaimer": "This advisory is generated with agricultural AI assistance. Always consult your local Agriculture Officer before applying chemical inputs."
  },
  "created_at": "2026-09-25T14:35:00.000Z"
}
```

---

### 3.6 Pest & Disease Assistance (`/api/advisories/disease`)

#### `POST /api/advisories/disease`
Submits symptoms and optional image for differential diagnostic analysis.
- **Request Body:**
```json
{
  "cropName": "Tomato",
  "symptoms": "Dark brown concentric rings on lower leaves, stems showing dark lesions, leaf yellowing around spots",
  "affectedParts": ["Leaves", "Stems"],
  "durationDays": 4,
  "location": "Pune, Maharashtra"
}
```

- **Response (200 OK):**
```json
{
  "possibleCauses": [
    {
      "name": "Early Blight (Alternaria solani)",
      "reasoning": "Concentric ring spots (target board pattern) on older leaves are a classic hallmark of early blight.",
      "confidence": 0.82
    },
    {
      "name": "Septoria Leaf Spot",
      "reasoning": "Circular spots with dark borders, often accelerated by warm humid microclimates.",
      "confidence": 0.45
    }
  ],
  "observations": [
    "Symptoms predominantly located on lower foliage near the soil surface."
  ],
  "immediateActions": [
    "Prune heavily infected lower leaves and safely dispose of them outside the field boundary.",
    "Switch to drip irrigation to prevent water splashing from soil to canopy."
  ],
  "preventiveMeasures": [
    "Ensure proper staking and mulch coverage to minimize soil contact."
  ],
  "additionalInformationNeeded": [
    "High-resolution close-up of stem lesions."
  ],
  "professionalInspectionRecommended": true,
  "disclaimer": "Pest and disease identification is provided as potential possibilities. It is NOT a confirmed laboratory diagnosis. Please consult an Agriculture Extension Officer."
}
```

---

### 3.7 Conversational AI Chat (`/api/chat`)

- `GET /api/chat/sessions`: Lists user chat sessions.
- `POST /api/chat/sessions`: Creates a new session.
- `GET /api/chat/sessions/:id`: Retrieves conversation history.
- `POST /api/chat/sessions/:id/messages`: Posts message, processes turn via Gemini, returns assistant response.
- `DELETE /api/chat/sessions/:id`: Deletes session.

---

### 3.8 Support Cases (`/api/cases` & `/api/officer/cases`)

- `GET /api/cases`: Farmer views their support requests.
- `POST /api/cases`: Farmer opens a support case.
- `GET /api/cases/:id`: Detailed case view with officer notes and resolution.
- `GET /api/officer/cases`: Officer views assigned district cases.
- `PATCH /api/officer/cases/:id`: Officer updates status, adds technical assessment notes, or resolves case.

---

### 3.9 Government Schemes (`/api/schemes`)

- `GET /api/schemes`: Search and filter government agricultural schemes (PM-KISAN, PMFBY, Soil Health Card, etc.).
- `GET /api/schemes/:id`: Detailed scheme view with eligibility, benefits, required documents, and official portal links.
- `POST /api/schemes` (Admin): Creates a new scheme entry.
- `PATCH /api/schemes/:id` (Admin): Updates scheme details.
- `DELETE /api/schemes/:id` (Admin): Deactivates a scheme.

---

### 3.10 Agricultural Alerts (`/api/alerts`)

- `GET /api/alerts`: Active regional alerts for weather, pests, diseases, and departmental announcements.
- `POST /api/alerts` (Officer/Admin): Dispatches a new alert.
- `PATCH /api/alerts/:id` (Officer/Admin): Modifies or publishes an alert.
- `DELETE /api/alerts/:id` (Officer/Admin): Revokes an alert.

---

### 3.11 Admin Management (`/api/admin`)

- `GET /api/admin/users`: List users and roles.
- `PATCH /api/admin/users/:id/role`: Assign FARMER, OFFICER, or ADMIN roles.
- `GET /api/admin/audit-logs`: Query tamper-evident platform audit logs.
- `GET /api/admin/system`: System health, uptime, memory, and runtime statistics.
