import { QueryClientProvider, type QueryClient } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { BrowserRouter, HashRouter } from 'react-router';

import { AuthProvider, type AuthClient } from '../features/auth';
import { AuthorizationProvider, type AuthorizationClient } from '../features/authorization';
import { CampusContextProvider } from '../features/campus-context';
import { getPreferredRouterMode } from '../lib/desktopRuntime';
import { createQueryClient } from '../lib/queryClient';

interface AppProvidersProps {
  authClient?: AuthClient;
  authorizationClient?: AuthorizationClient;
  children: ReactNode;
  queryClient?: QueryClient;
}

export function AppProviders({
  authClient,
  authorizationClient,
  children,
  queryClient,
}: AppProvidersProps) {
  const [client] = useState(() => queryClient ?? createQueryClient());
  const Router = getPreferredRouterMode() === 'hash' ? HashRouter : BrowserRouter;

  return (
    <QueryClientProvider client={client}>
      <AuthProvider authClient={authClient}>
        <AuthorizationProvider authorizationClient={authorizationClient}>
          <CampusContextProvider>
            <Router>{children}</Router>
          </CampusContextProvider>
        </AuthorizationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
