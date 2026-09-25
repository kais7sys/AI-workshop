import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  MapPin,
  LifeBuoy,
  BellRing,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Bug,
  PlusCircle,
  FileCheck,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.js';
import { api } from '../../lib/api.js';
import { WeatherCard } from '../../components/agriculture/WeatherCard.js';
import { RiskBadge } from '../../components/agriculture/RiskBadge.js';
import { AdvisoryResultModal } from '../../components/agriculture/AdvisoryResultModal.js';
import { Farm, Advisory, Alert } from '../../types/index.js';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAdvisory, setSelectedAdvisory] = useState<Advisory | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [farmsData, advData, alertsData] = await Promise.all([
          api.get<Farm[]>('/api/farms'),
          api.get<Advisory[]>('/api/advisories'),
          api.get<Alert[]>('/api/alerts'),
        ]);
        setFarms(farmsData);
        setAdvisories(advData);
        setAlerts(alertsData);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="glass-card p-6 bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 text-white rounded-3xl border-0 shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            Verified Farmer Account
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Welcome back, {user?.fullName}!
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Your fields in <strong>Ludhiana, Punjab</strong> are under active monitoring. Heatwave advisory is in effect. Check stage-specific water requirements below.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/advisory"
              className="btn-primary text-xs py-2 px-4 shadow-glow flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Get AI Crop Advisory</span>
            </Link>
            <Link
              to="/disease-assistant"
              className="btn-secondary text-xs py-2 px-4 bg-white/10 hover:bg-white/20 text-white border-white/20 flex items-center gap-1.5"
            >
              <Bug className="w-4 h-4 text-amber-300" />
              <span>Diagnose Symptoms</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Grid: Weather & Key Agronomic Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <WeatherCard location="Ludhiana Agricultural Block, Punjab" />
        </div>

        <div className="lg:col-span-4 grid grid-cols-2 gap-4">
          <div className="glass-card p-4 flex flex-col justify-between">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">{farms.length || 1}</div>
              <div className="text-xs text-slate-500 font-medium">Registered Farms</div>
            </div>
            <Link to="/farms" className="text-[11px] font-bold text-emerald-600 mt-2 flex items-center gap-1 hover:underline">
              <span>View details</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="glass-card p-4 flex flex-col justify-between">
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-2">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">{advisories.length}</div>
              <div className="text-xs text-slate-500 font-medium">Advisories Received</div>
            </div>
            <Link to="/advisory/history" className="text-[11px] font-bold text-sky-600 mt-2 flex items-center gap-1 hover:underline">
              <span>History</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="glass-card p-4 flex flex-col justify-between">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2">
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">{alerts.length}</div>
              <div className="text-xs text-slate-500 font-medium">Regional Alerts</div>
            </div>
            <Link to="/alerts" className="text-[11px] font-bold text-amber-600 mt-2 flex items-center gap-1 hover:underline">
              <span>Check warnings</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="glass-card p-4 flex flex-col justify-between">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-2">
              <LifeBuoy className="w-4 h-4" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">1</div>
              <div className="text-xs text-slate-500 font-medium">Officer Cases</div>
            </div>
            <Link to="/cases" className="text-[11px] font-bold text-purple-600 mt-2 flex items-center gap-1 hover:underline">
              <span>Track cases</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Active Crop Watch & Recent Advisories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Crops */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">Active Crop Cycles</h3>
            <Link to="/farms" className="text-xs font-bold text-emerald-600 hover:underline">
              Manage Farms
            </Link>
          </div>

          <div className="glass-card p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  Rabi 2026 Season
                </span>
                <h4 className="text-lg font-bold text-slate-900 mt-1">Wheat (HD-3086)</h4>
                <p className="text-xs text-slate-500">Field: North Wheat Field • 7.0 Acres</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-800">Milking Stage</span>
                <span className="block text-[11px] text-slate-400">Harvest: Apr 2027</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Soil Condition:</span>
                <strong className="text-slate-800">Alluvial Loam (pH 6.8)</strong>
              </div>
              <div className="flex justify-between">
                <span>Irrigation Method:</span>
                <strong className="text-slate-800">Tube Well</strong>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/advisory"
                className="w-full btn-secondary text-xs py-2 flex items-center justify-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Run Stage Advisory for this Plot</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Advisories */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">Recent AI Crop Advisories</h3>
            <Link to="/advisory/history" className="text-xs font-bold text-emerald-600 hover:underline">
              View All ({advisories.length})
            </Link>
          </div>

          {advisories.length === 0 ? (
            <div className="glass-card p-8 text-center text-slate-500">
              <p className="text-xs">No advisories generated yet. Click below to request your first crop advisory!</p>
              <Link to="/advisory" className="btn-primary text-xs mt-3 inline-block">
                Create First Advisory
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {advisories.slice(0, 3).map((adv) => (
                <div
                  key={adv.id}
                  onClick={() => setSelectedAdvisory(adv)}
                  className="glass-card p-4 cursor-pointer hover:border-emerald-300 transition-all flex items-start justify-between gap-4"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {adv.input_data?.cropName || adv.input_data?.crop || 'Wheat Advisory'}
                      </span>
                      <RiskBadge level={adv.risk_level || adv.ai_response?.riskLevel} />
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {adv.ai_response?.summary}
                    </p>
                    <span className="text-[10px] text-slate-400 block pt-1">
                      {new Date(adv.created_at).toLocaleDateString()} • Confidence: {Math.round((adv.confidence || 0.85) * 100)}%
                    </span>
                  </div>
                  <button className="text-xs text-emerald-600 font-bold hover:underline shrink-0">
                    View Dossier
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Advisory Modal */}
      <AdvisoryResultModal
        advisory={selectedAdvisory}
        onClose={() => setSelectedAdvisory(null)}
      />
    </div>
  );
};
