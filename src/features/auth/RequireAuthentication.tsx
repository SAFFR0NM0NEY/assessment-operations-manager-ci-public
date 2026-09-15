import { Navigate, Outlet, useLocation } from 'react-router';

import { loginRoute } from '../../app/routeMeta';
import { LoadingState } from '../../components/ui';
import { useAuth } from './useAuth';

function getReturnToPath(location: ReturnType<typeof useLocation>) {
  return `${location.pathname}${location.search}${location.hash}`;
}

export function RequireAuthentication() {
  const location = useLocation();
  const { status } = useAuth();

  if (status === 'initializing') {
    return (
      <main className="app-page" aria-labelledby="auth-loading-title">
        <LoadingState
          description="Checking whether this browser already has a development session."
          id="auth-loading-title"
          title="Checking private access"
        />
      </main>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <Navigate replace state={{ returnTo: getReturnToPath(location) }} to={loginRoute.path} />
    );
  }

  return <Outlet />;
}
