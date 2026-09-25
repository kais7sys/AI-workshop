import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LifeBuoy, Plus, ArrowRight, UserCheck, Clock, CheckCircle } from 'lucide-react';
import { api } from '../../lib/api.js';
import { SupportCase } from '../../types/index.js';
import { RiskBadge } from '../../components/agriculture/RiskBadge.js';

export const CasesPage: React.FC = () => {
  const [cases, setCases] = useState<SupportCase[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <LifeBuoy className="w-6 h-6 text-purple-600" />
            <span>Agriculture Officer Support Cases</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Escalate complex agricultural issues directly to your assigned Block Agriculture Extension Officers.
          </p>
        </div>
        <Link to="/cases/new" className="btn-primary text-xs py-2.5 px-4 flex items-center gap-1.5 self-start">
          <Plus className="w-4 h-4" />
          <span>Open New Support Case</span>
        </Link>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 text-sm">Loading support cases...</div>
      ) : cases.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-500 space-y-3">
          <LifeBuoy className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="font-bold text-slate-800 text-sm">No Active Support Requests</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Need physical field inspection or official verification? Create a support request and an Agriculture Officer will review it.
          </p>
          <Link to="/cases/new" className="btn-primary text-xs inline-block mt-2">
            Submit Support Request
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {cases.map((c) => (
            <div key={c.id} className="glass-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900 text-base">{c.case_number}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                    {c.status}
                  </span>
                  <RiskBadge level={c.priority} />
                </div>
                <div className="text-xs font-semibold text-emerald-800">
                  Category: {c.category}
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {c.description}
                </p>

                {/* AI Briefing Preview */}
                {c.ai_summary && (
                  <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100 text-xs text-purple-900">
                    <strong className="text-purple-800">AI Officer Summary:</strong> {c.ai_summary}
                  </div>
                )}

                <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                  <span>Created: {new Date(c.created_at).toLocaleDateString()}</span>
                  <span>Assigned Officer: {c.assigned_officer?.full_name || 'Dr. Ananya Sharma'}</span>
                </div>
              </div>

              <Link
                to={`/cases/${c.id}`}
                className="btn-secondary text-xs py-2 px-3 self-start sm:self-auto flex items-center gap-1 shrink-0"
              >
                <span>View Status & Notes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
