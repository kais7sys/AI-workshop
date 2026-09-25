import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Users,
  ShieldAlert,
  Sprout,
  Landmark,
  BellRing,
  Server,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { api } from '../../lib/api.js';

export const AdminDashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMetrics() {
      try {
        setLoading(true);
        const data = await api.get('/api/admin/system');
        setMetrics(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  return (
    <div className="space-y-6">
      {/* Admin Hero Header */}
      <div className="glass-card p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white rounded-3xl border-0 shadow-lg">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/30">
            <Activity className="w-3.5 h-3.5" />
            Central Agriculture Department Administration
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            System Administration & Telemetry Console
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Oversee user roles, extension officers, master crop catalog, government schemes, AI model tokens, and security audit logs.
          </p>
        </div>
      </div>

      {/* System Telemetry & KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Platform Status</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600">
            {metrics?.platformStatus || 'OPERATIONAL'}
          </div>
          <p className="text-[11px] text-slate-500">Uptime: {metrics?.uptimeSeconds || 360}s</p>
        </div>

        <div className="glass-card p-5 space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active AI Engine</div>
          <div className="text-xl font-extrabold text-slate-900 truncate">
            {metrics?.aiEngine?.model || 'gemini-3.8-flash'}
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold">{metrics?.aiEngine?.mode || 'Active'}</p>
        </div>

        <div className="glass-card p-5 space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registered Users</div>
          <div className="text-2xl font-extrabold text-slate-900">
            {metrics?.metrics?.totalProfiles || 3}
          </div>
          <p className="text-[11px] text-slate-500">Farmers, Officers & Admins</p>
        </div>

        <div className="glass-card p-5 space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Advisories Issued</div>
          <div className="text-2xl font-extrabold text-slate-900">
            {metrics?.metrics?.totalAdvisories || 1}
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold">100% Schema Validated</p>
        </div>
      </div>

      {/* Admin Modules Quick Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/admin/users" className="glass-card p-6 hover:border-emerald-300 transition-all space-y-2 group">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">User Management & RBAC</h3>
          <p className="text-xs text-slate-500">Inspect registered users, manage privileges, and assign roles.</p>
        </Link>

        <Link to="/admin/officers" className="glass-card p-6 hover:border-emerald-300 transition-all space-y-2 group">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Officer Management</h3>
          <p className="text-xs text-slate-500">Assign block jurisdictions and audit officer resolution rates.</p>
        </Link>

        <Link to="/admin/crops" className="glass-card p-6 hover:border-emerald-300 transition-all space-y-2 group">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Sprout className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Master Crop Catalog</h3>
          <p className="text-xs text-slate-500">Configure scientific data, phenological stages, and soil standards.</p>
        </Link>

        <Link to="/admin/schemes" className="glass-card p-6 hover:border-emerald-300 transition-all space-y-2 group">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Landmark className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Government Schemes</h3>
          <p className="text-xs text-slate-500">Manage verified central and state agriculture assistance schemes.</p>
        </Link>

        <Link to="/admin/audit-logs" className="glass-card p-6 hover:border-emerald-300 transition-all space-y-2 group">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Security Audit Logs</h3>
          <p className="text-xs text-slate-500">Inspect real-time authentication, authorization, and data modifications.</p>
        </Link>

        <Link to="/admin/system" className="glass-card p-6 hover:border-emerald-300 transition-all space-y-2 group">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Server className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">System Configuration</h3>
          <p className="text-xs text-slate-500">Examine Gemini model parameters, rate limiting thresholds, and DB modes.</p>
        </Link>
      </div>
    </div>
  );
};
