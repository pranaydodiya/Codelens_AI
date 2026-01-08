import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { Loader2 } from 'lucide-react';
import { sanitizeRedirectUrl } from '@/lib/security';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    // Sanitize the current path before storing it for redirect
    const sanitizedPath = sanitizeRedirectUrl(location.pathname, '/dashboard');
    // Redirect to login, preserving the intended destination
    return <Navigate to="/login" state={{ from: { pathname: sanitizedPath } }} replace />;
  }

  return <>{children}</>;
}
