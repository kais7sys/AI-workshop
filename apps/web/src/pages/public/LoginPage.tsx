import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sprout, LogIn, Shield, Briefcase, Tractor } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.js';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { login, switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'ramesh.farmer@agri.gov.in',
      password: 'password123',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      setServerError(null);
      await login(values.email, values.password);
      if (values.email.includes('officer')) {
        navigate('/officer/dashboard');
      } else if (values.email.includes('admin')) {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setServerError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleQuickLogin = (role: 'FARMER' | 'OFFICER' | 'ADMIN') => {
    switchDemoRole(role);
    if (role === 'OFFICER') {
      navigate('/officer/dashboard');
    } else if (role === 'ADMIN') {
      navigate('/admin/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-agri-600 to-emerald-400 items-center justify-center text-white shadow-glow">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Portal Authentication</h2>
          <p className="text-xs text-slate-500">Sign in to your KrishiSeva Department Account</p>
        </div>

        {/* 1-Click Evaluation Accounts */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 text-center">
            Instant Test Access (1-Click Login)
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('FARMER')}
              className="p-2 rounded-xl bg-white border border-emerald-200 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors flex flex-col items-center gap-1 shadow-xs"
            >
              <Tractor className="w-4 h-4 text-emerald-600" />
              <span>Farmer</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('OFFICER')}
              className="p-2 rounded-xl bg-white border border-emerald-200 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors flex flex-col items-center gap-1 shadow-xs"
            >
              <Briefcase className="w-4 h-4 text-emerald-700" />
              <span>Officer</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('ADMIN')}
              className="p-2 rounded-xl bg-white border border-emerald-200 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors flex flex-col items-center gap-1 shadow-xs"
            >
              <Shield className="w-4 h-4 text-slate-800" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {serverError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              {...register('email')}
              placeholder="e.g. ramesh.farmer@agri.gov.in"
              className="input-field text-sm"
            />
            {errors.email && (
              <span className="text-xs text-rose-600 font-medium mt-1 block">
                {errors.email.message}
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs font-semibold text-agri-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              {...register('password')}
              placeholder="••••••••"
              className="input-field text-sm"
            />
            {errors.password && (
              <span className="text-xs text-rose-600 font-medium mt-1 block">
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary py-3 text-sm font-bold flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          New farmer?{' '}
          <Link to="/register" className="font-bold text-agri-600 hover:underline">
            Register your profile
          </Link>
        </div>
      </div>
    </div>
  );
};
