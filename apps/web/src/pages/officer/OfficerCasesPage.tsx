import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LifeBuoy, ArrowRight, Filter, Search } from 'lucide-react';
import { api } from '../../lib/api.js';
import { SupportCase } from '../../types/index.js';
import { RiskBadge } from '../../components/agriculture/RiskBadge.js';

export const OfficerCasesPage: React.FC = () => {
  const [cases, setCases] = useState<SupportCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    async function loadCases() {
      try {
        setLoading(true);
        const data = await api.get<SupportCase[]>('/api/cases');
        setCases(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCases();
  }, []);

  const filtered = cases.filter((c) => {
    if (statusFilter === 'ALL') return true;
    return c.status === statusFilter;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Farmer Support Case Queue</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Review farmer problem reports, inspect automated AI briefings, and issue binding agricultural guidance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field text-xs py-2 w-44"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open (New)</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="WAITING_FOR_FARMER">Waiting on Farmer</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 text-sm">Loading case queue...</div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-500 space-y-2">
          <p className="text-sm font-semibold">No cases matching "{statusFilter}".</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((c) => (
            <div key={c.id} className="glass-card p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-slate-900 text-base">{c.case_number}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                    {c.status}
                  </span>
                  <RiskBadge level={c.priority} />
                </div>
                <span className="text-xs text-slate-400">{new Date(c.created_at).toLocaleDateString()}</span>
              </div>

              <div className="text-xs text-slate-800 font-semibold">
                Farmer: {c.farmer?.full_name || 'Ramesh Kumar'} • Issue Category: {c.category}
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {c.description}
              </p>

              {c.ai_summary && (
                <div className="p-3 rounded-xl bg-purple-50/70 text-xs text-purple-900 border border-purple-100">
                  <strong className="text-purple-800">AI Officer Summary:</strong> {c.ai_summary}
                </div>
              )}

              {c.officer_notes && (
                <div className="p-3 rounded-xl bg-emerald-50/60 text-xs text-emerald-900 border border-emerald-100">
                  <strong className="text-emerald-800">Officer Assessment:</strong> {c.officer_notes}
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <Link
                  to={`/officer/cases/${c.id}`}
                  className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
                >
                  <span>Review & Update Case</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
