import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, ArrowLeft, MapPin, Sprout, LifeBuoy } from 'lucide-react';
import { api } from '../../lib/api.js';
import { Profile, Farm, Advisory } from '../../types/index.js';
import { RiskBadge } from '../../components/agriculture/RiskBadge.js';

export const OfficerFarmerDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        setLoading(true);
        const [users, farmsData, advData] = await Promise.all([
          api.get<Profile[]>('/api/admin/users'),
          api.get<Farm[]>(`/api/farms?ownerId=${id}`),
          api.get<Advisory[]>('/api/advisories'),
        ]);
        const target = users.find((u) => u.id === id);
        setProfile(target || null);
        setFarms(farmsData);
        setAdvisories(advData.filter((a) => a.farmer_id === id));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) return <div className="p-12 text-center text-slate-500 text-sm">Loading farmer portfolio...</div>;
  if (!profile) return <div className="p-12 text-center text-slate-500 text-sm">Farmer record not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/officer/farmers')}
        className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Block Farmers</span>
      </button>

      {/* Farmer Summary Card */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 font-extrabold text-xl flex items-center justify-center">
            {profile.full_name.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">{profile.full_name}</h2>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{profile.village || 'Sidwan Bet'}, {profile.district || 'Ludhiana'}, {profile.state || 'Punjab'}</span>
            </p>
            <div className="text-xs text-slate-600 mt-1 font-medium">
              Phone: {profile.phone || '+91 98765 43210'} • Experience: {profile.farming_experience || 15} years
            </div>
          </div>
        </div>
      </div>

      {/* Registered Holdings */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 text-base">Registered Farms & Plots</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {farms.map((f) => (
            <div key={f.id} className="glass-card p-4 space-y-2">
              <div className="flex justify-between">
                <span className="font-bold text-slate-900 text-sm">{f.name}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {f.area} {f.area_unit || 'acre'}
                </span>
              </div>
              <div className="text-xs text-slate-500">
                <div>Soil: {f.soil_type || 'Loam'} (pH {f.soil_ph || 6.8})</div>
                <div>Irrigation: {f.irrigation_type || 'Tube well'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Advisories */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 text-base">AI Advisories Generated for Farmer</h3>
        <div className="space-y-3">
          {advisories.map((a) => (
            <div key={a.id} className="glass-card p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">{a.input_data?.cropName || 'Crop'}</span>
                <RiskBadge level={a.risk_level} />
              </div>
              <p className="text-xs text-slate-600">{a.ai_response?.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
