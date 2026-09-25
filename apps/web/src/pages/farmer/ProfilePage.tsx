import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, CheckCircle, Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.js';
import { api } from '../../lib/api.js';
import { Profile } from '../../types/index.js';

const profileSchema = z.object({
  full_name: z.string().min(2, 'Name is required'),
  phone: z.string().optional(),
  preferred_language: z.string().default('en'),
  state: z.string().optional(),
  district: z.string().optional(),
  taluka: z.string().optional(),
  village: z.string().optional(),
  farming_experience: z.preprocess((v) => (v === '' ? undefined : Number(v)), z.number().int().min(0).max(80).optional()),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [successMsg, setSuccessMsg] = useState(false);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const data = await api.get<Profile>('/api/profile');
        reset({
          full_name: data.full_name,
          phone: data.phone || '',
          preferred_language: data.preferred_language || 'en',
          state: data.state || '',
          district: data.district || '',
          taluka: data.taluka || '',
          village: data.village || '',
          farming_experience: data.farming_experience || 0,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [reset]);

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      setSuccessMsg(false);
      await api.patch('/api/profile', values);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Farmer Profile & Identification</h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Maintain your verified official agricultural records, contact info, and regional jurisdiction.
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Profile changes saved and synchronized with Agriculture Department records.</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-6 space-y-6">
        <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-agri-600 to-emerald-400 text-white font-bold text-lg flex items-center justify-center shadow-glow">
            {user?.fullName?.charAt(0) || 'F'}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">{user?.fullName}</h3>
            <span className="text-xs text-slate-500">{user?.email}</span>
            <div className="mt-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Full Legal Name *
            </label>
            <input type="text" {...register('full_name')} className="input-field text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Mobile Contact Number
            </label>
            <input type="tel" {...register('phone')} className="input-field text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              State
            </label>
            <input type="text" {...register('state')} className="input-field text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              District
            </label>
            <input type="text" {...register('district')} className="input-field text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Farming Experience (Years)
            </label>
            <input type="number" {...register('farming_experience')} className="input-field text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Preferred Language for Advisories
            </label>
            <select {...register('preferred_language')} className="input-field text-sm">
              <option value="en">English</option>
              <option value="hi">Hindi (हिंदी)</option>
              <option value="pa">Punjabi (ਪੰਜਾਬੀ)</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary text-xs px-6 py-2.5 flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
