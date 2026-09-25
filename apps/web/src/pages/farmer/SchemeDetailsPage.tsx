import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Landmark, ArrowLeft, ExternalLink, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';
import { api } from '../../lib/api.js';
import { Scheme } from '../../types/index.js';

export const SchemeDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadScheme() {
      if (!id) return;
      try {
        setLoading(true);
        const data = await api.get<Scheme>(`/api/schemes/${id}`);
        setScheme(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadScheme();
  }, [id]);

  if (loading) return <div className="p-12 text-center text-slate-500 text-sm">Loading scheme details...</div>;
  if (!scheme) return <div className="p-12 text-center text-slate-500 text-sm">Scheme record not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/schemes')}
        className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Schemes Directory</span>
      </button>

      <div className="glass-card p-6 sm:p-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
              Verified Government Program
            </span>
            <span className="text-xs text-slate-500">{scheme.department || 'Dept of Agriculture'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {scheme.name}
          </h2>
        </div>

        {/* Scheme Description */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm text-slate-700 leading-relaxed">
          {scheme.description}
        </div>

        {/* Benefits */}
        {scheme.benefits && (
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Program Benefits & Financial Support</span>
            </h3>
            <p className="text-sm text-slate-600 bg-emerald-50/40 p-4 rounded-xl border border-emerald-100 leading-relaxed">
              {scheme.benefits}
            </p>
          </div>
        )}

        {/* Eligibility */}
        {scheme.eligibility && (
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Eligibility Criteria</span>
            </h3>
            <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed">
              {scheme.eligibility}
            </p>
          </div>
        )}

        {/* Required Documents */}
        {scheme.required_documents && scheme.required_documents.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              Required Documentation
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              {scheme.required_documents.map((doc, i) => (
                <li key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Application Information */}
        {scheme.application_information && (
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              How to Apply
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {scheme.application_information}
            </p>
          </div>
        )}

        {/* Official Reference Link */}
        {scheme.official_source && (
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Official Ministry Portal:{' '}
              <a
                href={scheme.official_source}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 font-bold hover:underline"
              >
                {scheme.official_source}
              </a>
            </span>
            <a
              href={scheme.official_source}
              target="_blank"
              rel="noreferrer"
              className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
            >
              <span>Visit Official Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
