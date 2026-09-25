import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sprout, UserPlus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.js';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  state: z.string().min(2, 'State is required'),
  district: z.string().min(2, 'District is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      state: 'Punjab',
      district: 'Ludhiana',
      password: '',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      setServerError(null);
      await registerAuth(values.fullName, values.email, values.phone, 'FARMER');
      navigate('/dashboard');
    } catch (err: any) {
      setServerError(err.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-agri-600 to-emerald-400 items-center justify-center text-white shadow-glow">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Farmer Registration</h2>
          <p className="text-xs text-slate-500">Create your KrishiSeva Department Farmer Account</p>
        </div>

        {serverError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Full Legal Name
            </label>
            <input
              type="text"
              {...register('fullName')}
              placeholder="e.g. Ramesh Kumar"
              className="input-field text-sm"
            />
            {errors.fullName && (
              <span className="text-xs text-rose-600 font-medium mt-1 block">
                {errors.fullName.message}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                {...register('email')}
                placeholder="ramesh@example.com"
                className="input-field text-sm"
              />
              {errors.email && (
                <span className="text-xs text-rose-600 font-medium mt-1 block">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                {...register('phone')}
                placeholder="+91 9876543210"
                className="input-field text-sm"
              />
              {errors.phone && (
                <span className="text-xs text-rose-600 font-medium mt-1 block">
                  {errors.phone.message}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                State
              </label>
              <input
                type="text"
                {...register('state')}
                placeholder="Punjab"
                className="input-field text-sm"
              />
              {errors.state && (
                <span className="text-xs text-rose-600 font-medium mt-1 block">
                  {errors.state.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                District
              </label>
              <input
                type="text"
                {...register('district')}
                placeholder="Ludhiana"
                className="input-field text-sm"
              />
              {errors.district && (
                <span className="text-xs text-rose-600 font-medium mt-1 block">
                  {errors.district.message}
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Password
            </label>
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
            className="w-full btn-primary py-3 text-sm font-bold flex items-center justify-center gap-2 mt-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>{isSubmitting ? 'Registering...' : 'Complete Registration'}</span>
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-agri-600 hover:underline">
            Sign in to your account
          </Link>
        </div>
      </div>
    </div>
  );
};
