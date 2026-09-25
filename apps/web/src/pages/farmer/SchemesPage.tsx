import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Landmark, Search, ExternalLink, ArrowRight, CheckCircle2 } from 'lucide-react';
import { api } from '../../lib/api.js';
import { Scheme } from '../../types/index.js';

export const SchemesPage: React.FC = () => {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadSchemes() {
      try {
        setLoading(true);
        const data = await api.get<Scheme[]>(
          searchQuery ? `/api/schemes?q=${encodeURIComponent(searchQuery)}` : '/api/schemes'
        );
        setSchemes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSchemes();
  }, [searchQuery]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Government Agricultural Schemes</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Verified subsidies, insurance coverage, and financial assistance programs by the Ministry of Agriculture.
          </p>
        </div>

        {/* Search */}
        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search schemes by name or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-9 py-2 text-xs"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 text-sm">Searching scheme database...</div>
      ) : schemes.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-500 space-y-2">
          <Landmark className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold">No schemes found matching "{searchQuery}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {schemes.map((s) => (
            <div key={s.id} className="glass-card p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-bold text-slate-900 leading-snug">{s.name}</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider shrink-0">
                    Active
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {s.department || 'Ministry of Agriculture'}
                </div>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {s.description}
                </p>
              </div>

              {s.benefits && (
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-950 space-y-1">
                  <strong className="block text-[11px] font-bold text-emerald-800 uppercase">Benefits:</strong>
                  <p className="line-clamp-2">{s.benefits}</p>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                {s.official_source ? (
                  <a
                    href={s.official_source}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-500 hover:text-emerald-700 flex items-center gap-1 font-medium"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : <span />}

                <Link
                  to={`/schemes/${s.id}`}
                  className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
                >
                  <span>Details & Eligibility</span>
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
