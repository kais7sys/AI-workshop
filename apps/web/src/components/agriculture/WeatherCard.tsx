import React from 'react';
import { CloudSun, Droplets, Wind, AlertTriangle, Thermometer } from 'lucide-react';

interface WeatherCardProps {
  location?: string;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ location = 'Ludhiana, Punjab' }) => {
  return (
    <div className="glass-card p-6 bg-gradient-to-br from-white via-emerald-50/20 to-teal-50/30 border border-emerald-100 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
              Live Micro-Climate
            </span>
            <span className="text-xs text-slate-500 font-medium">{location}</span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-1">41°C</h3>
          <p className="text-xs text-slate-600 font-medium">Dry Heatwave Warning Active — High Evapotranspiration</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
          <CloudSun className="w-7 h-7" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
        <div className="p-3 rounded-xl bg-white border border-slate-100 flex items-center gap-2">
          <Droplets className="w-4 h-4 text-sky-500 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Humidity</div>
            <div className="font-bold text-slate-800">48%</div>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-white border border-slate-100 flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-rose-500 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Heat Stress</div>
            <div className="font-bold text-rose-600">Elevated</div>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-white border border-slate-100 flex items-center gap-2">
          <Droplets className="w-4 h-4 text-emerald-500 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Rain Risk</div>
            <div className="font-bold text-slate-800">0% (Nil)</div>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-white border border-slate-100 flex items-center gap-2">
          <Wind className="w-4 h-4 text-slate-400 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Wind Speed</div>
            <div className="font-bold text-slate-800">18 km/h</div>
          </div>
        </div>
      </div>

      <div className="p-3.5 rounded-xl bg-emerald-900/5 border border-emerald-200/50 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 leading-relaxed">
          <strong className="text-slate-900 font-semibold">Advisory:</strong> Schedule light evening irrigation to replenish canopy water loss. Avoid daytime foliar spray to prevent chemical leaf burn.
        </div>
      </div>
    </div>
  );
};
