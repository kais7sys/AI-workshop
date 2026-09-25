import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LifeBuoy, ArrowLeft, Sparkles } from 'lucide-react';
import { api } from '../../lib/api.js';
import { Farm } from '../../types/index.js';

const newCaseSchema = z.object({
  farm_id: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  description: z.string().min(10, 'Please describe your request in at least 10 characters'),
});

type NewCaseFormValues = z.infer<typeof newCaseSchema>;

export const NewCasePage: React.FC = () => {
  const navigate = useNavigate();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewCaseFormValues>({
    resolver: zodResolver(newCaseSchema),
    defaultValues: {
      category: 'Pest Infestation Inspection',
      priority: 'MEDIUM',
      description: '',
    },
  });

  useEffect(() => {
    async function loadFarms() {
      try {
        const data = await api.get<Farm[]>('/api/farms');
        setFarms(data);
      } catch (err) {
        console.error(err);
      }
    }
    loadFarms();
  }, []);

  const onSubmit = async (values: NewCaseFormValues) => {
    try {
      setErrorMsg(null);
      await api.post('/api/cases', values);
      navigate('/cases');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit case.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/cases')}
        className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Cases</span>
      </button>

      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Support Request</h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Your request will be summarized by AI for rapid briefing and assigned to the local District Agriculture Officer.
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
            Associated Farm (Optional)
          </label>
          <select {...register('farm_id')} className="input-field text-sm">
            <option value="">Select a farm...</option>
            {farms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.district}, {f.state})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Issue Category *
            </label>
            <select {...register('category')} className="input-field text-sm">
              <option value="Pest Infestation Inspection">Pest Infestation Inspection</option>
              <option value="Crop Pathology / Disease">Crop Pathology / Disease</option>
              <option value="Soil Health & Salinity">Soil Health & Salinity</option>
              <option value="Hailstorm / Drought Damage">Hailstorm / Drought Damage</option>
              <option value="Scheme Application Assistance">Scheme Application Assistance</option>
              <option value="General Agronomic Query">General Agronomic Query</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Urgency / Priority
            </label>
            <select {...register('priority')} className="input-field text-sm">
              <option value="LOW">Low - Routine</option>
              <option value="MEDIUM">Medium - Normal</option>
              <option value="HIGH">High - Urgent Action</option>
              <option value="URGENT">Critical - Severe Loss</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Detailed Issue Description *
          </label>
          <textarea
            rows={5}
            {...register('description')}
            placeholder="Describe the affected acreage, crop type, symptoms, treatments already attempted, and how the officer can assist..."
            className="input-field text-sm"
          />
          {errors.description && (
            <span className="text-xs text-rose-600 font-medium mt-1 block">{errors.description.message}</span>
          )}
        </div>

        <div className="pt-2 flex justify-end gap-3">
          <button type="button" onClick={() => navigate('/cases')} className="btn-secondary text-xs">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="btn-primary text-xs px-6 py-2.5">
            {isSubmitting ? 'Registering Case with AI...' : 'Submit Support Request'}
          </button>
        </div>
      </form>
    </div>
  );
};
