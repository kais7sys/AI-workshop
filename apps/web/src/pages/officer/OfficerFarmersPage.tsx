import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, MapPin, ArrowRight, Search } from 'lucide-react';
import { api } from '../../lib/api.js';
import { Profile } from '../../types/index.js';

export const OfficerFarmersPage: React.FC = () => {
  const [farmers, setFarmers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadFarmers() {
      try {
        setLoading(true);
        const data = await api.get<Profile[]>('/api/admin/users?role=FARMER');
        setFarmers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadFarmers();
  }, []);

  const filtered = farmers.filter((f) => {
    const text = `${f.full_name} ${f.district || ''} ${f.village || ''}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Assigned Block Farmers</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Registered farmers under your administrative block jurisdiction in Ludhiana, Punjab.
          </p>
        </div>

        <div className="w-full sm:w-64 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by farmer name or village..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 py-2 text-xs"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 text-sm">Loading block farmers registry...</div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-500">No farmers found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((f) => (
            <div key={f.id} className="glass-card p-5 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-base">{f.full_name}</h3>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {f.farming_experience || 10}+ yrs exp
                  </span>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{f.village || 'Sidwan Bet'}, {f.taluka || 'Jagraon'}, {f.district || 'Ludhiana'}</span>
                </p>
                <div className="text-xs text-slate-600 mt-2">
                  Contact: <span className="font-medium text-slate-800">{f.phone || '+91 98765 43210'}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <Link
                  to={`/officer/farmers/${f.id}`}
                  className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1"
                >
                  <span>View Farm Records & History</span>
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
