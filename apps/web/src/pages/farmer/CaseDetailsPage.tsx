import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LifeBuoy, ArrowLeft, UserCheck, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';
import { api } from '../../lib/api.js';
import { SupportCase } from '../../types/index.js';
import { RiskBadge } from '../../components/agriculture/RiskBadge.js';

export const CaseDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [caseItem, setCaseItem] = useState<SupportCase | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCase() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await api.get<SupportCase>(`/api/cases/${id}`);
        setCaseItem(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCase();
  }, [id]);

  if (loading) return <div className="p-12 text-center text-slate-500 text-sm">Loading case details...</div>;
  if (!caseItem) return <div className="p-12 text-center text-slate-500 text-sm">Case record not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/cases')}
        className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Support Cases</span>
      </button>

      <div className="glass-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-extrabold text-slate-900">{caseItem.case_number}</h2>
              <RiskBadge level={caseItem.priority} />
            </div>
            <p className="text-xs text-slate-500 mt-1">Category: {caseItem.category}</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-800 self-start sm:self-auto border border-slate-200">
            Status: {caseItem.status}
          </span>
        </div>

        {/* Farmer's original description */}
        <div className="space-y-2">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Farmer Problem Statement</h3>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed">
            {caseItem.description}
          </div>
        </div>

        {/* AI Briefing for Officers */}
        {caseItem.ai_summary && (
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-1">
            <span className="text-[11px] font-bold text-purple-900 uppercase tracking-wider block">
              Automated AI Officer Dossier & Briefing
            </span>
            <p className="text-xs text-purple-950 leading-relaxed">
              {caseItem.ai_summary}
            </p>
          </div>
        )}

        {/* Officer Official Assessment & Notes */}
        {caseItem.officer_notes && (
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 text-emerald-800">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Officer Assessment & Directives</span>
            </h3>
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs sm:text-sm text-slate-800 leading-relaxed">
              {caseItem.officer_notes}
            </div>
          </div>
        )}

        {/* Official Resolution */}
        {caseItem.resolution && (
          <div className="p-4 rounded-2xl bg-emerald-100/60 border border-emerald-300 space-y-1">
            <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              Official Case Resolution Protocol
            </span>
            <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed font-medium">
              {caseItem.resolution}
            </p>
          </div>
        )}

        {/* Case Meta Footer */}
        <div className="pt-4 border-t border-slate-100 text-xs text-slate-400 flex flex-wrap justify-between gap-2">
          <span>Submitted on: {new Date(caseItem.created_at).toLocaleString()}</span>
          <span>Assigned Officer: {caseItem.assigned_officer?.full_name || 'Dr. Ananya Sharma'}</span>
        </div>
      </div>
    </div>
  );
};
