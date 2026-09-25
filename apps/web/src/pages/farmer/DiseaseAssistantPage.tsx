import React, { useState } from 'react';
import {
  Bug,
  Upload,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { api } from '../../lib/api.js';
import { DiseasePestResult } from '../../types/index.js';

export const DiseaseAssistantPage: React.FC = () => {
  const [cropName, setCropName] = useState('Tomato');
  const [symptoms, setSymptoms] = useState(
    'Dark brown concentric rings appearing on lower leaves, surrounded by a yellowish chlorotic halo. The lower foliage is starting to wilt and drop.'
  );
  const [affectedParts, setAffectedParts] = useState(['Leaves', 'Lower Stems']);
  const [durationDays, setDurationDays] = useState(4);
  const [location, setLocation] = useState('Ludhiana, Punjab');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<DiseasePestResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDiagnose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim() || !cropName.trim()) return;

    try {
      setIsAnalyzing(true);
      setErrorMsg(null);
      const res = await api.post<DiseasePestResult>('/api/advisories/disease-check', {
        cropName,
        symptoms,
        affectedParts,
        durationDays: Number(durationDays),
        location,
      });
      setDiagnosisResult(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Diagnosis failed. Please verify your inputs.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Bug className="w-6 h-6 text-amber-600" />
          <span>Pest & Crop Pathology Assistant</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Describe plant distress symptoms and receive probabilistic causes, safe non-chemical cultural practices, and guidance on when to seek officer inspection.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-6 space-y-4">
          <form onSubmit={handleDiagnose} className="glass-card p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Affected Crop *
              </label>
              <input
                type="text"
                required
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                placeholder="e.g. Tomato, Wheat, Cotton, Mustard"
                className="input-field text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Detailed Symptom Description *
              </label>
              <textarea
                required
                rows={4}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Describe colors, spots, wilting, leaf curling, insect presence, spread rate..."
                className="input-field text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Days Observed
                </label>
                <input
                  type="number"
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Plot Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="input-field text-sm"
                />
              </div>
            </div>

            {/* Image Upload Area */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Upload Field Photo (Optional)
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:border-emerald-500 hover:bg-emerald-50/20 transition-all cursor-pointer">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <span className="text-xs font-semibold text-slate-700 block">Click to upload foliage photo</span>
                <span className="text-[10px] text-slate-400">JPG, PNG up to 10MB</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full btn-primary py-3 text-sm font-bold flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>{isAnalyzing ? 'Analyzing Pathological Markers...' : 'Run Probabilistic Assessment'}</span>
            </button>
          </form>
        </div>

        {/* Results Stream / Right Panel */}
        <div className="lg:col-span-6 space-y-4">
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {!diagnosisResult && !isAnalyzing && (
            <div className="glass-card p-8 text-center text-slate-500 space-y-3">
              <Bug className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-800 text-sm">Awaiting Symptom Input</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Submit the form on the left to view probable pathogen causes, non-harmful immediate cultural practices, and uncertainty notices.
              </p>
            </div>
          )}

          {diagnosisResult && (
            <div className="glass-card p-6 space-y-5 animate-slide-up">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-900 text-base">Probable Causes</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                  Probabilistic Analysis
                </span>
              </div>

              {/* Causes List */}
              <div className="space-y-3">
                {diagnosisResult.possibleCauses.map((cause, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{cause.name}</span>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        {Math.round(cause.confidence * 100)}% match
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{cause.reasoning}</p>
                  </div>
                ))}
              </div>

              {/* Immediate Non-harmful Actions */}
              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Immediate Safe Cultural Actions
                </h4>
                <ul className="space-y-1 text-xs text-slate-700 list-disc list-inside">
                  {diagnosisResult.immediateActions.map((act, i) => (
                    <li key={i}>{act}</li>
                  ))}
                </ul>
              </div>

              {/* Preventive Measures */}
              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5 text-slate-800">
                  <ShieldAlert className="w-4 h-4 text-emerald-600" />
                  Long-term Prevention
                </h4>
                <ul className="space-y-1 text-xs text-slate-700 list-disc list-inside">
                  {diagnosisResult.preventiveMeasures.map((pm, i) => (
                    <li key={i}>{pm}</li>
                  ))}
                </ul>
              </div>

              {/* Professional Review Notice */}
              {diagnosisResult.professionalInspectionRecommended && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900 leading-relaxed font-medium">
                    Physical Agriculture Officer Inspection is strongly recommended before applying commercial chemicals or restricted pesticides.
                  </div>
                </div>
              )}

              {/* Statutory Disclaimer */}
              <div className="p-3 rounded-xl bg-slate-100 text-slate-500 text-[11px] leading-relaxed italic border border-slate-200">
                <strong>Disclaimer:</strong> {diagnosisResult.disclaimer}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
