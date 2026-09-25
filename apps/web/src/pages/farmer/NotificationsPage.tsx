import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Clock } from 'lucide-react';
import { api } from '../../lib/api.js';
import { Notification } from '../../types/index.js';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await api.get<Notification[]>('/api/notifications');
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.patch(`/api/notifications/${id}/read`, {});
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch('/api/notifications/read-all', {});
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read_at: new Date().toISOString() }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-emerald-600" />
            <span>Notifications & Dispatches</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Advisory completion alerts, officer notes, and departmental communications.
          </p>
        </div>

        {notifications.some((n) => !n.read_at) && (
          <button
            onClick={handleMarkAllRead}
            className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4 text-emerald-600" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 text-sm">Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-500 space-y-2">
          <Bell className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold">No notifications right now.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            const isUnread = !n.read_at;

            return (
              <div
                key={n.id}
                className={`glass-card p-4 flex items-start justify-between gap-4 transition-all ${
                  isUnread ? 'border-emerald-300 bg-emerald-50/20' : 'bg-white opacity-85'
                }`}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{n.title}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                      {n.type}
                    </span>
                    {isUnread && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-slate-400 block pt-1">
                    {new Date(n.created_at).toLocaleString()}
                  </span>
                </div>

                {isUnread && (
                  <button
                    onClick={() => handleMarkAsRead(n.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
