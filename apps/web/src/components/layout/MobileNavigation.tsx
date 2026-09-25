import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  Sparkles,
  MessageSquare,
  LifeBuoy,
} from 'lucide-react';

export const MobileNavigation: React.FC = () => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 flex items-center justify-around px-2 shadow-lg">
      <MobileNavLink to="/dashboard" icon={<LayoutDashboard className="w-5 h-5" />} label="Home" />
      <MobileNavLink to="/farms" icon={<MapPin className="w-5 h-5" />} label="Farms" />
      <MobileNavLink to="/advisory" icon={<Sparkles className="w-5 h-5 text-emerald-600" />} label="AI Advice" />
      <MobileNavLink to="/chat" icon={<MessageSquare className="w-5 h-5" />} label="Chat" />
      <MobileNavLink to="/cases" icon={<LifeBuoy className="w-5 h-5" />} label="Cases" />
    </nav>
  );
};

const MobileNavLink: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({
  to,
  icon,
  label,
}) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex flex-col items-center justify-center gap-1 w-14 py-1 text-[10px] font-medium transition-colors ${
        isActive ? 'text-agri-600 font-bold' : 'text-slate-500 hover:text-slate-900'
      }`
    }
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);
