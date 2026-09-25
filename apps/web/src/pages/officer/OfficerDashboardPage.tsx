import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  LifeBuoy,
  Users,
  Sparkles,
  BellRing,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.js';
import { api } from '../../lib/api.js';
import { SupportCase, Advisory, Alert } from '../../types/index.js';
import { RiskBadge } from '../../components/agriculture/RiskBadge.js';

export const OfficerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [cases, setCases] = useState<SupportCase[]>([]);
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOfficerData() {
      try {
        setLoading(true);
        const [casesData, advData, alertsData] = await Promise.all([
          api.get<SupportCase[]>('/api/cases'),
          api.get<Advisory[]>('/api/advisories'),
          api.get<Alert[]>('/api/alerts'),
        ]);
        setCases(casesData);
        setAdvisories(advData);
        setAlerts(alertsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadOfficerData();
  }, []);

  const pendingCases = cases.filter((c) => c.status !== 'RESOLVED' && c.status !== 'CLOSED');

  return (
    <div className="space-y-6">
      {/* Officer Header Banner */}
      <div className="glass-card p-6 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white rounded-3xl border-0 shadow-lg">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-400/30">
            <Briefcase className="w-3.5 h-3.5" />
            District Agriculture Extension Officer Portal
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Officer Dashboard — {user?.fullName}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Jurisdiction: <strong>Ludhiana District, Punjab</strong>. Review AI-triaged farmer queries, provide official field inspection assessments, and publish regional crop alerts.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link to="/officer/cases" className="btn-primary text-xs py-2 px-4 shadow-glow flex items-center gap-1.5">
              <LifeBuoy className="w-4 h-4" />
              <span>Review Pending Cases ({pendingCases.length})</span>
            </Link>
            <Link to="/officer/alerts" className="btn-secondary text-xs py-2 px-4 bg-white/10 hover:bg-white/20 text-white border-white/20 flex items-center gap-1.5">
              <BellRing className="w-4 h-4 text-amber-300" />
              <span>Publish Agricultural Alert</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Officer KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Cases</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{cases.length}</div>
          <span className="text-[11px] text-emerald-600 font-semibold">{pendingCases.length} pending review</span>
        </div>
        <div className="glass-card p-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Farmers</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">24</div>
          <span className="text-[11px] text-slate-500 font-medium">Ludhiana East block</span>
        </div>
        <div className="glass-card p-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Advisories Audited</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{advisories.length}</div>
          <span className="text-[11px] text-emerald-600 font-semibold">100% verified</span>
        </div>
        <div className="glass-card p-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Bulletins</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{alerts.length}</div>
          <span className="text-[11px] text-amber-600 font-semibold">Heatwave & Rust alert</span>
        </div>
      </div>

      {/* Case Management Feed & Advisory Review */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">Priority Farmer Support Inquiries</h3>
            <Link to="/officer/cases" className="text-xs font-bold text-emerald-600 hover:underline">
              View All Cases
            </Link>
          </div>

          <div className="space-y-3">
            {cases.slice(0, 4).map((c) => (
              <div key={c.id} className="glass-card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-slate-900 text-sm">{c.case_number}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                      {c.status}
                    </span>
                    <RiskBadge level={c.priority} />
                  </div>
                  <span className="text-xs text-slate-400">{new Date(c.created_at).toLocaleDateString()}</span>
                </div>

                <div className="text-xs text-slate-800 font-semibold">
                  Farmer: {c.farmer?.full_name || 'Ramesh Kumar'} • Issue: {c.category}
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {c.description}
                </p>

                {c.ai_summary && (
                  <div className="p-3 rounded-xl bg-purple-50/70 text-xs text-purple-900 border border-purple-100">
                    <strong className="text-purple-800">AI Officer Dossier:</strong> {c.ai_summary}
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <Link
                    to={`/officer/cases/${c.id}`}
                    className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
                  >
                    <span>Inspect & Provide Assessment</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side: Quick Officer Actions & Alerts */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-base font-extrabold text-slate-900">Officer Quick Tools</h3>
          <div className="glass-card p-4 space-y-2">
            <Link
              to="/officer/alerts"
              className="p-3 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 block text-xs font-semibold text-amber-900 transition-colors"
            >
              Broadcast Emergency Weather/Pest Alert →
            </Link>
            <Link
              to="/officer/farmers"
              className="p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 block text-xs font-semibold text-emerald-900 transition-colors"
            >
              Browse Assigned Block Farmers →
            </Link>
            <Link
              to="/officer/advisories"
              className="p-3 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 block text-xs font-semibold text-sky-900 transition-colors"
            >
              Audit Live AI Crop Recommendations →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
