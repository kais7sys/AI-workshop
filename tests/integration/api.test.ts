import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createApp } from '../../apps/api/src/app.js';
import { Server } from 'http';
import { AddressInfo } from 'net';

describe('API Integration Tests', () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    const app = createApp();
    await new Promise<void>((resolve) => {
      server = app.listen(0, '127.0.0.1', () => {
        const address = server.address() as AddressInfo;
        baseUrl = `http://127.0.0.1:${address.port}`;
        resolve();
      });
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });

  describe('Health Probes', () => {
    it('GET /health should return 200 and liveness status', async () => {
      const res = await fetch(`${baseUrl}/health`);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.status).toBe('ok');
      expect(data.service).toBe('krishiseva-api');
      expect(typeof data.uptime).toBe('number');
    });

    it('GET /ready should return 200 and readiness status', async () => {
      const res = await fetch(`${baseUrl}/ready`);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.status).toBe('ready');
      expect(data.checks).toBeDefined();
    });
  });

  describe('Public & Master Catalog Endpoints', () => {
    it('GET /api/crops should return seeded master crops list', async () => {
      const res = await fetch(`${baseUrl}/api/crops`);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);

      const cropNames = data.map((c: { name: string }) => c.name);
      expect(cropNames).toContain('Wheat');
      expect(cropNames).toContain('Basmati Rice');
    });

    it('GET /api/schemes should return government agricultural schemes', async () => {
      const res = await fetch(`${baseUrl}/api/schemes`);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);

      const schemeNames = data.map((s: { name: string }) => s.name);
      expect(schemeNames.some((n: string) => n.includes('PM-KISAN'))).toBe(true);
    });

    it('GET /api/alerts should return active agricultural alerts', async () => {
      const res = await fetch(`${baseUrl}/api/alerts`);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe('Authentication & Authorization Guards', () => {
    it('GET /api/profile should return 401 Unauthorized without token', async () => {
      const res = await fetch(`${baseUrl}/api/profile`);
      expect(res.status).toBe(401);

      const data = await res.json();
      expect(data.error).toBeDefined();
    });

    it('GET /api/profile should return 200 OK with valid mock farmer token', async () => {
      const res = await fetch(`${baseUrl}/api/profile`, {
        headers: {
          Authorization: 'Bearer mock-farmer-token',
        },
      });
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.role).toBe('FARMER');
      expect(data.full_name).toBeDefined();
    });

    it('Officer routes should reject requests from non-officers', async () => {
      const res = await fetch(`${baseUrl}/api/officer/cases`, {
        headers: {
          Authorization: 'Bearer mock-farmer-token', // Farmer attempting officer route
        },
      });
      expect(res.status).toBe(403);
    });

    it('Officer routes should succeed with officer token', async () => {
      const res = await fetch(`${baseUrl}/api/officer/cases`, {
        headers: {
          Authorization: 'Bearer mock-officer-token',
        },
      });
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);
    });
  });

  describe('Farmer Workflow: Farms & Advisory', () => {
    it('POST /api/farms should create a new farm registration', async () => {
      const farmPayload = {
        name: 'Vibrant Gujarat Test Farm',
        area: 5.5,
        area_unit: 'acre',
        soil_type: 'Loamy Sand',
        soil_ph: 7.1,
        irrigation_type: 'Drip',
      };

      const res = await fetch(`${baseUrl}/api/farms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-farmer-token',
        },
        body: JSON.stringify(farmPayload),
      });

      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.id).toBeDefined();
      expect(data.name).toBe(farmPayload.name);
    });

    it('POST /api/advisories should generate and return a structured advisory', async () => {
      const advisoryPayload = {
        cropName: 'Mustard',
        growthStage: 'Siliqua Development',
        variety: 'Pusa Bold',
        location: 'Bharatpur, Rajasthan',
        soilType: 'Alluvial',
        soilPh: 7.5,
        irrigationType: 'Furrow',
        symptoms: 'Aphid clustering on young inflorescence',
        question: 'What is the organic threshold treatment for mustard aphids?',
      };

      const res = await fetch(`${baseUrl}/api/advisories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer mock-farmer-token',
        },
        body: JSON.stringify(advisoryPayload),
      });

      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.id).toBeDefined();
      expect(data.ai_response).toBeDefined();
      expect(data.ai_response.summary).toBeDefined();
      expect(data.ai_response.immediateActions.length).toBeGreaterThan(0);
      expect(data.ai_response.disclaimer).toBeDefined();
    });
  });
});
