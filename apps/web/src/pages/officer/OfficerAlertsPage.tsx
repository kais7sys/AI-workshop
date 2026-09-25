import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BellRing, Plus, CheckCircle2, AlertTriangle, Trash2 } from 'lucide-react';
import { api } from '../../lib/api.js';
import { Alert } from '../../types/index.js';
import { RiskBadge } from '../../components/agriculture/RiskBadge.js';

const alertSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  state: z.string().default('Punjab'),
  district: z.string().default('Ludhiana'),
  is_published: z.boolean().default(true),
});

type AlertFormValues = z.infer<typeof alertSchema>;

export const OfficerAlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<AlertFormValues>({
    resolver: zodResolver(alertSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'WEATHER',
      severity: 'HIGH',
      state: 'Punjab',
      district: 'Ludhiana',
      is_published: true,
    },
  });

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const data = await api.get<Alert[]>('/api/alerts');
      setAlerts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const onSubmit = async (values: AlertFormValues) => {
    try {
      await api.post('/api/alerts', values);
      setSuccessMsg(true);
      setShowCreate(false);
      reset();
      loadAlerts();
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/alerts/${id}`);
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BellRing className="w-6 h-6 text-amber-600" />
            <span>Regional Alert Dispatch Center</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Author and broadcast official meteorological alerts, pest outbreak warnings, and harvest advisories.
          </p>
        </div>

        <button
          onClick={() => setShowCreate(!showCreate)}
          className="btn-primary text-xs py-2.5 px-4 flex items-center gap-1.5 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Broadcast New Alert</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Alert successfully published and dispatched to registered farmers!</span>
        </div>
      )}

      {showCreate && (
        <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-6 space-y-4 border-amber-200 bg-amber-50/20">
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
            Compose New Departmental Alert
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Alert Headline / Title *
            </label>
            <input
              type="text"
              {...register('title')}
              placeholder="e.g. Yellow Rust Outbreak Warning in Ludhiana"
              className="input-field text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Category
              </label>
              <select {...register('category')} className="input-field text-sm">
                <option value="WEATHER">WEATHER (Heat, Storm, Rain)</option>
                <option value="PEST_DISEASE">PEST / DISEASE OUTBREAK</option>
                <option value="SCHEME_DEADLINE">SCHEME DEADLINE</option>
                <option value="DEPARTMENT_DIRECTIVE">DEPARTMENT DIRECTIVE</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Severity Level
              </label>
              <select {...register('severity')} className="input-field text-sm">
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL (Emergency)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">State</label>
              <input type="text" {...register('state')} className="input-field text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">District</label>
              <input type="text" {...register('district')} className="input-field text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Detailed Advisory & Mitigation Instructions *
            </label>
            <textarea
              rows={4}
              {...register('description')}
              placeholder="Explain the specific risks and actionable mitigation steps farmers must follow..."
              className="input-field text-sm"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary text-xs">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary text-xs px-6 py-2.5">
              {isSubmitting ? 'Publishing...' : 'Publish & Broadcast Alert'}
            </button>
          </div>
        </form>
      )}

      {/* Alert Feed */}
      <div className="space-y-4">
        {alerts.map((alt) => (
          <div key={alt.id} className="glass-card p-5 space-y-2 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-base">{alt.title}</h4>
                  <RiskBadge level={alt.severity} />
                </div>
                <button
                  onClick={() => handleDelete(alt.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete Alert"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{alt.description}</p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
              <span>Jurisdiction: {alt.district || ''}, {alt.state || 'All'}</span>
              <span>Published: {new Date(alt.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
