import React, { useState, useEffect } from 'react';
import { Users, Shield, CheckCircle, Search } from 'lucide-react';
import { api } from '../../lib/api.js';
import { Profile } from '../../types/index.js';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await api.get<Profile[]>('/api/admin/users');
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await api.patch(`/api/admin/users/${userId}/role`, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole as any } : u))
      );
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = users.filter((u) =>
    `${u.full_name} ${u.role} ${u.district || ''}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-600" />
            <span>User & Access Control Directory</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            View registered agricultural users, modify roles, and enforce least-privilege RBAC.
          </p>
        </div>

        <div className="w-full sm:w-64 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 py-2 text-xs"
          />
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>User role updated and logged to security audit trail.</span>
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Jurisdiction / Location</th>
              <th className="p-4">Current Role</th>
              <th className="p-4 text-right">Change Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-slate-900">{u.full_name}</div>
                  <div className="text-[11px] text-slate-400">{u.phone || 'No phone'}</div>
                </td>
                <td className="p-4">
                  {u.district ? `${u.district}, ${u.state}` : u.state || 'Headquarters'}
                </td>
                <td className="p-4">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      u.role === 'ADMIN'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : u.role === 'OFFICER'
                        ? 'bg-sky-100 text-sky-800 border border-sky-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    className="input-field text-xs py-1 px-2 w-28 text-slate-800"
                  >
                    <option value="FARMER">FARMER</option>
                    <option value="OFFICER">OFFICER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
