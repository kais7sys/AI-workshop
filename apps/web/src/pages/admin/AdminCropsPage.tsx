import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sprout, Plus, Trash2 } from 'lucide-react';
import { api } from '../../lib/api.js';
import { Crop } from '../../types/index.js';

const cropSchema = z.object({
  name: z.string().min(2, 'Crop name is required'),
  scientific_name: z.string().optional(),
  category: z.string().min(2, 'Category is required'),
  growing_season: z.string().optional(),
  description: z.string().optional(),
});

type CropFormValues = z.infer<typeof cropSchema>;

export const AdminCropsPage: React.FC = () => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CropFormValues>({
    resolver: zodResolver(cropSchema),
    defaultValues: {
      name: '',
      scientific_name: '',
      category: 'Cereal',
      growing_season: 'Rabi',
      description: '',
    },
  });

  const loadCrops = async () => {
    try {
      setLoading(true);
      const data = await api.get<Crop[]>('/api/crops');
      setCrops(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCrops();
  }, []);

  const onSubmit = async (values: CropFormValues) => {
    try {
      await api.post('/api/crops', values);
      reset();
      setShowAdd(false);
      loadCrops();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/crops/${id}`);
      setCrops((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Sprout className="w-6 h-6 text-emerald-600" />
            <span>Master Crops Catalog</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Define official crop profiles, scientific nomenclature, and growing season requirements.
          </p>
        </div>

        <button
          onClick={() => setShowAdd(!showAdd)}
          className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add Crop to Catalog</span>
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-6 space-y-4 border-emerald-300 bg-emerald-50/20">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
            Register New Crop in Master Catalog
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Common Name *</label>
              <input type="text" {...register('name')} placeholder="e.g. Barley" className="input-field text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Scientific Botanical Name</label>
              <input type="text" {...register('scientific_name')} placeholder="e.g. Hordeum vulgare" className="input-field text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
              <input type="text" {...register('category')} placeholder="e.g. Cereal, Pulse, Oilseed" className="input-field text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Growing Season</label>
              <input type="text" {...register('growing_season')} placeholder="e.g. Rabi (Oct-Mar)" className="input-field text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Agronomic Description</label>
            <textarea rows={2} {...register('description')} className="input-field text-sm" />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={() => setShowAdd(false)} className="btn-secondary text-xs">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary text-xs px-4 py-2">
              Save Crop
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {crops.map((c) => (
          <div key={c.id} className="glass-card p-5 space-y-2 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{c.name}</h3>
                  <span className="text-xs text-slate-500 italic block">{c.scientific_name || 'Species'}</span>
                </div>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  title="Delete Crop"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 pt-1">{c.description}</p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span>Category: <strong>{c.category}</strong></span>
              <span>Season: <strong>{c.growing_season || 'All year'}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
