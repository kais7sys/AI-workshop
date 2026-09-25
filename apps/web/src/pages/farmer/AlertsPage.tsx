import React, { useState, useEffect } from 'react';
import { BellRing, AlertTriangle, Calendar, MapPin, Filter } from 'lucide-react';
import { api } from '../../lib/api.js';
import { Alert } from '../../types/index.js';
import { RiskBadge } from '../../components/agriculture/RiskBadge.js';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  useEffect(() => {
    async function loadAlerts() {
      try {
        setLoading(true);
        const data = await api.get<Alert[]>('/api/alerts');
        setAlerts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAlerts();
  }, []);

  const filtered = alerts.filter((a) => {
    if (filterSeverity === 'ALL') return true;
    return a.severity === filterSeverity;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BellRing className="w-6 h-6 text-amber-600" />
            <span>Regional Agricultural Alerts & Warnings</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time meteorological warnings, pathogen outbreaks, and pest surveillance bulletins issued by the Agriculture Department.
          </p>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="input-field text-xs py-2 w-36"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 text-sm">Loading departmental alerts...</div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-500 space-y-2">
          <p className="text-sm">No active alerts matching your filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((alt) => (
            <div
              key={alt.id}
              className={`glass-card p-6 border-l-4 transition-all space-y-3 ${
                alt.severity === 'CRITICAL' || alt.severity === 'HIGH'
                  ? 'border-l-rose-500 bg-rose-50/20'
                  : alt.severity === 'MEDIUM'
                  ? 'border-l-amber-500 bg-amber-50/20'
                  : 'border-l-emerald-500 bg-emerald-50/20'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-bold text-slate-900 text-base">{alt.title}</h3>
                  <RiskBadge level={alt.severity} />
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {alt.district ? `${alt.district}, ${alt.state}` : alt.state || 'All Regions'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {alt.starts_at ? new Date(alt.starts_at).toLocaleDateString() : 'Active'}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {alt.description}
              </p>

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100">
                <span>Category: {alt.category}</span>
                <span>Issued by State Crop Protection Cell</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
