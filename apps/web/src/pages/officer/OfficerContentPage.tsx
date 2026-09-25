import React from 'react';
import { FileText, BookOpen, ExternalLink, Sparkles } from 'lucide-react';

export const OfficerContentPage: React.FC = () => {
  const bulletins = [
    {
      title: 'Package of Practices for Rabi Crops (Punjab Agricultural University Guidelines)',
      category: 'Agronomic Protocol',
      date: '2026-09-15',
      summary: 'Standard recommendations for seed rate, row spacing, basal fertilizer placement, and irrigation cycles for wheat varieties HD-3086 and PBW-824.',
    },
    {
      title: 'Integrated Pest Management Protocol for Cotton Whitefly and Pink Bollworm',
      category: 'IPM Guideline',
      date: '2026-09-01',
      summary: 'Action thresholds, pheromone trap installation rates, and approved bio-pesticides for preventing resistance development in cotton-growing tracts.',
    },
    {
      title: 'Guidelines on Micro-Irrigation Maintenance and Acid Flushing for Drip Emitters',
      category: 'Water Management',
      date: '2026-08-20',
      summary: 'Step-by-step procedures for dissolving calcium and magnesium carbonate scale inside inline drip emitters using dilute phosphoric acid.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <FileText className="w-6 h-6 text-emerald-600" />
          <span>Agricultural Extension Content & Bulletins</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Official agronomic reference protocols, certified package of practices, and training bulletins for extension officers.
        </p>
      </div>

      <div className="space-y-4">
        {bulletins.map((b, i) => (
          <div key={i} className="glass-card p-6 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  {b.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{b.title}</h3>
              </div>
              <span className="text-xs text-slate-400">{b.date}</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {b.summary}
            </p>

            <div className="flex justify-end pt-1">
              <button className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>Read Full Technical Guide</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
