import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';
import { UserRole } from '../../types/index.js';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
        <div className="w-10 h-10 border-4 border-agri-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Verifying KrishiSeva Credentials...
        </span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-4">
          <span className="text-2xl font-bold">!</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Restricted Access</h2>
        <p className="text-sm text-slate-600 max-w-md mb-6">
          This section is exclusively reserved for {allowedRoles.join(' or ')} personnel. Your current role is <strong>{user.role}</strong>.
        </p>
        <button
          onClick={() => window.history.back()}
          className="btn-secondary text-xs"
        >
          Go Back
        </button>
      </div>
    );
  }

  return children;
};
