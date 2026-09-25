import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-agri-600 to-emerald-400 items-center justify-center text-white shadow-glow">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Password Recovery</h2>
          <p className="text-xs text-slate-500">Reset your KrishiSeva Department access credentials</p>
        </div>

        {submitted ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
            <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-slate-900 text-sm">Recovery Link Dispatched</h4>
            <p className="text-xs text-slate-600">
              We have dispatched password recovery instructions to <strong>{email}</strong>.
            </p>
            <Link to="/login" className="btn-secondary text-xs inline-block mt-2">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Registered Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ramesh.farmer@agri.gov.in"
                className="input-field text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full btn-primary py-3 text-sm font-bold flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>Send Recovery Link</span>
            </button>
          </form>
        )}

        <div className="text-center">
          <Link to="/login" className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
