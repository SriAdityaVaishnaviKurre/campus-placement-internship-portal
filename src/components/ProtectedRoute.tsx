import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Array<'admin' | 'student' | 'recruiter'>;
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="cyber-canvas flex items-center justify-center min-h-[60vh]">
        <div className="text-[var(--cyber-cyan)] animate-pulse text-2xl font-bold">
          Synchronizing system data... Please wait...
        </div>
      </div>
    );
  }

  if (!user) {
    // Force target login redirects
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="cyber-canvas text-center py-20">
        <h2 className="text-3xl font-bold" style={{ color: 'var(--cyber-magenta)' }}>Access Denied</h2>
        <p className="mt-4 text-[var(--text-muted)] text-sm">
          You do not have the required permissions to view this dashboard section.
        </p>
        <Navigate to="/dashboard" replace />
      </div>
    );
  }

  return <>{children}</>;
}
