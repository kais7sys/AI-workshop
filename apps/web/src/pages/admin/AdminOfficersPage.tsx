import React, { useState, useEffect } from 'react';
import { UserCheck, ShieldCheck, MapPin, Mail, Phone } from 'lucide-react';
import { api } from '../../lib/api.js';
import { Profile } from '../../types/index.js';

export const AdminOfficersPage: React.FC = () => {
  const [officers, setOfficers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOfficers() {
      try {
        setLoading(true);
        const data = await api.get<Profile[]>('/api/admin/users?role=OFFICER');
        setOfficers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadOfficers();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-emerald-600" />
          <span>Agricultural Extension Officers Management</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage block extension specialists, plant pathologists, and regional officers responsible for farmer cases.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {officers.map((o) => (
          <div key={o.id} className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 font-extrabold text-base flex items-center justify-center">
                {o.full_name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">{o.full_name}</h3>
                <span className="text-xs text-slate-500 block">Block Agricultural Extension Officer</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Assigned Block: <strong>{o.district || 'Ludhiana'}, {o.state || 'Punjab'}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Contact: <strong>{o.phone || '+91 98765 88990'}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Status: <strong>Active & Verified Officer</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
