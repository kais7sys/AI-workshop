import React, { useState, useEffect } from 'react';
import { ShieldAlert, Clock, User, Filter, Search } from 'lucide-react';
import { api } from '../../lib/api.js';
import { AuditLog } from '../../types/index.js';

export const AdminAuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadLogs() {
      try {
        setLoading(true);
        const data = await api.get<AuditLog[]>('/api/admin/audit-logs');
        setLogs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  const filtered = logs.filter((l) =>
    `${l.action} ${l.entity_type || ''} ${JSON.stringify(l.metadata || {})}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-600" />
            <span>Security & Compliance Audit Trail</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Immutable system logs documenting administrative access, user role modifications, and advisory generation events.
          </p>
        </div>

        <div className="w-full sm:w-64 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search audit actions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 py-2 text-xs"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 text-sm">Loading security audit records...</div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-500">
          <p className="text-sm font-semibold">No audit logs matching "{search}".</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Action</th>
                <th className="p-4">Entity Type</th>
                <th className="p-4">Metadata Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11px]">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/50">
                  <td className="p-4 whitespace-nowrap text-slate-500 font-sans">
                    {new Date(l.created_at).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-slate-100 text-slate-800 border border-slate-200">
                      {l.action}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600 font-sans">{l.entity_type || 'system'}</td>
                  <td className="p-4 text-slate-500 max-w-xs truncate">
                    {JSON.stringify(l.metadata || {})}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
