import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Sparkles,
  MapPin,
  Sprout,
  Droplets,
  Layers,
  Calendar,
  AlertCircle,
  HelpCircle,
  CheckCircle,
} from 'lucide-react';
import { api } from '../../lib/api.js';
import { Farm, Crop, Advisory } from '../../types/index.js';
import { AdvisoryResultModal } from '../../components/agriculture/AdvisoryResultModal.js';

const advisoryFormSchema = z.object({
  farmId: z.string().optional(),
  cropName: z.string().min(1, 'Crop name is required'),
  variety: z.string().optional(),
  growthStage: z.string().min(1, 'Growth stage is required'),
  location: z.string().min(1, 'Location is required'),
  soilType: z.string().optional(),
  soilPh: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().min(0).max(14).optional()),
  irrigationType: z.string().optional(),
  sowingDate: z.string().optional(),
  previousCrop: z.string().optional(),
  farmerObjective: z.string().optional(),
  symptoms: z.string().optional(),
  question: z.string().optional(),
});

type AdvisoryFormValues = z.infer<typeof advisoryFormSchema>;

export const AdvisoryPage: React.FC = () => {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedAdvisory, setGeneratedAdvisory] = useState<Advisory | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AdvisoryFormValues>({
    resolver: zodResolver(advisoryFormSchema),
    defaultValues: {
      cropName: 'Wheat',
      variety: 'HD-3086',
      growthStage: 'Flowering & Grain Filling',
      location: 'Sidwan Bet, Ludhiana, Punjab',
      soilType: 'Alluvial Loam',
      soilPh: 6.8,
      irrigationType: 'Tube well / Drip',
      sowingDate: '2026-11-10',
      previousCrop: 'Paddy (Basmati)',
      farmerObjective: 'Prevent terminal heat stress and maximize grain weight',
      symptoms: 'Mild leaf tip drying observed on south boundary',
      question: 'Should I adjust irrigation frequency during current heat wave warning?',
    },
  });

  const selectedFarmId = watch('farmId');

  useEffect(() => {
    async function loadFarmsAndCrops() {
      try {
        const [farmsData, cropsData] = await Promise.all([
          api.get<Farm[]>('/api/farms'),
          api.get<Crop[]>('/api/crops'),
        ]);
        setFarms(farmsData);
        setCrops(cropsData);
        if (farmsData.length > 0) {
          setValue('farmId', farmsData[0].id);
        }
      } catch (err) {
        console.error('Failed to load farms/crops', err);
      } finally {
        setLoadingInitial(false);
      }
    }
    loadFarmsAndCrops();
  }, [setValue]);

  // When farmer selects a farm, auto-populate location, soil type, pH, irrigation
  const handleFarmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const farmId = e.target.value;
    setValue('farmId', farmId);
    const farm = farms.find((f) => f.id === farmId);
    if (farm) {
      if (farm.district || farm.state) {
        setValue('location', `${farm.village || ''}, ${farm.district || ''}, ${farm.state || ''}`.replace(/^, |, $/g, ''));
      }
      if (farm.soil_type) setValue('soilType', farm.soil_type);
      if (farm.soil_ph) setValue('soilPh', farm.soil_ph);
      if (farm.irrigation_type) setValue('irrigationType', farm.irrigation_type);
    }
  };

  const onSubmit = async (data: AdvisoryFormValues) => {
    try {
      setIsSubmitting(true);
      setErrorMsg(null);
      const result = await api.post<Advisory>('/api/advisories', data);
      setGeneratedAdvisory(result);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to generate advisory. Please verify your inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-emerald-600" />
            <span>AI Precision Crop Advisory</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Generate customized agronomic guidance factoring in crop stage, soil, and live micro-climate telemetry.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Advisory Configuration Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Step 1: Farm & Location Context */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              1. Farm & Geographic Context
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Select Registered Farm
              </label>
              <select
                {...register('farmId')}
                onChange={handleFarmChange}
                className="input-field text-sm"
              >
                {farms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.area || 0} {f.area_unit || 'acre'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Location / Agro-climatic Zone *
              </label>
              <input
                type="text"
                {...register('location')}
                placeholder="Village, District, State"
                className="input-field text-sm"
              />
              {errors.location && (
                <span className="text-xs text-rose-600 font-medium mt-1 block">{errors.location.message}</span>
              )}
            </div>
          </div>
        </div>

        {/* Step 2: Crop Details */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              2. Crop & Phenological Stage
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Crop Name *
              </label>
              <input
                type="text"
                {...register('cropName')}
                placeholder="e.g. Wheat, Basmati Rice"
                className="input-field text-sm"
              />
              {errors.cropName && (
                <span className="text-xs text-rose-600 font-medium mt-1 block">{errors.cropName.message}</span>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Variety / Hybrid
              </label>
              <input
                type="text"
                {...register('variety')}
                placeholder="e.g. HD-3086"
                className="input-field text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Current Growth Stage *
              </label>
              <input
                type="text"
                {...register('growthStage')}
                placeholder="e.g. Flowering, Tillering, Milking"
                className="input-field text-sm"
              />
              {errors.growthStage && (
                <span className="text-xs text-rose-600 font-medium mt-1 block">{errors.growthStage.message}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Sowing Date
              </label>
              <input
                type="date"
                {...register('sowingDate')}
                className="input-field text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Previous Crop in this Plot
              </label>
              <input
                type="text"
                {...register('previousCrop')}
                placeholder="e.g. Paddy / Mung bean"
                className="input-field text-sm"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Soil & Irrigation Context */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Droplets className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              3. Soil & Irrigation Method
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Soil Classification
              </label>
              <input
                type="text"
                {...register('soilType')}
                placeholder="e.g. Alluvial Loam, Black Cotton"
                className="input-field text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Soil pH Level
              </label>
              <input
                type="number"
                step="0.1"
                {...register('soilPh')}
                placeholder="6.5 - 7.5"
                className="input-field text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Irrigation System
              </label>
              <input
                type="text"
                {...register('irrigationType')}
                placeholder="e.g. Drip, Sprinkler, Flood"
                className="input-field text-sm"
              />
            </div>
          </div>
        </div>

        {/* Step 4: Observed Symptoms & Specific Farmer Inquiries */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              4. Symptoms & Specific Question
            </h3>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Current Symptoms or Stress Observations
            </label>
            <textarea
              rows={2}
              {...register('symptoms')}
              placeholder="e.g. Yellowing on lower foliage, curling leaves, pest feeding marks..."
              className="input-field text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Your Specific Question for the AI Agronomist
            </label>
            <textarea
              rows={2}
              {...register('question')}
              placeholder="e.g. What is the recommended irrigation schedule under this heat stress?"
              className="input-field text-sm"
            />
          </div>
        </div>

        {/* Submission Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary px-8 py-3.5 text-sm font-bold shadow-glow flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-emerald-300" />
            <span>{isSubmitting ? 'Synthesizing Agronomic Guidance...' : 'Generate Official AI Advisory'}</span>
          </button>
        </div>
      </form>

      {/* Advisory Result Modal */}
      <AdvisoryResultModal
        advisory={generatedAdvisory}
        onClose={() => setGeneratedAdvisory(null)}
      />
    </div>
  );
};
