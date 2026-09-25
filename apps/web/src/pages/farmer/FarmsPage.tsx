import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Plus, ArrowRight, Layers, Droplets } from 'lucide-react';
import { api } from '../../lib/api.js';
import { Farm } from '../../types/index.js';

export const FarmsPage: React.FC = () => {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFarms() {
      try {
        setLoading(true);
        const data = await api.get<Farm[]>('/api/farms');
        setFarms(data);
      } catch (err) {
        console.error('Failed to load farms', err);
      } finally {
        setLoading(false);
      }
    }
    loadFarms();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Farm & Field Holdings</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage your registered agricultural land holdings, soil classifications, and irrigation systems.
          </p>
        </div>
        <Link to="/farms/new" className="btn-primary text-xs py-2.5 px-4 flex items-center gap-1.5 self-start">
          <Plus className="w-4 h-4" />
          <span>Register New Farm</span>
        </Link>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 text-sm">Loading registered holdings...</div>
      ) : farms.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-500 space-y-3">
          <MapPin className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="font-bold text-slate-800 text-sm">No Farms Registered</h4>
          <p className="text-xs text-slate-500">Register your first farm to unlock automated advisory tailored to your plots.</p>
          <Link to="/farms/new" className="btn-primary text-xs inline-block mt-2">
            Register Farm
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {farms.map((f) => (
            <div key={f.id} className="glass-card p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-bold text-slate-900">{f.name}</h3>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    {f.area || 0} {f.area_unit || 'acre'}
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{f.village || ''}, {f.district || ''}, {f.state || ''}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-slate-100">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Soil Type & pH</span>
                  <span className="font-bold text-slate-800">{f.soil_type || 'Loam'} (pH {f.soil_ph || 6.8})</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Irrigation</span>
                  <span className="font-bold text-slate-800">{f.irrigation_type || 'Tube well'}</span>
                </div>
              </div>

              {/* Sub-fields preview */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Registered Fields ({f.fields?.length || 0})
                </span>
                <div className="space-y-1">
                  {f.fields?.map((field) => (
                    <div key={field.id} className="text-xs p-2 rounded-lg bg-emerald-50/50 text-emerald-900 flex justify-between">
                      <span>{field.name}</span>
                      <span className="font-semibold">{field.area || 0} acres</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                to={`/farms/${f.id}`}
                className="btn-secondary text-xs py-2 w-full flex items-center justify-center gap-1 mt-2"
              >
                <span>View Full Details & Add Fields</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
