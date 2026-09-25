import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  User as UserIcon,
  LogOut,
  Shield,
  Briefcase,
  Tractor,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.js';

export const Header: React.FC = () => {
  const { user, logout, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="glass-header h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Link to="/dashboard" className="lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-agri-600 flex items-center justify-center text-white">
            <Tractor className="w-5 h-5" />
          </div>
          <span className="font-bold text-slate-900 tracking-tight text-base">KrishiSeva</span>
        </Link>
        <div className="hidden sm:block text-xs text-slate-500 font-medium">
          Digital Agriculture Advisory & Field Officer Network
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Role Switcher for instant testing */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-medium">
          <span className="text-[11px] text-slate-400 px-2 hidden md:inline">Test Role:</span>
          <button
            onClick={() => {
              switchDemoRole('FARMER');
              navigate('/dashboard');
            }}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
              user?.role === 'FARMER'
                ? 'bg-agri-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Tractor className="w-3 h-3" />
            <span>Farmer</span>
          </button>
          <button
            onClick={() => {
              switchDemoRole('OFFICER');
              navigate('/officer/dashboard');
            }}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
              user?.role === 'OFFICER'
                ? 'bg-emerald-700 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-3 h-3" />
            <span>Officer</span>
          </button>
          <button
            onClick={() => {
              switchDemoRole('ADMIN');
              navigate('/admin/dashboard');
            }}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
              user?.role === 'ADMIN'
                ? 'bg-slate-800 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-3 h-3" />
            <span>Admin</span>
          </button>
        </div>

        {/* Notifications */}
        <Link
          to="/notifications"
          className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </Link>

        {/* User profile dropdown / button */}
        <Link
          to="/profile"
          className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors text-slate-700"
          title="Profile Settings"
        >
          <div className="w-8 h-8 rounded-full bg-agri-100 border border-agri-200 text-agri-800 flex items-center justify-center font-bold text-xs">
            <UserIcon className="w-4 h-4" />
          </div>
          <span className="hidden md:inline text-xs font-semibold">{user?.fullName}</span>
        </Link>

        {/* Logout */}
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
          title="Sign out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
