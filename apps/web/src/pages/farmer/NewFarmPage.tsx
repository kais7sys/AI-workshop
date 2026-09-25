import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Plus, ArrowLeft } from 'lucide-react';
import { api } from '../../lib/api.js';

const farmSchema = z.object({
  name: z.string().min(2, 'Farm name is required'),
  location_text: z.string().optional(),
  state: z.string().min(2, 'State is required'),
  district: z.string().min(2, 'District is required'),
  taluka: z.string().optional(),
  village: z.string().optional(),
  area: z.preprocess((v) => (v === '' ? undefined : Number(v)), z.number().positive('Area must be positive')),
  area_unit: z.enum(['acre', 'hectare', 'bigha', 'guntha']).default('acre'),
  soil_type: z.string().optional(),
  soil_ph: z.preprocess((v) => (v === '' ? undefined : Number(v)), z.number().min(0).max(14).optional()),
  irrigation_type: z.string().optional(),
});

type FarmFormValues = z.infer<typeof farmSchema>;

export const NewFarmPage: React.FC = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FarmFormValues>({
    resolver: zodResolver(farmSchema),
    defaultValues: {
      name: '',
      state: 'Punjab',
      district: 'Ludhiana',
      taluka: 'Jagraon',
      village: '',
      area: 5,
      area_unit: 'acre',
      soil_type: 'Alluvial Loam',
      soil_ph: 6.8,
      irrigation_type: 'Tube well & Sprinkler',
    },
  });

  const onSubmit = async (values: FarmFormValues) => {
    try {
      setErrorMsg(null);
      await api.post('/api/farms', values);
      navigate('/farms');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to register farm.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/farms')}
        className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Farms List</span>
      </button>

      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Register New Agricultural Farm</h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Enter your plot measurements, soil properties, and irrigation source for targeted agricultural guidance.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-6 space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Farm / Plot Holding Name *
          </label>
          <input
            type="text"
            {...register('name')}
            placeholder="e.g. Sunrise Organic Farm"
            className="input-field text-sm"
          />
          {errors.name && <span className="text-xs text-rose-600 font-medium mt-1 block">{errors.name.message}</span>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Total Farm Area *
            </label>
            <input
              type="number"
              step="0.1"
              {...register('area')}
              className="input-field text-sm"
            />
            {errors.area && <span className="text-xs text-rose-600 font-medium mt-1 block">{errors.area.message}</span>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Unit
            </label>
            <select {...register('area_unit')} className="input-field text-sm">
              <option value="acre">Acre</option>
              <option value="hectare">Hectare</option>
              <option value="bigha">Bigha</option>
              <option value="guntha">Guntha</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              State *
            </label>
            <input type="text" {...register('state')} className="input-field text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              District *
            </label>
            <input type="text" {...register('district')} className="input-field text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Tehsil / Taluka
            </label>
            <input type="text" {...register('taluka')} className="input-field text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Village
            </label>
            <input type="text" {...register('village')} className="input-field text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Soil Type
            </label>
            <input type="text" {...register('soil_type')} placeholder="e.g. Sandy Loam" className="input-field text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Soil pH (0-14)
            </label>
            <input type="number" step="0.1" {...register('soil_ph')} placeholder="6.8" className="input-field text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Irrigation Source
            </label>
            <input type="text" {...register('irrigation_type')} placeholder="Tube well / Canal" className="input-field text-sm" />
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-3">
          <button type="button" onClick={() => navigate('/farms')} className="btn-secondary text-xs">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="btn-primary text-xs px-6 py-2.5">
            {isSubmitting ? 'Registering...' : 'Save & Register Farm'}
          </button>
        </div>
      </form>
    </div>
  );
};
