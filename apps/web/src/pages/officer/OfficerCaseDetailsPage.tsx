import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LifeBuoy, ArrowLeft, CheckCircle2, UserCheck, Save } from 'lucide-react';
import { api } from '../../lib/api.js';
import { SupportCase } from '../../types/index.js';
import { RiskBadge } from '../../components/agriculture/RiskBadge.js';

export const OfficerCaseDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [caseItem, setCaseItem] = useState<SupportCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [officerNotes, setOfficerNotes] = useState('');
  const [resolution, setResolution] = useState('');
  const [status, setStatus] = useState<string>('IN_REVIEW');
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    async function loadCase() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await api.get<SupportCase>(`/api/cases/${id}`);
        setCaseItem(data);
        setOfficerNotes(data.officer_notes || '');
        setResolution(data.resolution || '');
        setStatus(data.status);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCase();
  }, [id]);

  const handleSaveAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      setIsSaving(true);
      setSuccessMsg(false);
      const updated = await api.patch<SupportCase>(`/api/officer/cases/${id}`, {
        officer_notes: officerNotes,
        resolution,
        status,
      });
      setCaseItem(updated);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500 text-sm">Loading case dossier...</div>;
  if (!caseItem) return <div className="p-12 text-center text-slate-500 text-sm">Case not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/officer/cases')}
        className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Case Queue</span>
      </button>

      <div className="glass-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-extrabold text-slate-900">{caseItem.case_number}</h2>
              <RiskBadge level={caseItem.priority} />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Farmer: <strong>{caseItem.farmer?.full_name || 'Ramesh Kumar'}</strong> • Category: {caseItem.category}
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-800 self-start sm:self-auto border border-slate-200">
            Current: {caseItem.status}
          </span>
        </div>

        {/* Farmer's original report */}
        <div className="space-y-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Farmer Submission:</h4>
          <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed">
            {caseItem.description}
          </p>
        </div>

        {/* AI Briefing for Officers */}
        {caseItem.ai_summary && (
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-1">
            <span className="text-[11px] font-bold text-purple-900 uppercase tracking-wider block">
              AI Triage Briefing & Diagnostic Suggestions
            </span>
            <p className="text-xs text-purple-950 leading-relaxed font-medium">
              {caseItem.ai_summary}
            </p>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Assessment recorded. Farmer has been notified.</span>
          </div>
        )}

        {/* Officer Assessment Form */}
        <form onSubmit={handleSaveAssessment} className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              Official Assessment & Action Directives
            </h3>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Case Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="input-field text-sm"
            >
              <option value="OPEN">OPEN</option>
              <option value="ASSIGNED">ASSIGNED</option>
              <option value="IN_REVIEW">IN_REVIEW</option>
              <option value="WAITING_FOR_FARMER">WAITING_FOR_FARMER</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Officer Clinical / Field Notes
            </label>
            <textarea
              rows={3}
              value={officerNotes}
              onChange={(e) => setOfficerNotes(e.target.value)}
              placeholder="Record your observation, verified pathogen strain, or field inspection notes..."
              className="input-field text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Official Resolution & Treatment Directives (Sent to Farmer)
            </label>
            <textarea
              rows={3}
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              placeholder="Specify recommended cultural practices, approved bio-agents, or verification outcome..."
              className="input-field text-sm"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="btn-primary text-xs px-6 py-2.5 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Recording...' : 'Update & Issue Assessment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
