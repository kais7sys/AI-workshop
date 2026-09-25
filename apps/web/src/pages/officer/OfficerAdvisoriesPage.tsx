import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Search } from 'lucide-react';
import { api } from '../../lib/api.js';
import { Advisory } from '../../types/index.js';
import { RiskBadge } from '../../components/agriculture/RiskBadge.js';
import { AdvisoryResultModal } from '../../components/agriculture/AdvisoryResultModal.js';

export const OfficerAdvisoriesPage: React.FC = () => {
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdvisory, setSelectedAdvisory] = useState<Advisory | null>(null);

  useEffect(() => {
    async function loadAllAdvisories() {
      try {
        setLoading(true);
        const data = await api.get<Advisory[]>('/api/advisories');
        setAdvisories(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAllAdvisories();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-emerald-600" />
          <span>Regional AI Advisory Audit Stream</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Supervise and review AI-generated crop recommendations across your block to ensure agronomic accuracy and chemical safety compliance.
        </p>
      </div>

      <div className="space-y-4">
        {advisories.map((adv) => (
          <div
            key={adv.id}
            onClick={() => setSelectedAdvisory(adv)}
            className="glass-card p-5 cursor-pointer hover:border-emerald-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2.5">
                <span className="font-bold text-slate-900 text-sm">
                  {adv.input_data?.cropName || 'Crop Advisory'}
                </span>
                <RiskBadge level={adv.risk_level || adv.ai_response?.riskLevel} />
                <span className="text-xs text-slate-500">Stage: {adv.input_data?.growthStage}</span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2">{adv.ai_response?.summary}</p>
              <div className="text-[11px] text-slate-400">
                Confidence: {Math.round((adv.confidence || 0.85) * 100)}% • Model: {adv.model_name || 'Gemini 3.8 Flash'} • Date: {new Date(adv.created_at).toLocaleDateString()}
              </div>
            </div>
            <button className="btn-secondary text-xs py-1.5 px-3 shrink-0">
              Audit Dossier
            </button>
          </div>
        ))}
      </div>

      <AdvisoryResultModal
        advisory={selectedAdvisory}
        onClose={() => setSelectedAdvisory(null)}
      />
    </div>
  );
};
