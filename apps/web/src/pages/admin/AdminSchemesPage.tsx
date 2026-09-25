import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Landmark, Plus, Trash2 } from 'lucide-react';
import { api } from '../../lib/api.js';
import { Scheme } from '../../types/index.js';

const schemeSchema = z.object({
  name: z.string().min(3, 'Name is required'),
  description: z.string().min(10, 'Description is required'),
  department: z.string().optional(),
  benefits: z.string().optional(),
  eligibility: z.string().optional(),
  official_source: z.string().url().optional().or(z.literal('')),
});

type SchemeFormValues = z.infer<typeof schemeSchema>;

export const AdminSchemesPage: React.FC = () => {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<SchemeFormValues>({
    resolver: zodResolver(schemeSchema),
  });

  const loadSchemes = async () => {
    try {
      setLoading(true);
      const data = await api.get<Scheme[]>('/api/schemes');
      setSchemes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchemes();
  }, []);

  const onSubmit = async (values: SchemeFormValues) => {
    try {
      await api.post('/api/schemes', values);
      reset();
      setShowAdd(false);
      loadSchemes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/schemes/${id}`);
      setSchemes((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Landmark className="w-6 h-6 text-purple-600" />
            <span>Government Schemes Registry</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Publish verified central and state agricultural support schemes.
          </p>
        </div>

        <button
          onClick={() => setShowAdd(!showAdd)}
          className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Scheme</span>
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-6 space-y-4 border-purple-300 bg-purple-50/20">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
            Add Verified Scheme
          </h3>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Scheme Name *</label>
            <input type="text" {...register('name')} placeholder="e.g. Kisan Credit Card Scheme" className="input-field text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Department</label>
            <input type="text" {...register('department')} placeholder="Ministry of Agriculture" className="input-field text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Summary Description *</label>
            <textarea rows={2} {...register('description')} className="input-field text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Benefits</label>
              <textarea rows={2} {...register('benefits')} className="input-field text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Eligibility Criteria</label>
              <textarea rows={2} {...register('eligibility')} className="input-field text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Official Reference URL</label>
            <input type="url" {...register('official_source')} placeholder="https://..." className="input-field text-sm" />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={() => setShowAdd(false)} className="btn-secondary text-xs">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary text-xs px-4 py-2">
              Save Scheme
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {schemes.map((s) => (
          <div key={s.id} className="glass-card p-5 space-y-2 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{s.name}</h3>
                <span className="text-xs text-slate-500">{s.department || 'Ministry of Agriculture'}</span>
              </div>
              <button
                onClick={() => handleDelete(s.id)}
                className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                title="Delete Scheme"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
