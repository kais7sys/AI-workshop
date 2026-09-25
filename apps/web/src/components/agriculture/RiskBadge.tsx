import React from 'react';

interface RiskBadgeProps {
  level?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'UNKNOWN' | string;
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level = 'UNKNOWN', className = '' }) => {
  const norm = level.toUpperCase();

  let colors = 'bg-slate-100 text-slate-700 border-slate-200';
  if (norm === 'LOW') {
    colors = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (norm === 'MEDIUM') {
    colors = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (norm === 'HIGH' || norm === 'CRITICAL' || norm === 'URGENT') {
    colors = 'bg-rose-50 text-rose-700 border-rose-200';
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${colors} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {norm}
    </span>
  );
};
