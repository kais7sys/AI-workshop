import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Search, ArrowRight } from 'lucide-react';
import { api } from '../../lib/api.js';
import { Advisory } from '../../types/index.js';
import { RiskBadge } from '../../components/agriculture/RiskBadge.js';
import { AdvisoryResultModal } from '../../components/agriculture/AdvisoryResultModal.js';

export const AdvisoryHistoryPage: React.FC = () => {
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAdvisory, setSelectedAdvisory] = useState<Advisory | null>(null);

  useEffect(() => {
    async function loadHistory() {
      try {
        setLoading(true);
        const data = await api.get<Advisory[]>('/api/advisories');
        setAdvisories(data);
      } catch (err) {
        console.error('Failed to load history', err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  const filtered = advisories.filter((a) => {
    const text = `${a.input_data?.cropName || ''} ${a.ai_response?.summary || ''} ${a.question || ''}`.toLowerCase();
    return text.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Advisory Consultation History</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Review your previously generated AI crop dossiers, risk evaluations, and recommendations.
          </p>
        </div>

        {/* Search */}
        <div className="w-full sm:w-64 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search advisories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-9 py-2 text-xs"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 text-sm">Loading advisory archive...</div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-500 space-y-2">
          <p className="text-sm">No consultation records matching your query.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((adv) => (
            <div
              key={adv.id}
              onClick={() => setSelectedAdvisory(adv)}
              className="glass-card p-5 cursor-pointer hover:border-emerald-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-slate-900 text-base">
                    {adv.input_data?.cropName || 'Crop Advisory'}
                  </span>
                  <RiskBadge level={adv.risk_level || adv.ai_response?.riskLevel} />
                  <span className="text-xs text-slate-500">
                    Stage: {adv.input_data?.growthStage || 'N/A'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {adv.ai_response?.summary}
                </p>
                <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(adv.created_at).toLocaleDateString()}
                  </span>
                  <span>Confidence: {Math.round((adv.confidence || 0.85) * 100)}%</span>
                  <span>Model: {adv.model_name || 'Gemini 3.8 Flash'}</span>
                </div>
              </div>

              <button className="btn-secondary text-xs py-2 px-3 self-start sm:self-auto flex items-center gap-1">
                <span>View Full Dossier</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
              </button>
            </div>
          ))}
        </div>
      )}

      <AdvisoryResultModal
        advisory={selectedAdvisory}
        onClose={() => setSelectedAdvisory(null)}
      />
    </div>
  );
};
