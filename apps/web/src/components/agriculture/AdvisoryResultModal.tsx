import React from 'react';
import {
  X,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Droplets,
  Layers,
  Bug,
  ShieldCheck,
  HelpCircle,
  FileCheck,
} from 'lucide-react';
import { Advisory } from '../../types/index.js';
import { RiskBadge } from './RiskBadge.js';

interface AdvisoryResultModalProps {
  advisory: Advisory | null;
  onClose: () => void;
}

export const AdvisoryResultModal: React.FC<AdvisoryResultModalProps> = ({
  advisory,
  onClose,
}) => {
  if (!advisory) return null;
  const res = advisory.ai_response;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">AI Crop Advisory Dossier</h3>
                <RiskBadge level={res.riskLevel} />
              </div>
              <p className="text-xs text-slate-300">
                Generated {new Date(advisory.created_at).toLocaleDateString()} via {advisory.model_name || 'Gemini 3.8 Flash'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-700">
          {/* Executive Summary */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
              Executive Situation Summary
            </div>
            <p className="text-slate-800 font-medium leading-relaxed">{res.summary}</p>
          </div>

          {/* Assessment & Confidence */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                Detailed Crop Assessment
              </h4>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                Confidence: {Math.round((res.confidence || 0.85) * 100)}%
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {res.assessment}
            </p>
          </div>

          {/* Immediate Actions */}
          {res.immediateActions && res.immediateActions.length > 0 && (
            <div>
              <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-2 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Immediate Actions (Priority 0-48h)
              </h4>
              <ul className="space-y-2">
                {res.immediateActions.map((act, i) => (
                  <li key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-slate-800">{act}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Short-Term Recommendations */}
          {res.shortTermRecommendations && res.shortTermRecommendations.length > 0 && (
            <div>
              <h4 className="font-bold text-slate-900 mb-2">Short-Term Field Management</h4>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
                {res.shortTermRecommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          )}

          {/* 2-Column Grid: Irrigation & Nutrients */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100">
              <h4 className="font-bold text-sky-900 flex items-center gap-2 mb-2 text-xs uppercase tracking-wider">
                <Droplets className="w-4 h-4 text-sky-600" />
                Irrigation Guidance
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {res.irrigationGuidance.map((irr, i) => (
                  <li key={i}>• {irr}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100">
              <h4 className="font-bold text-amber-900 flex items-center gap-2 mb-2 text-xs uppercase tracking-wider">
                <Layers className="w-4 h-4 text-amber-600" />
                Nutrient Considerations
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {res.nutrientConsiderations.map((nut, i) => (
                  <li key={i}>• {nut}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pest & Disease + Preventive */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100">
              <h4 className="font-bold text-rose-900 flex items-center gap-2 mb-2 text-xs uppercase tracking-wider">
                <Bug className="w-4 h-4 text-rose-600" />
                Pest & Disease Watch
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {res.pestDiseaseConsiderations.map((p, i) => (
                  <li key={i}>• {p}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
              <h4 className="font-bold text-emerald-900 flex items-center gap-2 mb-2 text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Preventive Measures
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {res.preventiveMeasures.map((pm, i) => (
                  <li key={i}>• {pm}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Follow-Up Questions */}
          {res.followUpQuestions && res.followUpQuestions.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-2 text-xs uppercase tracking-wider">
                <HelpCircle className="w-4 h-4 text-slate-500" />
                Diagnostic Follow-Up Questions
              </h4>
              <ul className="space-y-1 text-xs text-slate-600 list-disc list-inside">
                {res.followUpQuestions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Professional Review Notice & Safety Disclaimer */}
          {res.professionalReviewRecommended && (
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-300 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-amber-900 text-xs uppercase">Field Inspection Recommended</div>
                <p className="text-xs text-amber-800 mt-0.5">
                  Due to the sensitivity of observed symptoms, we strongly recommend requesting a physical inspection or consultation with your local Block Agriculture Officer.
                </p>
              </div>
            </div>
          )}

          <div className="p-3.5 rounded-xl bg-slate-100 text-slate-500 text-[11px] leading-relaxed italic border border-slate-200">
            <strong>Statutory Disclaimer:</strong> {res.disclaimer}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="btn-secondary text-xs">
            Close Advisory
          </button>
        </div>
      </div>
    </div>
  );
};
