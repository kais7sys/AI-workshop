import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.js';
import { Header } from './Header.js';
import { MobileNavigation } from './MobileNavigation.js';

export const AppShell: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Desktop Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-8">
          <Outlet />
        </main>
        <MobileNavigation />
      </div>
    </div>
  );
};
