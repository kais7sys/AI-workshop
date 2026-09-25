import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  Sparkles,
  ShieldCheck,
  LifeBuoy,
  Landmark,
  ArrowRight,
  TrendingUp,
  CheckCircle,
} from 'lucide-react';
import { WeatherCard } from '../../components/agriculture/WeatherCard.js';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <header className="h-20 border-b border-slate-800 px-6 sm:px-12 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-glow">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white">KrishiSeva</span>
            <span className="block text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
              Department of Agriculture
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Portal Login
          </Link>
          <Link
            to="/register"
            className="btn-primary text-xs px-4 py-2"
          >
            Farmer Sign Up
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 max-w-7xl mx-auto px-6 sm:px-12 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            AI-Assisted Precision Agriculture
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
            Empowering Farmers With Scientific <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Crop Intelligence</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
            A state-of-the-art digital agriculture platform connecting Indian farmers with real-time weather analytics, certified agronomic crop advisory, early disease detection, and direct officer support.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              to="/dashboard"
              className="btn-primary px-6 py-3 text-sm font-bold flex items-center gap-2"
            >
              <span>Access Farmer Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/schemes"
              className="btn-secondary px-6 py-3 text-sm font-semibold bg-slate-800 text-slate-100 border-slate-700 hover:bg-slate-750"
            >
              Browse Government Schemes
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-800">
            <div>
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-xs text-slate-400">Scientific Validation</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-xs text-slate-400">AI Agronomic Assistant</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">Direct</div>
              <div className="text-xs text-slate-400">Field Officer Access</div>
            </div>
          </div>
        </div>

        {/* Hero Interactive Preview Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Live Platform Telemetry Preview
          </div>
          <WeatherCard location="Ludhiana Agricultural District, Punjab" />

          <div className="glass-card p-5 bg-slate-800/90 border border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Latest Department Alert
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                HIGH SEVERITY
              </span>
            </div>
            <h4 className="font-bold text-white text-sm">
              Heatwave & High Evapotranspiration Surge
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Daytime temperatures approaching 42°C. Farmers are advised to provide light and frequent evening irrigation to standing wheat crops.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="bg-slate-950 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <h2 className="text-3xl font-extrabold text-white">Integrated Agricultural Services</h2>
            <p className="text-slate-400 text-sm">
              Comprehensive digital ecosystem engineered specifically for farmers, extension officers, and agricultural department administrators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Crop Advisory</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Stage-specific irrigation, nutrient management, and soil guidance calibrated to micro-climate.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Pest & Disease Help</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Symptom analysis, probabilistic diagnosis, safe cultural practices, and biological controls.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <Landmark className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Government Schemes</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Central and state subsidies, PM-KISAN, crop insurance (PMFBY), and micro-irrigation grants.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <LifeBuoy className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Officer Support Cases</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct case escalation to assigned Block Agriculture Officers with AI-assisted briefings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-6 text-center text-xs text-slate-500">
        KrishiSeva Platform • Ministry & Department of Agriculture Digital Initiative
      </footer>
    </div>
  );
};
