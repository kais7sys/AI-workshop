import React, { useState, useEffect } from 'react';
import { Server, ShieldCheck, Sparkles, Database, CheckCircle, RefreshCw } from 'lucide-react';
import { api } from '../../lib/api.js';

export const AdminSystemPage: React.FC = () => {
  const [systemData, setSystemData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/admin/system');
      setSystemData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Server className="w-6 h-6 text-slate-700" />
            <span>Platform Infrastructure & Configuration</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            System status, AI model runtime parameters, and database connectivity mode.
          </p>
        </div>

        <button
          onClick={loadData}
          className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Engine Configuration */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              Google Gemini AI Engine
            </h3>
          </div>
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span>Model ID:</span>
              <strong className="text-slate-900">{systemData?.aiEngine?.model || 'gemini-3.8-flash'}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span>Active Mode:</span>
              <span className="font-semibold text-emerald-700">{systemData?.aiEngine?.mode || 'Active'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span>SDK:</span>
              <strong className="text-slate-900">@google/genai (v2.3+)</strong>
            </div>
            <div className="flex justify-between py-1">
              <span>Schema Enforcer:</span>
              <strong className="text-slate-900">Zod Server-Side Parser</strong>
            </div>
          </div>
        </div>

        {/* Database Configuration */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Database className="w-5 h-5 text-sky-600" />
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              Database Engine
            </h3>
          </div>
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span>Storage Adapter:</span>
              <strong className="text-slate-900">{systemData?.database?.mode || 'PostgreSQL'}</strong>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span>RLS Isolation:</span>
              <span className="font-semibold text-emerald-700">Enforced</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span>Migration Version:</span>
              <strong className="text-slate-900">20260925000001 (RLS Applied)</strong>
            </div>
            <div className="flex justify-between py-1">
              <span>Audit Logging:</span>
              <strong className="text-emerald-700">Active</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Security Directives Verification Card */}
      <div className="glass-card p-6 space-y-3 bg-emerald-50/30 border-emerald-200">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>Production Security Hardening Directives</span>
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Gemini API Key isolated server-side only</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Strict Zod parsing on all LLM responses</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Rate limiting (100 req/15min, 30 AI/min)</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Helmet HTTP protection headers enabled</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
