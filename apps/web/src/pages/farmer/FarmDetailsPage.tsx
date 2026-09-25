import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Plus, ArrowLeft, Layers, Droplets, Trash2, Sprout } from 'lucide-react';
import { api } from '../../lib/api.js';
import { Farm, Field } from '../../types/index.js';

export const FarmDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [farm, setFarm] = useState<Farm | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddField, setShowAddField] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldArea, setNewFieldArea] = useState(2.5);

  useEffect(() => {
    async function loadFarm() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await api.get<Farm>(`/api/farms/${id}`);
        setFarm(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadFarm();
  }, [id]);

  const handleAddField = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newFieldName.trim()) return;

    try {
      const field = await api.post<Field>(`/api/farms/${id}/fields`, {
        name: newFieldName,
        area: Number(newFieldArea),
        soil_type: farm?.soil_type,
        soil_ph: farm?.soil_ph,
        irrigation_type: farm?.irrigation_type,
      });

      setFarm((prev) => (prev ? { ...prev, fields: [...(prev.fields || []), field] } : prev));
      setNewFieldName('');
      setShowAddField(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500 text-sm">Loading farm details...</div>;
  if (!farm) return <div className="p-12 text-center text-slate-500 text-sm">Farm not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/farms')}
        className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Holdings</span>
      </button>

      {/* Farm Overview Card */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{farm.name}</h2>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>{farm.village || ''}, {farm.taluka || ''}, {farm.district || ''}, {farm.state || ''}</span>
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 self-start sm:self-auto">
            {farm.area} {farm.area_unit || 'acre'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Soil Type</span>
            <span className="font-bold text-slate-800">{farm.soil_type || 'Loam'}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Soil pH</span>
            <span className="font-bold text-slate-800">{farm.soil_ph || 6.8}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Irrigation System</span>
            <span className="font-bold text-slate-800">{farm.irrigation_type || 'Tube well'}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Registered Fields</span>
            <span className="font-bold text-slate-800">{farm.fields?.length || 0}</span>
          </div>
        </div>
      </div>

      {/* Fields Management */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900">Registered Fields in this Holding</h3>
          <button
            onClick={() => setShowAddField(true)}
            className="btn-primary text-xs py-2 px-3 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Field</span>
          </button>
        </div>

        {showAddField && (
          <form onSubmit={handleAddField} className="glass-card p-4 space-y-3 bg-emerald-50/40 border-emerald-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">New Field Registration</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Field Name *</label>
                <input
                  type="text"
                  required
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  placeholder="e.g. North Plot, Canal Plot"
                  className="input-field text-xs py-2"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Field Area (Acres) *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newFieldArea}
                  onChange={(e) => setNewFieldArea(Number(e.target.value))}
                  className="input-field text-xs py-2"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => setShowAddField(false)} className="btn-secondary text-xs py-1.5 px-3">
                Cancel
              </button>
              <button type="submit" className="btn-primary text-xs py-1.5 px-3">
                Save Field
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {farm.fields?.map((fld) => (
            <div key={fld.id} className="glass-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">{fld.name}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {fld.area || 0} acres
                </span>
              </div>
              <div className="text-xs text-slate-500 space-y-1">
                <div>Soil: {fld.soil_type || farm.soil_type || 'Loam'}</div>
                <div>Irrigation: {fld.irrigation_type || farm.irrigation_type || 'Standard'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
