import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Sprout,
  LayoutDashboard,
  MapPin,
  Sparkles,
  History,
  MessageSquare,
  Bug,
  Landmark,
  BellRing,
  LifeBuoy,
  Users,
  ShieldAlert,
  FileText,
  Settings,
  Activity,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.js';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const role = user?.role || 'FARMER';

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-200 border-r border-slate-800 shrink-0 select-none">
      {/* Platform Branding */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-agri-600 to-emerald-400 flex items-center justify-center text-white shadow-glow">
          <Sprout className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-white text-base tracking-tight leading-none">KrishiSeva</h1>
          <span className="text-[11px] text-emerald-400 font-medium uppercase tracking-wider">Dept of Agriculture</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-3 space-y-6 overflow-y-auto">
        {/* Farmer Portal Section */}
        {role === 'FARMER' && (
          <div>
            <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Farmer Services
            </div>
            <nav className="space-y-1">
              <SidebarLink to="/dashboard" icon={<LayoutDashboard className="w-4 h-4" />} label="Farm Overview" />
              <SidebarLink to="/farms" icon={<MapPin className="w-4 h-4" />} label="My Farms & Fields" />
              <SidebarLink to="/advisory" icon={<Sparkles className="w-4 h-4 text-emerald-400" />} label="AI Crop Advisory" />
              <SidebarLink to="/advisory/history" icon={<History className="w-4 h-4" />} label="Advisory History" />
              <SidebarLink to="/chat" icon={<MessageSquare className="w-4 h-4" />} label="Agricultural AI Chat" />
              <SidebarLink to="/disease-assistant" icon={<Bug className="w-4 h-4 text-amber-400" />} label="Pest & Disease Help" />
              <SidebarLink to="/schemes" icon={<Landmark className="w-4 h-4" />} label="Government Schemes" />
              <SidebarLink to="/alerts" icon={<BellRing className="w-4 h-4" />} label="Regional Alerts" />
              <SidebarLink to="/cases" icon={<LifeBuoy className="w-4 h-4" />} label="Officer Support Cases" />
            </nav>
          </div>
        )}

        {/* Officer Portal Section */}
        {role === 'OFFICER' && (
          <div>
            <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
              Agriculture Officer Portal
            </div>
            <nav className="space-y-1">
              <SidebarLink to="/officer/dashboard" icon={<LayoutDashboard className="w-4 h-4" />} label="Officer Dashboard" />
              <SidebarLink to="/officer/cases" icon={<LifeBuoy className="w-4 h-4" />} label="Farmer Cases" />
              <SidebarLink to="/officer/farmers" icon={<Users className="w-4 h-4" />} label="Assigned Farmers" />
              <SidebarLink to="/officer/advisories" icon={<Sparkles className="w-4 h-4" />} label="Advisory Audit" />
              <SidebarLink to="/officer/alerts" icon={<BellRing className="w-4 h-4" />} label="Publish Alerts" />
              <SidebarLink to="/officer/content" icon={<FileText className="w-4 h-4" />} label="Advisory Bulletins" />
            </nav>
          </div>
        )}

        {/* Administrator Portal Section */}
        {role === 'ADMIN' && (
          <div>
            <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-amber-400">
              Department Admin
            </div>
            <nav className="space-y-1">
              <SidebarLink to="/admin/dashboard" icon={<Activity className="w-4 h-4" />} label="System Overview" />
              <SidebarLink to="/admin/users" icon={<Users className="w-4 h-4" />} label="User & Role Mgmt" />
              <SidebarLink to="/admin/officers" icon={<UserCheck className="w-4 h-4" />} label="Officer Management" />
              <SidebarLink to="/admin/crops" icon={<Sprout className="w-4 h-4" />} label="Crops Catalog" />
              <SidebarLink to="/admin/schemes" icon={<Landmark className="w-4 h-4" />} label="Government Schemes" />
              <SidebarLink to="/admin/alerts" icon={<BellRing className="w-4 h-4" />} label="System Alerts" />
              <SidebarLink to="/admin/advisories" icon={<Sparkles className="w-4 h-4" />} label="AI Advisory Audit" />
              <SidebarLink to="/admin/audit-logs" icon={<ShieldAlert className="w-4 h-4" />} label="Security Audit Logs" />
              <SidebarLink to="/admin/system" icon={<Settings className="w-4 h-4" />} label="System & AI Config" />
            </nav>
          </div>
        )}
      </div>

      {/* Role Indicator Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="text-xs text-slate-400">Logged in as:</div>
        <div className="font-semibold text-white truncate text-sm">{user?.fullName}</div>
        <div className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
          {role}
        </div>
      </div>
    </aside>
  );
};

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
          isActive
            ? 'bg-agri-600 text-white shadow-sm'
            : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};
